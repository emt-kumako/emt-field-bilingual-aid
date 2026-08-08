import {
  BODY_REGIONS,
  COMPLAINT_TYPES,
  getBodyRegion,
} from "../catalog/chief-complaint-1.js";
import {
  QUALITY_OPTIONS,
  formatApproxDuration,
  getTimeBucket,
} from "../catalog/chief-complaint-2.js";
import { getHistoryCatalog, type HistoryStepId } from "../catalog/history-block.js";
import { getAccompanyingSymptom } from "../catalog/other-symptoms.js";
import { getChiefComplaint1Detail } from "./chief-complaint-1.js";
import { getChiefComplaint2Detail } from "./chief-complaint-2.js";
import { getOtherSymptomsDetail } from "./other-symptoms.js";
import { DISCLAIMER_ZH } from "../content/disclaimer.js";
import {
  type CaseState,
  type Informant,
  type InterviewStep,
  emptyStepAnswer,
} from "./types.js";

export type SummarySection = {
  key: string;
  label: string;
  value: string;
  /** false when unknown / skipped / empty */
  obtained: boolean;
  editStep: InterviewStep;
};

const INFORMANT_ZH: Record<Informant, string> = {
  self: "本人",
  family: "家屬",
  friend: "友人",
  other: "其他",
};

function statusLabel(
  status: string | undefined,
): { obtained: boolean; value: string } | null {
  if (status === "unknown") return { obtained: false, value: "未取得（不知道）" };
  if (status === "skipped") return { obtained: false, value: "未取得（跳過）" };
  if (!status || status === "empty") {
    return { obtained: false, value: "未取得" };
  }
  return null;
}

function joinZh(ids: string[], lookup: (id: string) => string | undefined): string {
  return ids
    .map((id) => lookup(id) ?? id)
    .filter(Boolean)
    .join("、");
}

function formatChiefComplaint(state: CaseState): SummarySection {
  const editStep: InterviewStep = "chief_complaint_1";
  const a1 = state.answers.chief_complaint_1;
  const a2 = state.answers.chief_complaint_2;
  const blocked = statusLabel(a1?.status) ?? statusLabel(a2?.status);
  // If either step unknown/skipped and both not answered usefully, summarize status.
  if (
    (a1?.status === "unknown" || a1?.status === "skipped") &&
    (a2?.status === "unknown" ||
      a2?.status === "skipped" ||
      !a2 ||
      a2.status === "empty")
  ) {
    return {
      key: "chief",
      label: "主訴",
      value: statusLabel(a1?.status)?.value ?? "未取得",
      obtained: false,
      editStep,
    };
  }

  const d1 = getChiefComplaint1Detail(state);
  const d2 = getChiefComplaint2Detail(state);
  const parts: string[] = [];

  if (d1.complaintTypeIds.length) {
    parts.push(
      joinZh(
        d1.complaintTypeIds,
        (id) => COMPLAINT_TYPES.find((c) => c.id === id)?.labels.zh,
      ),
    );
  }
  if (d1.bodyRegionIds.length) {
    const regions = joinZh(
      d1.bodyRegionIds,
      (id) => BODY_REGIONS.find((r) => r.id === id)?.labels.zh,
    );
    const subs = d1.bodySubregionIds.length
      ? `（${joinZh(d1.bodySubregionIds, (id) => {
          for (const r of BODY_REGIONS) {
            const sub = r.subregions.find((s) => s.id === id);
            if (sub) return sub.labels.zh;
          }
          return undefined;
        })}）`
      : "";
    parts.push(`部位：${regions}${subs}`);
  }
  if (d2.qualityIds.length) {
    parts.push(
      `性質：${joinZh(
        d2.qualityIds,
        (id) => QUALITY_OPTIONS.find((q) => q.id === id)?.labels.zh,
      )}`,
    );
  }
  {
    const durationZh =
      d2.timeAmount !== null &&
      d2.timeAmount > 0 &&
      d2.timeUnit !== null
        ? formatApproxDuration(d2.timeAmount, d2.timeUnit, "zh")
        : d2.timeBucketId
          ? (getTimeBucket(d2.timeBucketId)?.labels.zh ?? d2.timeBucketId)
          : "";
    if (durationZh) {
      const refine = d2.timeRefine.trim()
        ? `；細調：${d2.timeRefine.trim()}`
        : "";
      parts.push(`時間：${durationZh}${refine}`);
    } else if (a2?.status === "unknown" || a2?.status === "skipped") {
      parts.push(`時間：${statusLabel(a2.status)?.value}`);
    } else if (d2.timeRefine.trim()) {
      parts.push(`時間：細調：${d2.timeRefine.trim()}`);
    }
  }
  if (d2.painScore !== null) {
    parts.push(`痛尺：${d2.painScore}/10`);
  }

  if (parts.length === 0) {
    return {
      key: "chief",
      label: "主訴",
      value: blocked?.value ?? "未取得",
      obtained: false,
      editStep,
    };
  }

  return {
    key: "chief",
    label: "主訴",
    value: parts.join("；"),
    obtained: true,
    editStep,
  };
}

