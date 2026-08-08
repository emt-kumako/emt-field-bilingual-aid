import {
  getQualityOption,
  QUALITY_OPTIONS,
} from "../catalog/chief-complaint-quality.js";
import { getChiefComplaint1Detail } from "./chief-complaint-1.js";
import { nextSelectedIds } from "./option-selection.js";
import {
  type CaseState,
  type ChiefComplaintQualityDetail,
  emptyChiefComplaintQualityDetail,
  emptyStepAnswer,
} from "./types.js";

function readQuality(state: CaseState): ChiefComplaintQualityDetail {
  const answer = state.answers.chief_complaint_quality;
  if (!answer) return emptyChiefComplaintQualityDetail();
  const d = answer.detail as Partial<ChiefComplaintQualityDetail>;
  return {
    qualityIds: d.qualityIds ?? [],
    painScore: typeof d.painScore === "number" ? d.painScore : null,
  };
}

function writeQuality(
  state: CaseState,
  detail: ChiefComplaintQualityDetail,
): CaseState {
  const hasContent =
    detail.qualityIds.length > 0 || detail.painScore !== null;

  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_quality: {
        ...emptyStepAnswer(),
        status: hasContent ? "answered" : "empty",
        optionIds: [...detail.qualityIds],
        detail: { ...detail },
      },
    },
  };
}

export function getChiefComplaintQualityDetail(
  state: CaseState,
): ChiefComplaintQualityDetail {
  return readQuality(state);
}

/** Pain scale only when 主訴 step 1 includes pain. */
export function showsPainScale(state: CaseState): boolean {
  return getChiefComplaint1Detail(state).complaintTypeIds.includes("pain");
}

export function toggleQuality(state: CaseState, qualityId: string): CaseState {
  if (!getQualityOption(qualityId)) return state;
  const detail = readQuality(state);
  return writeQuality(state, {
    ...detail,
    qualityIds: nextSelectedIds(detail.qualityIds, QUALITY_OPTIONS, qualityId),
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

export function markChiefComplaintQualityUnknown(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_quality: {
        ...emptyStepAnswer(),
        status: "unknown",
        detail: emptyChiefComplaintQualityDetail(),
      },
    },
  };
}

export function skipChiefComplaintQuality(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_quality: {
        ...emptyStepAnswer(),
        status: "skipped",
        detail: emptyChiefComplaintQualityDetail(),
      },
    },
  };
}

export function canCompleteChiefComplaintQuality(state: CaseState): boolean {
  const answer = state.answers.chief_complaint_quality;
  if (!answer) return false;
  if (answer.status === "unknown" || answer.status === "skipped") return true;
  if (answer.status !== "answered") return false;
  const detail = readQuality(state);
  return detail.qualityIds.length > 0 || detail.painScore !== null;
}

/** Finish 怎麼不舒服 → 多久了. */
export function completeChiefComplaintQuality(state: CaseState): CaseState {
  if (!canCompleteChiefComplaintQuality(state)) return state;

  const status = state.answers.chief_complaint_quality?.status;
  if (status === "unknown" || status === "skipped") {
    return { ...state, currentStep: "chief_complaint_duration" };
  }

  let next = state;
  if (!showsPainScale(state) && readQuality(state).painScore !== null) {
    next = clearPainScore(state);
  }

  return { ...next, currentStep: "chief_complaint_duration" };
}

export function goBackFromChiefComplaintQuality(state: CaseState): CaseState {
  return { ...state, currentStep: "chief_complaint_1" };
}
