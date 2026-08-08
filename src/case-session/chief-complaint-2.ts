import {
  formatApproxDuration,
  getTimeBucket,
  getTimeUnit,
} from "../catalog/chief-complaint-2.js";
import { getChiefComplaint1Detail } from "./chief-complaint-1.js";
import {
  type CaseState,
  type ChiefComplaint2Detail,
  type SecondLanguage,
  emptyChiefComplaint2Detail,
  emptyStepAnswer,
} from "./types.js";

function readDetail(state: CaseState): ChiefComplaint2Detail {
  const answer = state.answers.chief_complaint_2;
  if (!answer) return emptyChiefComplaint2Detail();
  const d = answer.detail as Partial<ChiefComplaint2Detail>;
  const unit = d.timeUnit;
  return {
    qualityIds: d.qualityIds ?? [],
    timeMode: d.timeMode ?? null,
    timeBucketId: d.timeBucketId ?? null,
    timeAmount: typeof d.timeAmount === "number" ? d.timeAmount : null,
    timeUnit:
      unit === "minutes" || unit === "hours" || unit === "days" ? unit : null,
    timeRefine: d.timeRefine ?? "",
    painScore: typeof d.painScore === "number" ? d.painScore : null,
  };
}

function hasDurationInput(detail: ChiefComplaint2Detail): boolean {
  return (
    detail.timeAmount !== null &&
    detail.timeAmount > 0 &&
    detail.timeUnit !== null
  );
}

function writeDetail(state: CaseState, detail: ChiefComplaint2Detail): CaseState {
  const hasContent =
    detail.qualityIds.length > 0 ||
    detail.timeBucketId !== null ||
    hasDurationInput(detail) ||
    detail.timeRefine.trim() !== "" ||
    detail.painScore !== null;

  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_2: {
        ...emptyStepAnswer(),
        status: hasContent ? "answered" : "empty",
        optionIds: [...detail.qualityIds],
        detail: { ...detail },
      },
    },
  };
}

export function getChiefComplaint2Detail(state: CaseState): ChiefComplaint2Detail {
  return readDetail(state);
}

export function formatDurationForLang(
  state: CaseState,
  lang: "zh" | SecondLanguage,
): string {
  const detail = readDetail(state);
  if (hasDurationInput(detail) && detail.timeUnit) {
    return formatApproxDuration(detail.timeAmount!, detail.timeUnit, lang);
  }
  if (detail.timeBucketId) {
    const labels = getTimeBucket(detail.timeBucketId)?.labels;
    if (!labels) return detail.timeBucketId;
    return lang === "zh" ? labels.zh : labels[lang];
  }
  return "";
}

/** Pain scale only when 主訴 step 1 includes pain. */
export function showsPainScale(state: CaseState): boolean {
  return getChiefComplaint1Detail(state).complaintTypeIds.includes("pain");
}

export function toggleQuality(state: CaseState, qualityId: string): CaseState {
  const detail = readDetail(state);
  const set = new Set(detail.qualityIds);
  if (set.has(qualityId)) set.delete(qualityId);
  else set.add(qualityId);
  return writeDetail(state, { ...detail, qualityIds: [...set] });
}

export function selectTimeBucket(state: CaseState, bucketId: string): CaseState {
  const bucket = getTimeBucket(bucketId);
  if (!bucket) return state;
  return writeDetail(state, {
    ...readDetail(state),
    timeMode: bucket.mode,
    timeBucketId: bucket.id,
    timeAmount: null,
    timeUnit: null,
  });
}

export function setTimeAmount(state: CaseState, raw: string): CaseState {
  const trimmed = raw.trim();
  if (trimmed === "") {
    const detail = readDetail(state);
    return writeDetail(state, {
      ...detail,
      timeAmount: null,
      timeMode: detail.timeUnit ? "duration" : detail.timeMode,
      timeBucketId: null,
    });
  }
  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 9999) return state;
  const rounded = Math.round(amount);
  const detail = readDetail(state);
  return writeDetail(state, {
    ...detail,
    timeAmount: rounded,
    timeMode: "duration",
    timeBucketId: null,
  });
}

export function setTimeUnit(state: CaseState, unitId: string): CaseState {
  const unit = getTimeUnit(unitId);
  if (!unit) return state;
  return writeDetail(state, {
    ...readDetail(state),
    timeUnit: unit.id,
    timeMode: "duration",
    timeBucketId: null,
  });
}

export function setTimeRefine(state: CaseState, timeRefine: string): CaseState {
  return writeDetail(state, {
    ...readDetail(state),
    timeRefine,
  });
}

export function setPainScore(state: CaseState, score: number): CaseState {
  if (!showsPainScale(state)) return state;
  if (!Number.isInteger(score) || score < 1 || score > 10) return state;
  return writeDetail(state, {
    ...readDetail(state),
    painScore: score,
  });
}

export function clearPainScore(state: CaseState): CaseState {
  return writeDetail(state, {
    ...readDetail(state),
    painScore: null,
  });
}

export function markChiefComplaint2Unknown(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_2: {
        ...emptyStepAnswer(),
        status: "unknown",
        detail: emptyChiefComplaint2Detail(),
      },
    },
  };
}

export function skipChiefComplaint2(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_2: {
        ...emptyStepAnswer(),
        status: "skipped",
        detail: emptyChiefComplaint2Detail(),
      },
    },
  };
}

export function canCompleteChiefComplaint2(state: CaseState): boolean {
  const answer = state.answers.chief_complaint_2;
  if (!answer) return false;
  if (answer.status === "unknown" || answer.status === "skipped") return true;
  if (answer.status !== "answered") return false;
  const detail = readDetail(state);
  return (
    detail.timeBucketId !== null ||
    hasDurationInput(detail) ||
    detail.qualityIds.length > 0 ||
    detail.painScore !== null
  );
}

/** Finish 主訴 step 2 and enter 之前. */
export function completeChiefComplaint2(state: CaseState): CaseState {
  if (!canCompleteChiefComplaint2(state)) return state;

  const status = state.answers.chief_complaint_2?.status;
  if (status === "unknown" || status === "skipped") {
    return { ...state, currentStep: "before" };
  }

  // Drop pain score if complaint is no longer pain (e.g. edited step 1 later).
  let next = state;
  if (!showsPainScale(state) && readDetail(state).painScore !== null) {
    next = clearPainScore(state);
  }

  return { ...next, currentStep: "before" };
}

export function goBackFromChiefComplaint2(state: CaseState): CaseState {
  return { ...state, currentStep: "chief_complaint_1" };
}
