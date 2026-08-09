import {
  BODY_REGIONS,
  COMPLAINT_TYPES,
} from "../catalog/chief-complaint-1.js";
import { QUALITY_OPTIONS } from "../catalog/chief-complaint-quality.js";
import {
  formatApproxDuration,
  getTimeBucket,
} from "../catalog/chief-complaint-duration.js";
import {
  OPQRST_ONSET,
  OPQRST_PROVOCATION,
  OPQRST_QUALITY,
  OPQRST_RADIATION_SITES,
  OPQRST_RADIATION_TOGGLE_LABELS,
  OPQRST_REGIONS,
  OPQRST_TIME_PATTERN,
  OPQRST_TIME_UNKNOWN_LABELS,
} from "../catalog/chest-opqrst.js";
import { getHistoryCatalog, type HistoryStepId } from "../catalog/history-block.js";
import { type BilingualText } from "../catalog/labels.js";
import { getNonTraumaPrimary } from "../catalog/non-trauma-primary.js";
import { getSecondaryReason } from "../catalog/secondary-reason.js";
import { SUMMARY_COPY } from "../catalog/summary-copy.js";
import {
  TRAUMA_OHCA_LABELS,
  TRAUMA_TRAFFIC_OPTIONS,
  TRAUMA_VEHICLE_OPTIONS,
  formatMetersWithImperial,
  getTraumaInjury,
} from "../catalog/trauma-primary.js";
import { UI_COPY } from "../catalog/ui-copy.js";
import {
  INFORMANT_OPTIONS,
  SCENE_TYPE_OPTIONS,
} from "../content/start-labels.js";
import {
  getChiefComplaint1Detail,
  getPrimaryNote,
} from "./chief-complaint-1.js";
import {
  getChestOpqrstDetail,
  isChestOpqrstPath,
} from "./chest-opqrst.js";
import { getChiefComplaintQualityDetail } from "./chief-complaint-quality.js";
import { getChiefComplaintDurationDetail } from "./chief-complaint-duration.js";
import { getOtherSymptomsDetail } from "./other-symptoms.js";
import {
  type CaseState,
  type Informant,
  type InterviewStep,
  type SecondLanguage,
  emptyStepAnswer,
} from "./types.js";

export type SummaryLine = { zh: string; other: string };

export type SummarySection = {
  key: string;
  label: SummaryLine;
  value: SummaryLine;
  /** false when unknown / skipped / empty */
  obtained: boolean;
  editStep: InterviewStep;
};

type Lang = "zh" | SecondLanguage;

function pick(text: BilingualText, lang: Lang): string {
  return lang === "zh" ? text.zh : text[lang];
}

function line(text: BilingualText, lang: SecondLanguage): SummaryLine {
  return { zh: text.zh, other: pick(text, lang) };
}

function joinIds(
  ids: string[],
  lang: Lang,
  lookup: (id: string) => string | undefined,
): string {
  const sep = lang === "zh" || lang === "ja" ? "、" : ", ";
  return ids
    .map((id) => lookup(id) ?? id)
    .filter(Boolean)
    .join(sep);
}

function statusLine(
  status: string | undefined,
  lang: SecondLanguage,
): { obtained: boolean; value: SummaryLine } | null {
  if (status === "unknown") {
    return {
      obtained: false,
      value: line(SUMMARY_COPY.notObtainedUnknown, lang),
    };
  }
  if (status === "skipped") {
    return {
      obtained: false,
      value: line(SUMMARY_COPY.notObtainedSkipped, lang),
    };
  }
  if (!status || status === "empty") {
    return { obtained: false, value: line(SUMMARY_COPY.notObtained, lang) };
  }
  return null;
}

function informantName(id: Informant, lang: Lang): string {
  const opt = INFORMANT_OPTIONS.find((o) => o.id === id);
  return opt ? pick(opt.labels, lang) : id;
}

