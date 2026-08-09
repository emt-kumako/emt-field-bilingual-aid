import { getHistoryCatalog, type HistoryStepId } from "../catalog/history-block.js";
import { type BilingualText } from "../catalog/labels.js";
import { getSecondaryReason } from "../catalog/secondary-reason.js";
import { SUMMARY_COPY } from "../catalog/summary-copy.js";
import { UI_COPY } from "../catalog/ui-copy.js";
import { INFORMANT_OPTIONS } from "../content/start-labels.js";
import { buildChiefNarrativeFacts } from "./chief-narrative.js";
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

function formatChiefComplaint(
  state: CaseState,
  lang: SecondLanguage,
): SummarySection {
  const label = line(SUMMARY_COPY.chief, lang);
  const facts = buildChiefNarrativeFacts(state);
  const a1 = state.answers.chief_complaint_1;
  const aOpqrst = state.answers.chest_opqrst;
  const aQuality = state.answers.chief_complaint_quality;
  const aDur = state.answers.chief_complaint_duration;

  if (!facts.obtained || facts.fragments.length === 0) {
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
      editStep: facts.editStep,
    };
  }

  return {
    key: "chief",
    label,
    value: {
      zh: facts.fragments.map((f) => f.zh).join("；"),
      other: facts.fragments.map((f) => f.other).join("；"),
    },
    obtained: true,
    editStep: facts.editStep,
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
