import {
  formatApproxDuration,
  getTimeBucket,
  getTimeUnit,
} from "../catalog/chief-complaint-duration.js";
import {
  backFromPathStep,
  nextAfterDuration,
} from "./chief-complaint-path.js";
import {
  type CaseState,
  type ChiefComplaintDurationDetail,
  type DurationTimePattern,
  type SecondLanguage,
  emptyChiefComplaintDurationDetail,
  emptyStepAnswer,
} from "./types.js";

function readDuration(state: CaseState): ChiefComplaintDurationDetail {
  const answer = state.answers.chief_complaint_duration;
  if (!answer) return emptyChiefComplaintDurationDetail();
  const d = answer.detail as Partial<ChiefComplaintDurationDetail>;
  const unit = d.timeUnit;
  const pattern = d.timePattern;
  return {
    timeMode: d.timeMode ?? null,
    timeBucketId: d.timeBucketId ?? null,
    timeAmount: typeof d.timeAmount === "number" ? d.timeAmount : null,
    timeUnit:
      unit === "minutes" || unit === "hours" || unit === "days" ? unit : null,
    timeRefine: d.timeRefine ?? "",
    timePattern:
      pattern === "intermittent" || pattern === "continuous" ? pattern : null,
    timeUnknown: d.timeUnknown === true,
  };
}

function hasDurationInput(detail: ChiefComplaintDurationDetail): boolean {
  return (
    detail.timeAmount !== null &&
    detail.timeAmount > 0 &&
    detail.timeUnit !== null
  );
}

function writeDuration(
  state: CaseState,
  detail: ChiefComplaintDurationDetail,
  statusOverride?: "answered" | "empty" | "unknown",
): CaseState {
  const hasContent =
    detail.timeBucketId !== null ||
    hasDurationInput(detail) ||
    detail.timeRefine.trim() !== "" ||
    detail.timePattern !== null ||
    detail.timeUnknown;

  let status: "answered" | "empty" | "unknown" =
    statusOverride ?? (hasContent ? "answered" : "empty");
  if (!statusOverride && detail.timeUnknown && !hasDurationInput(detail)) {
    status = "unknown";
  }

  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_duration: {
        ...emptyStepAnswer(),
        status,
        detail: { ...detail },
      },
    },
  };
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

export function setTimePattern(
  state: CaseState,
  pattern: DurationTimePattern | null,
): CaseState {
  return writeDuration(state, {
    ...readDuration(state),
    timePattern: pattern,
  });
}

export function setTimeUnknown(state: CaseState, unknown: boolean): CaseState {
  const detail = readDuration(state);
  return writeDuration(
    state,
    {
      ...detail,
      timeUnknown: unknown,
      timeAmount: unknown ? null : detail.timeAmount,
      timeUnit: unknown ? null : detail.timeUnit,
      timeBucketId: unknown ? null : detail.timeBucketId,
    },
    unknown ? "unknown" : undefined,
  );
}

export function canCompleteChiefComplaintDuration(state: CaseState): boolean {
  const answer = state.answers.chief_complaint_duration;
  if (!answer) return false;
  if (answer.status === "unknown" || answer.status === "skipped") return true;
  if (answer.status !== "answered") return false;
  const detail = readDuration(state);
  return detail.timeBucketId !== null || hasDurationInput(detail);
}

/** OPQRST T: pattern + (approx duration or 時間不詳). */
export function durationSatisfiedFromOpqrst(state: CaseState): boolean {
  const detail = readDuration(state);
  if (!detail.timePattern) return false;
  return hasDurationInput(detail) || detail.timeUnknown;
}

/** Finish 多久了 → 之前. */
export function completeChiefComplaintDuration(state: CaseState): CaseState {
  if (!canCompleteChiefComplaintDuration(state)) return state;
  return { ...state, currentStep: nextAfterDuration(state) };
}

export function goBackFromChiefComplaintDuration(state: CaseState): CaseState {
  return { ...state, currentStep: backFromPathStep(state) };
}