function chiefComplaintEditStep(state: CaseState): InterviewStep {
  const a1 = state.answers.chief_complaint_1;
  const aOpqrst = state.answers.chest_opqrst;
  const aQuality = state.answers.chief_complaint_quality;
  const aDur = state.answers.chief_complaint_duration;
  const incomplete = (status: string | undefined) =>
    !status || status === "empty";

  if (incomplete(a1?.status) && a1?.status !== "unknown" && a1?.status !== "skipped") {
    return "chief_complaint_1";
  }
  if (isChestOpqrstPath(state)) {
    if (
      aOpqrst?.status === "answered" ||
      aOpqrst?.status === "unknown" ||
      aOpqrst?.status === "skipped" ||
      incomplete(aOpqrst?.status)
    ) {
      return "chest_opqrst";
    }
    return "chief_complaint_1";
  }
  if (
    incomplete(aQuality?.status) &&
    aQuality?.status !== "unknown" &&
    aQuality?.status !== "skipped"
  ) {
    return "chief_complaint_quality";
  }
  if (
    incomplete(aDur?.status) &&
    aDur?.status !== "unknown" &&
    aDur?.status !== "skipped"
  ) {
    return "chief_complaint_duration";
  }
  if (aQuality?.status === "answered") return "chief_complaint_quality";
  if (aDur?.status === "answered") return "chief_complaint_duration";
  return "chief_complaint_1";
}

function lookupLabeled(
  options: { id: string; labels: BilingualText }[],
  id: string | null,
  lang: Lang,
): string | undefined {
  if (!id) return undefined;
  const opt = options.find((o) => o.id === id);
  return opt ? pick(opt.labels, lang) : undefined;
}

function formatOpqrstParts(state: CaseState, lang: Lang): string[] {
  const answer = state.answers.chest_opqrst;
  if (!answer) return [];
  if (answer.status === "unknown" || answer.status === "skipped") {
    const st =
      answer.status === "unknown"
        ? pick(SUMMARY_COPY.notObtainedUnknown, lang)
        : pick(SUMMARY_COPY.notObtainedSkipped, lang);
    return [`OPQRST：${st}`];
  }
  if (answer.status !== "answered") return [];

  const d = getChestOpqrstDetail(state);
  const parts: string[] = [];
  const onset = lookupLabeled(OPQRST_ONSET, d.onsetId, lang);
  if (onset) parts.push(onset);
  if (d.provocationIds.length) {
    parts.push(
      joinIds(d.provocationIds, lang, (id) =>
        lookupLabeled(OPQRST_PROVOCATION, id, lang),
      ),
    );
  }
  const quality = lookupLabeled(OPQRST_QUALITY, d.qualityId, lang);
  if (quality) parts.push(quality);
  if (d.regionIds.length) {
    parts.push(
      `${pick(SUMMARY_COPY.body, lang)}：${joinIds(d.regionIds, lang, (id) =>
        lookupLabeled(OPQRST_REGIONS, id, lang),
      )}`,
    );
  }
  if (d.radiation) {
    const sites = d.radiationSiteIds.length
      ? joinIds(d.radiationSiteIds, lang, (id) =>
          lookupLabeled(OPQRST_RADIATION_SITES, id, lang),
        )
      : "";
    parts.push(
      sites
        ? `${pick(OPQRST_RADIATION_TOGGLE_LABELS, lang)}：${sites}`
        : pick(OPQRST_RADIATION_TOGGLE_LABELS, lang),
    );
  }
  if (d.severity !== null) {
    parts.push(`${pick(SUMMARY_COPY.pain, lang)}：${d.severity}/10`);
  }
  const pattern = lookupLabeled(OPQRST_TIME_PATTERN, d.timePattern, lang);
  if (pattern) parts.push(pattern);
  return parts;
}

