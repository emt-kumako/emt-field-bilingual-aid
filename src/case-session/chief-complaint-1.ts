import { complaintTypesNeedBody } from "../catalog/chief-complaint-1.js";
import {
  clearDrilldown,
  toggleRegion,
  toggleSubregion,
} from "./body-selection.js";
import {
  type CaseState,
  type ChiefComplaint1Detail,
  emptyChiefComplaint1Detail,
  emptyStepAnswer,
} from "./types.js";

function readDetail(state: CaseState): ChiefComplaint1Detail {
  const answer = state.answers.chief_complaint_1;
  if (!answer) return emptyChiefComplaint1Detail();
  const d = answer.detail as Partial<ChiefComplaint1Detail>;
  return {
    complaintTypeIds: d.complaintTypeIds ?? [],
    bodyRegionIds: d.bodyRegionIds ?? [],
    bodySubregionIds: d.bodySubregionIds ?? [],
    drilldownRegionId: d.drilldownRegionId ?? null,
  };
}

function writeDetail(state: CaseState, detail: ChiefComplaint1Detail): CaseState {
  const hasContent =
    detail.complaintTypeIds.length > 0 ||
    detail.bodyRegionIds.length > 0 ||
    detail.bodySubregionIds.length > 0;

  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_1: {
        ...emptyStepAnswer(),
        status: hasContent ? "answered" : "empty",
        optionIds: [...detail.complaintTypeIds],
        detail: { ...detail },
      },
    },
  };
}

export function getChiefComplaint1Detail(state: CaseState): ChiefComplaint1Detail {
  return readDetail(state);
}

export function needsBodyLocation(state: CaseState): boolean {
  return complaintTypesNeedBody(readDetail(state).complaintTypeIds);
}

export function toggleComplaintType(state: CaseState, complaintTypeId: string): CaseState {
  const detail = readDetail(state);
  const set = new Set(detail.complaintTypeIds);
  if (set.has(complaintTypeId)) set.delete(complaintTypeId);
  else set.add(complaintTypeId);

  return writeDetail(state, {
    ...detail,
    complaintTypeIds: [...set],
  });
}

export function toggleBodyRegion(state: CaseState, regionId: string): CaseState {
  const detail = readDetail(state);
  const next = toggleRegion(detail, regionId);
  if (!next) return state;
  return writeDetail(state, { ...detail, ...next });
}

export function toggleBodySubregion(state: CaseState, subregionId: string): CaseState {
  const detail = readDetail(state);
  return writeDetail(state, {
    ...detail,
    ...toggleSubregion(detail, subregionId),
  });
}

export function clearBodyDrilldown(state: CaseState): CaseState {
  const detail = readDetail(state);
  return writeDetail(state, { ...detail, ...clearDrilldown(detail) });
}

export function markChiefComplaint1Unknown(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_1: {
        ...emptyStepAnswer(),
        status: "unknown",
        detail: emptyChiefComplaint1Detail(),
      },
    },
  };
}

export function skipChiefComplaint1(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_1: {
        ...emptyStepAnswer(),
        status: "skipped",
        detail: emptyChiefComplaint1Detail(),
      },
    },
  };
}

export function canCompleteChiefComplaint1(state: CaseState): boolean {
  const answer = state.answers.chief_complaint_1;
  if (!answer) return false;
  if (answer.status === "unknown" || answer.status === "skipped") return true;
  if (answer.status !== "answered") return false;

  const detail = readDetail(state);
  if (detail.complaintTypeIds.length === 0) return false;
  if (complaintTypesNeedBody(detail.complaintTypeIds)) {
    return detail.bodyRegionIds.length > 0;
  }
  return true;
}

/** Finish step 1 (including skip/unknown) and move to 主訴 step 2. */
export function completeChiefComplaint1(state: CaseState): CaseState {
  if (!canCompleteChiefComplaint1(state)) return state;

  const status = state.answers.chief_complaint_1?.status;
  if (status === "unknown" || status === "skipped") {
    return { ...state, currentStep: "chief_complaint_quality" };
  }

  const detail = { ...readDetail(state), drilldownRegionId: null };
  return {
    ...writeDetail(state, detail),
      currentStep: "chief_complaint_quality",
  };
}

export function goBackFromChiefComplaint1(state: CaseState): CaseState {
  return { ...state, currentStep: "start" };
}