function formatHistoryStep(
  state: CaseState,
  step: HistoryStepId,
  label: string,
): SummarySection {
  const answer = state.answers[step] ?? emptyStepAnswer();
  const blocked = statusLabel(answer.status);
  if (blocked && answer.optionIds.length === 0) {
    return {
      key: step,
      label,
      value: blocked.value,
      obtained: false,
      editStep: step,
    };
  }

  const catalog = getHistoryCatalog(step);
  const names = joinZh(
    answer.optionIds,
    (id) => catalog?.options.find((o) => o.id === id)?.labels.zh,
  );
  const note = answer.note.trim() ? `（備註：${answer.note.trim()}）` : "";
  if (!names && !note) {
    return {
      key: step,
      label,
      value: "未取得",
      obtained: false,
      editStep: step,
    };
  }
  return {
    key: step,
    label,
    value: `${names}${note}`,
    obtained: true,
    editStep: step,
  };
}

function formatOtherSymptoms(state: CaseState): SummarySection {
  const answer = state.answers.other_symptoms;
  const blocked = statusLabel(answer?.status);
  const detail = getOtherSymptomsDetail(state);

  if (
    blocked &&
    detail.symptomIds.length === 0 &&
    detail.bodyRegionIds.length === 0
  ) {
    return {
      key: "other_symptoms",
      label: "感",
      value: blocked.value,
      obtained: false,
      editStep: "other_symptoms",
    };
  }

  const parts: string[] = [];
  if (detail.symptomIds.length) {
    parts.push(
      joinZh(
        detail.symptomIds,
        (id) => getAccompanyingSymptom(id)?.labels.zh,
      ),
    );
  }
  if (detail.bodyRegionIds.length) {
    const regions = joinZh(
      detail.bodyRegionIds,
      (id) => getBodyRegion(id)?.labels.zh,
    );
    parts.push(`其他部位：${regions}`);
  }

  if (!parts.length) {
    return {
      key: "other_symptoms",
      label: "感",
      value: "未取得",
      obtained: false,
      editStep: "other_symptoms",
    };
  }

  return {
    key: "other_symptoms",
    label: "感",
    value: parts.join("；"),
    obtained: true,
    editStep: "other_symptoms",
  };
}

function formatInformant(state: CaseState): SummarySection {
  if (!state.informant) {
    return {
      key: "informant",
      label: "答題者",
      value: "未取得",
      obtained: false,
      editStep: "start",
    };
  }

  const current = INFORMANT_ZH[state.informant];
  const history = state.informantHistory.map((i) => INFORMANT_ZH[i]);
  const changed =
    history.length > 1
      ? `（中途變更：${history.join(" → ")}）`
      : "";

  return {
    key: "informant",
    label: "答題者",
    value: `${current}${changed}`,
    obtained: true,
    editStep: "start",
  };
}

export function buildSummarySections(state: CaseState): SummarySection[] {
  return [
    formatInformant(state),
    formatChiefComplaint(state),
    formatHistoryStep(state, "before", "之前"),
    formatHistoryStep(state, "intake", "吃"),
    formatHistoryStep(state, "past_history", "過"),
    formatHistoryStep(state, "medications", "藥"),
    formatHistoryStep(state, "allergies", "敏"),
    formatOtherSymptoms(state),
  ];
}

export function formatSummaryText(state: CaseState): string {
  const lines = [
    "【救護現場雙語溝通輔助 · 本機摘要】",
    DISCLAIMER_ZH,
    "",
    ...buildSummarySections(state).map(
      (s) => `${s.label}：${s.value}${s.obtained ? "" : ""}`,
    ),
  ];
  return lines.join("\n");
}

export function editFromSummary(
  state: CaseState,
  step: InterviewStep,
): CaseState {
  return {
    ...state,
    currentStep: step,
    returnToSummary: true,
  };
}

export function returnToSummaryView(state: CaseState): CaseState {
  return {
    ...state,
    currentStep: "summary",
    returnToSummary: false,
  };
}

/** Alias for finish / new case — wipes PHI. */
export { startNewCase as finishCase } from "./case-session.js";