function formatChiefParts(state: CaseState, lang: Lang): string[] {
  const aQuality = state.answers.chief_complaint_quality;
  const aDur = state.answers.chief_complaint_duration;
  const d1 = getChiefComplaint1Detail(state);
  const dq = getChiefComplaintQualityDetail(state);
  const dDur = getChiefComplaintDurationDetail(state);
  const parts: string[] = [];
  const chestPath = isChestOpqrstPath(state);

  if (state.sceneType) {
    const scene = SCENE_TYPE_OPTIONS.find((o) => o.id === state.sceneType);
    if (scene) parts.push(pick(scene.labels, lang));
  }

  if (state.sceneType === "trauma") {
    if (d1.traumaOhca) {
      parts.push(pick(TRAUMA_OHCA_LABELS, lang));
    }
    if (d1.traumaTraffic) {
      const traffic = TRAUMA_TRAFFIC_OPTIONS.find(
        (o) => o.id === d1.traumaTraffic,
      );
      if (traffic) parts.push(pick(traffic.labels, lang));
    }
    if (d1.traumaVehicleId) {
      const vehicle = TRAUMA_VEHICLE_OPTIONS.find(
        (o) => o.id === d1.traumaVehicleId,
      );
      if (vehicle) parts.push(pick(vehicle.labels, lang));
    }
    if (d1.traumaInjuryTypeId) {
      const injury = getTraumaInjury(d1.traumaInjuryTypeId);
      if (injury) {
        let text = pick(injury.labels, lang);
        if (
          injury.asksFallHeight &&
          d1.traumaFallHeightMeters !== null
        ) {
          text += ` ${formatMetersWithImperial(
            d1.traumaFallHeightMeters,
            lang === "zh" ? "zh" : "en",
          )}`;
        }
        parts.push(text);
      }
    }
  } else if (d1.complaintTypeIds.length) {
    parts.push(
      joinIds(d1.complaintTypeIds, lang, (id) => {
        const nonTrauma = getNonTraumaPrimary(id)?.labels;
        if (nonTrauma) return pick(nonTrauma, lang);
        const labels = COMPLAINT_TYPES.find((c) => c.id === id)?.labels;
        return labels ? pick(labels, lang) : undefined;
      }),
    );
  }

  const primaryNote = getPrimaryNote(state).trim();
  if (primaryNote) {
    parts.push(`${pick(SUMMARY_COPY.note, lang)}：${primaryNote}`);
  }

  if (d1.bodyRegionIds.length) {
    const regions = joinIds(d1.bodyRegionIds, lang, (id) => {
      const labels = BODY_REGIONS.find((r) => r.id === id)?.labels;
      return labels ? pick(labels, lang) : undefined;
    });
    const subs = d1.bodySubregionIds.length
      ? `（${joinIds(d1.bodySubregionIds, lang, (id) => {
          for (const r of BODY_REGIONS) {
            const sub = r.subregions.find((s) => s.id === id);
            if (sub) return pick(sub.labels, lang);
          }
          return undefined;
        })}）`
      : "";
    parts.push(`${pick(SUMMARY_COPY.body, lang)}：${regions}${subs}`);
  }

  parts.push(...formatOpqrstParts(state, lang));

  if (!chestPath) {
    if (dq.qualityIds.length) {
      parts.push(
        `${pick(SUMMARY_COPY.quality, lang)}：${joinIds(
          dq.qualityIds,
          lang,
          (id) => {
            const labels = QUALITY_OPTIONS.find((q) => q.id === id)?.labels;
            return labels ? pick(labels, lang) : undefined;
          },
        )}`,
      );
    } else if (aQuality?.status === "unknown" || aQuality?.status === "skipped") {
      const st =
        aQuality.status === "unknown"
          ? pick(SUMMARY_COPY.notObtainedUnknown, lang)
          : pick(SUMMARY_COPY.notObtainedSkipped, lang);
      parts.push(`${pick(SUMMARY_COPY.quality, lang)}：${st}`);
    }
    if (dq.painScore !== null) {
      parts.push(`${pick(SUMMARY_COPY.pain, lang)}：${dq.painScore}/10`);
    }
  }

  {
    const durationText =
      dDur.timeAmount !== null &&
      dDur.timeAmount > 0 &&
      dDur.timeUnit !== null
        ? formatApproxDuration(dDur.timeAmount, dDur.timeUnit, lang)
        : dDur.timeBucketId
          ? (() => {
              const labels = getTimeBucket(dDur.timeBucketId)?.labels;
              return labels ? pick(labels, lang) : dDur.timeBucketId;
            })()
          : dDur.timeUnknown
            ? pick(OPQRST_TIME_UNKNOWN_LABELS, lang)
            : "";
    if (durationText) {
      const refine = dDur.timeRefine.trim()
        ? `；${pick(SUMMARY_COPY.refine, lang)}：${dDur.timeRefine.trim()}`
        : "";
      parts.push(`${pick(SUMMARY_COPY.time, lang)}：${durationText}${refine}`);
    } else if (
      !chestPath &&
      (aDur?.status === "unknown" || aDur?.status === "skipped")
    ) {
      const st =
        aDur.status === "unknown"
          ? pick(SUMMARY_COPY.notObtainedUnknown, lang)
          : pick(SUMMARY_COPY.notObtainedSkipped, lang);
      parts.push(`${pick(SUMMARY_COPY.time, lang)}：${st}`);
    } else if (dDur.timeRefine.trim()) {
      parts.push(
        `${pick(SUMMARY_COPY.time, lang)}：${pick(SUMMARY_COPY.refine, lang)}：${dDur.timeRefine.trim()}`,
      );
    }
  }
  return parts;
}

