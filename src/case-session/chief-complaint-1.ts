import {
  complaintTypesNeedBody,
  getBodyRegion,
} from "../catalog/chief-complaint-1.js";
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

  const region = getBodyRegion(regionId);
  if (!region) return state;

  const selected = new Set(detail.bodyRegionIds);
  if (selected.has(regionId)) {
    selected.delete(regionId);
    const subIds = new Set(region.subregions.map((s) => s.id));
    return writeDetail(state, {
      ...detail,
      bodyRegionIds: [...selected],
      bodySubregionIds: detail.bodySubregionIds.filter((id) => !subIds.has(id)),
      drilldownRegionId:
        detail.drilldownRegionId === regionId ? null : detail.drilldownRegionId,
    });
  }

  selected.add(regionId);
  return writeDetail(state, {
    ...detail,
    bodyRegionIds: [...selected],
    drilldownRegionId:
      region.subregions.length > 0 ? regionId : detail.drilldownRegionId,
  });
}

export function toggleBodySubregion(state: CaseState, subregionId: string): CaseState {
  const detail = readDetail(state);
  const set = new Set(detail.bodySubregionIds);
  if (set.has(subregionId)) set.delete(subregionId);
  else set.add(subregionId);
  return writeDetail(state, {
    ...detail,
    bodySubregionIds: [...set],
  });
}

export function clearBodyDrilldown(state: CaseState): CaseState {
  const detail = readDetail(state);
  return writeDetail(state, { ...detail, drilldownRegionId: null });
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
    return { ...state, currentStep: "chief_complaint_2" };
  }

  const detail = { ...readDetail(state), drilldownRegionId: null };
  return {
    ...writeDetail(state, detail),
    currentStep: "chief_complaint_2",
  };
}

export function goBackFromChiefComplaint1(state: CaseState): CaseState {
  return { ...state, currentStep: "start" };
}
