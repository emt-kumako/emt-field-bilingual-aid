import { complaintTypesNeedBody } from "../catalog/chief-complaint-1.js";
import {
  NON_TRAUMA_PRIMARY_REASONS,
  nonTraumaPrimaryOpensNote,
} from "../catalog/non-trauma-primary.js";
import {
  clearDrilldown,
  toggleRegion,
  toggleSubregion,
} from "./body-selection.js";
import { nextSelectedIds } from "./option-selection.js";
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

function readNote(state: CaseState): string {
  return state.answers.chief_complaint_1?.note ?? "";
}

function writeDetail(
  state: CaseState,
  detail: ChiefComplaint1Detail,
  note: string = readNote(state),
): CaseState {
  const hasContent =
    detail.complaintTypeIds.length > 0 ||
    detail.bodyRegionIds.length > 0 ||
    detail.bodySubregionIds.length > 0 ||
    note.trim().length > 0;

  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_1: {
        ...emptyStepAnswer(),
        status: hasContent ? "answered" : "empty",
        optionIds: [...detail.complaintTypeIds],
        note,
        detail: { ...detail },
      },
    },
  };
}

export function getChiefComplaint1Detail(state: CaseState): ChiefComplaint1Detail {
  return readDetail(state);
}

export function getPrimaryNote(state: CaseState): string {
  return readNote(state);
}

export function usesNonTraumaPrimary(state: CaseState): boolean {
  return state.sceneType === "non_trauma";
}

export function needsBodyLocation(state: CaseState): boolean {
  if (usesNonTraumaPrimary(state)) return false;
  return complaintTypesNeedBody(readDetail(state).complaintTypeIds);
}

export function primaryOpensNote(state: CaseState): boolean {
  if (!usesNonTraumaPrimary(state)) return false;
  return nonTraumaPrimaryOpensNote(readDetail(state).complaintTypeIds);
}

export function toggleComplaintType(
  state: CaseState,
  complaintTypeId: string,
): CaseState {
  const detail = readDetail(state);

  if (usesNonTraumaPrimary(state)) {
    const meta = NON_TRAUMA_PRIMARY_REASONS.map((o) => ({ id: o.id }));
    const nextIds = nextSelectedIds(
      detail.complaintTypeIds,
      meta,
      complaintTypeId,
      "single",
    );
    const nextDetail: ChiefComplaint1Detail = {
      complaintTypeIds: nextIds,
      bodyRegionIds: [],
      bodySubregionIds: [],
      drilldownRegionId: null,
    };
    const note = nonTraumaPrimaryOpensNote(nextIds) ? readNote(state) : "";
    return writeDetail(state, nextDetail, note);
  }

  const set = new Set(detail.complaintTypeIds);
  if (set.has(complaintTypeId)) set.delete(complaintTypeId);
  else set.add(complaintTypeId);

  return writeDetail(state, {
    ...detail,
    complaintTypeIds: [...set],
  });
}

export function setPrimaryNote(state: CaseState, note: string): CaseState {
  return writeDetail(state, readDetail(state), note);
}

export function toggleBodyRegion(state: CaseState, regionId: string): CaseState {
  const detail = readDetail(state);
  const next = toggleRegion(detail, regionId);
  if (!next) return state;
  return writeDetail(state, { ...detail, ...next });
}

export function toggleBodySubregion(
  state: CaseState,
  subregionId: string,
): CaseState {
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

  if (usesNonTraumaPrimary(state)) {
    return true;
  }

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