function formatChiefComplaint(
  state: CaseState,
  lang: SecondLanguage,
): SummarySection {
  const editStep = chiefComplaintEditStep(state);
  const a1 = state.answers.chief_complaint_1;
  const aOpqrst = state.answers.chest_opqrst;
  const aQuality = state.answers.chief_complaint_quality;
  const aDur = state.answers.chief_complaint_duration;
  const label = line(SUMMARY_COPY.chief, lang);
  const chestPath = isChestOpqrstPath(state);

  if (
    (a1?.status === "unknown" || a1?.status === "skipped") &&
    (!chestPath ||
      aOpqrst?.status === "unknown" ||
      aOpqrst?.status === "skipped" ||
      !aOpqrst ||
      aOpqrst.status === "empty") &&
    (aQuality?.status === "unknown" ||
      aQuality?.status === "skipped" ||
      !aQuality ||
      aQuality.status === "empty") &&
    (aDur?.status === "unknown" ||
      aDur?.status === "skipped" ||
      !aDur ||
      aDur.status === "empty")
  ) {
    const st = statusLine(a1?.status, lang);
    return {
      key: "chief",
      label,
      value: st?.value ?? line(SUMMARY_COPY.notObtained, lang),
      obtained: false,
      editStep,
    };
  }

  const zhParts = formatChiefParts(state, "zh");
  const otherParts = formatChiefParts(state, lang);
  // Scene type alone is not a chief narrative.
  const contentParts = zhParts.filter((p, i) => {
    if (i !== 0 || !state.sceneType) return true;
    const scene = SCENE_TYPE_OPTIONS.find((o) => o.id === state.sceneType);
    return !scene || p !== scene.labels.zh;
  });
  if (contentParts.length === 0) {
    const blocked =
      statusLine(a1?.status, lang) ??
      statusLine(aOpqrst?.status, lang) ??
      statusLine(aQuality?.status, lang) ??
      statusLine(aDur?.status, lang);
    return {
      key: "chief",
      label,
      value: blocked?.value ?? line(SUMMARY_COPY.notObtained, lang),
      obtained: false,
      editStep,
    };
  }

  return {
    key: "chief",
    label,
    value: { zh: zhParts.join("；"), other: otherParts.join("；") },
    obtained: true,
    editStep,
  };
}

