import {
  formatApproxDuration,
  getQualityOption,
  getTimeBucket,
  getTimeUnit,
} from "../catalog/chief-complaint-2.js";
import { getChiefComplaint1Detail } from "./chief-complaint-1.js";
import {
  type CaseState,
  type ChiefComplaint2Detail,
  type ChiefComplaintCombinedDetail,
  type ChiefComplaintDurationDetail,
  type SecondLanguage,
  emptyChiefComplaint2Detail,
  emptyChiefComplaintDurationDetail,
  emptyStepAnswer,
} from "./types.js";

function readQuality(state: CaseState): ChiefComplaint2Detail {
  const answer = state.answers.chief_complaint_2;
  if (!answer) return emptyChiefComplaint2Detail();
  const d = answer.detail as Partial<ChiefComplaint2Detail>;
  return {
    qualityIds: d.qualityIds ?? [],
    painScore: typeof d.painScore === "number" ? d.painScore : null,
  };
}

function readDuration(state: CaseState): ChiefComplaintDurationDetail {
  const answer = state.answers.chief_complaint_duration;
  if (!answer) return emptyChiefComplaintDurationDetail();
  const d = answer.detail as Partial<ChiefComplaintDurationDetail>;
  const unit = d.timeUnit;
  return {
    timeMode: d.timeMode ?? null,
    timeBucketId: d.timeBucketId ?? null,
    timeAmount: typeof d.timeAmount === "number" ? d.timeAmount : null,
    timeUnit:
      unit === "minutes" || unit === "hours" || unit === "days" ? unit : null,
    timeRefine: d.timeRefine ?? "",
  };
}

function hasDurationInput(detail: ChiefComplaintDurationDetail): boolean {
  return (
    detail.timeAmount !== null &&
    detail.timeAmount > 0 &&
    detail.timeUnit !== null
  );
}

function writeQuality(
  state: CaseState,
  detail: ChiefComplaint2Detail,
): CaseState {
  const hasContent =
    detail.qualityIds.length > 0 || detail.painScore !== null;

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

function writeDuration(
  state: CaseState,
  detail: ChiefComplaintDurationDetail,
): CaseState {
  const hasContent =
    detail.timeBucketId !== null ||
    hasDurationInput(detail) ||
    detail.timeRefine.trim() !== "";

  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_duration: {
        ...emptyStepAnswer(),
        status: hasContent ? "answered" : "empty",
        detail: { ...detail },
      },
    },
  };
}

/** Combined quality + duration detail (summary / bilingual preview). */
export function getChiefComplaint2Detail(
  state: CaseState,
): ChiefComplaintCombinedDetail {
  return { ...readQuality(state), ...readDuration(state) };
}

export function getChiefComplaintDurationDetail(
  state: CaseState,
): ChiefComplaintDurationDetail {
  return readDuration(state);
}

export function formatDurationForLang(
  state: CaseState,
  lang: "zh" | SecondLanguage,
): string {
  const detail = readDuration(state);
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
  const option = getQualityOption(qualityId);
  if (!option) return state;

  const detail = readQuality(state);
  const set = new Set(detail.qualityIds);

  if (option.exclusive) {
    if (set.has(qualityId) && set.size === 1) {
      return writeQuality(state, { ...detail, qualityIds: [] });
    }
    return writeQuality(state, { ...detail, qualityIds: [qualityId] });
  }

  set.delete("same_as_complaint");
  for (const id of [...set]) {
    if (getQualityOption(id)?.exclusive) set.delete(id);
  }
  if (set.has(qualityId)) set.delete(qualityId);
  else set.add(qualityId);
  return writeQuality(state, { ...detail, qualityIds: [...set] });
}

export function selectTimeBucket(state: CaseState, bucketId: string): CaseState {
  const bucket = getTimeBucket(bucketId);
  if (!bucket) return state;
  return writeDuration(state, {
    ...readDuration(state),
    timeMode: bucket.mode,
    timeBucketId: bucket.id,
    timeAmount: null,
    timeUnit: null,
  });
}

export function setTimeAmount(state: CaseState, raw: string): CaseState {
  const trimmed = raw.trim();
  if (trimmed === "") {
    const detail = readDuration(state);
    return writeDuration(state, {
      ...detail,
      timeAmount: null,
      timeMode: detail.timeUnit ? "duration" : detail.timeMode,
      timeBucketId: null,
    });
  }
  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 9999) return state;
  const rounded = Math.round(amount);
  const detail = readDuration(state);
  return writeDuration(state, {
    ...detail,
    timeAmount: rounded,
    timeMode: "duration",
    timeBucketId: null,
  });
}

export function setTimeUnit(state: CaseState, unitId: string): CaseState {
  const unit = getTimeUnit(unitId);
  if (!unit) return state;
  return writeDuration(state, {
    ...readDuration(state),
    timeUnit: unit.id,
    timeMode: "duration",
    timeBucketId: null,
  });
}

export function setTimeRefine(state: CaseState, timeRefine: string): CaseState {
  return writeDuration(state, {
    ...readDuration(state),
    timeRefine,
  });
}

export function setPainScore(state: CaseState, score: number): CaseState {
  if (!showsPainScale(state)) return state;
  if (!Number.isInteger(score) || score < 1 || score > 10) return state;
  return writeQuality(state, {
    ...readQuality(state),
    painScore: score,
  });
}

export function clearPainScore(state: CaseState): CaseState {
  return writeQuality(state, {
    ...readQuality(state),
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

export function markChiefComplaintDurationUnknown(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_duration: {
        ...emptyStepAnswer(),
        status: "unknown",
        detail: emptyChiefComplaintDurationDetail(),
      },
    },
  };
}

export function skipChiefComplaintDuration(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_duration: {
        ...emptyStepAnswer(),
        status: "skipped",
        detail: emptyChiefComplaintDurationDetail(),
      },
    },
  };
}

export function canCompleteChiefComplaint2(state: CaseState): boolean {
  const answer = state.answers.chief_complaint_2;
  if (!answer) return false;
  if (answer.status === "unknown" || answer.status === "skipped") return true;
  if (answer.status !== "answered") return false;
  const detail = readQuality(state);
  return detail.qualityIds.length > 0 || detail.painScore !== null;
}

export function canCompleteChiefComplaintDuration(state: CaseState): boolean {
  const answer = state.answers.chief_complaint_duration;
  if (!answer) return false;
  if (answer.status === "unknown" || answer.status === "skipped") return true;
  if (answer.status !== "answered") return false;
  const detail = readDuration(state);
  return detail.timeBucketId !== null || hasDurationInput(detail);
}

/** Finish 怎麼不舒服 → 多久了. */
export function completeChiefComplaint2(state: CaseState): CaseState {
  if (!canCompleteChiefComplaint2(state)) return state;

  const status = state.answers.chief_complaint_2?.status;
  if (status === "unknown" || status === "skipped") {
    return { ...state, currentStep: "chief_complaint_duration" };
  }

  let next = state;
  if (!showsPainScale(state) && readQuality(state).painScore !== null) {
    next = clearPainScore(state);
  }

  return { ...next, currentStep: "chief_complaint_duration" };
}

/** Finish 多久了 → 之前. */
export function completeChiefComplaintDuration(state: CaseState): CaseState {
  if (!canCompleteChiefComplaintDuration(state)) return state;
  return { ...state, currentStep: "before" };
}

export function goBackFromChiefComplaint2(state: CaseState): CaseState {
  return { ...state, currentStep: "chief_complaint_1" };
}

export function goBackFromChiefComplaintDuration(state: CaseState): CaseState {
  return { ...state, currentStep: "chief_complaint_2" };
}