function formatHistoryStep(
  state: CaseState,
  step: HistoryStepId,
  lang: SecondLanguage,
): SummarySection {
  const catalog = getHistoryCatalog(step);
  const label = catalog
    ? line(catalog.title, lang)
    : { zh: step, other: step };
  const answer = state.answers[step] ?? emptyStepAnswer();
  const blocked = statusLine(answer.status, lang);
  if (blocked && answer.optionIds.length === 0) {
    return {
      key: step,
      label,
      value: blocked.value,
      obtained: false,
      editStep: step,
    };
  }

  const namesFor = (L: Lang) =>
    joinIds(answer.optionIds, L, (id) => {
      const opt = catalog?.options.find((o) => o.id === id);
      if (!opt) return undefined;
      const name = pick(opt.labels, L);
      if (opt.group === "yesterday") {
        return `${pick(UI_COPY.intakeYesterday, L)}${name}`;
      }
      if (opt.group === "today") {
        return `${pick(UI_COPY.intakeToday, L)}${name}`;
      }
      return name;
    });

  const noteZh = answer.note.trim()
    ? `（${SUMMARY_COPY.note.zh}：${answer.note.trim()}）`
    : "";
  const noteOther = answer.note.trim()
    ? `（${pick(SUMMARY_COPY.note, lang)}：${answer.note.trim()}）`
    : "";
  const namesZh = namesFor("zh");
  const namesOther = namesFor(lang);
  if (!namesZh && !noteZh) {
    return {
      key: step,
      label,
      value: line(SUMMARY_COPY.notObtained, lang),
      obtained: false,
      editStep: step,
    };
  }
  return {
    key: step,
    label,
    value: {
      zh: `${namesZh}${noteZh}`,
      other: `${namesOther}${noteOther}`,
    },
    obtained: true,
    editStep: step,
  };
}

function formatOtherSymptoms(
  state: CaseState,
  lang: SecondLanguage,
): SummarySection {
  const answer = state.answers.other_symptoms;
  const blocked = statusLine(answer?.status, lang);
  const detail = getOtherSymptomsDetail(state);
  const label = line(SUMMARY_COPY.sense, lang);

  if (blocked && detail.reasonIds.length === 0) {
    return {
      key: "other_symptoms",
      label,
      value: blocked.value,
      obtained: false,
      editStep: "other_symptoms",
    };
  }

  const partsFor = (L: Lang) =>
    detail.reasonIds.length
      ? [
          joinIds(detail.reasonIds, L, (id) => {
            const labels = getSecondaryReason(state.sceneType, id)?.labels;
            return labels ? pick(labels, L) : undefined;
          }),
        ]
      : [];

  const zhParts = partsFor("zh");
  const otherParts = partsFor(lang);
  if (!zhParts.length) {
    return {
      key: "other_symptoms",
      label,
      value: line(SUMMARY_COPY.notObtained, lang),
      obtained: false,
      editStep: "other_symptoms",
    };
  }

  return {
    key: "other_symptoms",
    label,
    value: { zh: zhParts.join("；"), other: otherParts.join("；") },
    obtained: true,
    editStep: "other_symptoms",
  };
}

function formatInformant(
  state: CaseState,
  lang: SecondLanguage,
): SummarySection {
  const label = line(SUMMARY_COPY.informant, lang);
  if (!state.informant) {
    return {
      key: "informant",
      label,
      value: line(SUMMARY_COPY.notObtained, lang),
      obtained: false,
      editStep: "start",
    };
  }

  const valueFor = (L: Lang) => {
    const current = informantName(state.informant!, L);
    const history = state.informantHistory.map((i) => informantName(i, L));
    const changed =
      history.length > 1
        ? `（${pick(SUMMARY_COPY.midChange, L)}：${history.join(" → ")}）`
        : "";
    return `${current}${changed}`;
  };

  return {
    key: "informant",
    label,
    value: { zh: valueFor("zh"), other: valueFor(lang) },
    obtained: true,
    editStep: "start",
  };
}

export function buildSummarySections(state: CaseState): SummarySection[] {
  const lang = state.secondLanguage ?? "en";
  return [
    formatInformant(state, lang),
    formatChiefComplaint(state, lang),
    formatHistoryStep(state, "before", lang),
    formatHistoryStep(state, "intake", lang),
    formatHistoryStep(state, "past_history", lang),
    formatHistoryStep(state, "medications", lang),
    formatHistoryStep(state, "allergies", lang),
    formatOtherSymptoms(state, lang),
  ];
}

/** Always Chinese — for clipboard / record paste. */
export function formatSummaryText(state: CaseState): string {
  const lines = [
    "【救護現場雙語溝通輔助 · 本機摘要】",
    "",
    ...buildSummarySections(state).map((s) => `${s.label.zh}：${s.value.zh}`),
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
