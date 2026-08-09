import { complaintTypesNeedBody } from "../catalog/chief-complaint-1.js";
import {
  NON_TRAUMA_PRIMARY_REASONS,
  nonTraumaPrimaryOpensNote,
} from "../catalog/non-trauma-primary.js";
import {
  TRAUMA_INJURY_OPTIONS,
  TRAUMA_VEHICLE_OPTIONS,
  getTraumaInjury,
  type TraumaTrafficRelated,
} from "../catalog/trauma-primary.js";
import {
  clearDrilldown,
  toggleRegion,
  toggleSubregion,
} from "./body-selection.js";
import { nextAfterPrimary } from "./chief-complaint-path.js";
import { nextSelectedIds } from "./option-selection.js";
import {
  type CaseState,
  type ChiefComplaint1Detail,
  type TraumaPrimaryStage,
  emptyChiefComplaint1Detail,
  emptyStepAnswer,
} from "./types.js";

function readDetail(state: CaseState): ChiefComplaint1Detail {
  const answer = state.answers.chief_complaint_1;
  if (!answer) return emptyChiefComplaint1Detail();
  const d = answer.detail as Partial<ChiefComplaint1Detail>;
  const base = emptyChiefComplaint1Detail();
  return {
    ...base,
    complaintTypeIds: d.complaintTypeIds ?? [],
    bodyRegionIds: d.bodyRegionIds ?? [],
    bodySubregionIds: d.bodySubregionIds ?? [],
    drilldownRegionId: d.drilldownRegionId ?? null,
    traumaOhca: d.traumaOhca ?? false,
    traumaTraffic: d.traumaTraffic ?? null,
    traumaVehicleId: d.traumaVehicleId ?? null,
    traumaInjuryTypeId: d.traumaInjuryTypeId ?? null,
    traumaFallHeightMeters:
      d.traumaFallHeightMeters === undefined
        ? null
        : d.traumaFallHeightMeters,
    traumaStage: d.traumaStage ?? "mechanism",
  };
}

function readNote(state: CaseState): string {
  return state.answers.chief_complaint_1?.note ?? "";
}

function hasTraumaMechanismContent(detail: ChiefComplaint1Detail): boolean {
  return (
    detail.traumaOhca ||
    detail.traumaTraffic !== null ||
    detail.traumaVehicleId !== null ||
    detail.traumaInjuryTypeId !== null ||
    detail.traumaFallHeightMeters !== null
  );
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
    note.trim().length > 0 ||
    hasTraumaMechanismContent(detail);

  const optionIds = usesTraumaPrimary(state)
    ? [
        ...(detail.traumaOhca ? ["ohca"] : []),
        ...(detail.traumaTraffic ? [detail.traumaTraffic] : []),
        ...(detail.traumaVehicleId ? [detail.traumaVehicleId] : []),
        ...(detail.traumaInjuryTypeId ? [detail.traumaInjuryTypeId] : []),
      ]
    : [...detail.complaintTypeIds];

  return {
    ...state,
    answers: {
      ...state.answers,
      chief_complaint_1: {
        ...emptyStepAnswer(),
        status: hasContent ? "answered" : "empty",
        optionIds,
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

export function usesTraumaPrimary(state: CaseState): boolean {
  return state.sceneType === "trauma";
}

export function traumaAsksFallHeight(state: CaseState): boolean {
  const id = readDetail(state).traumaInjuryTypeId;
  if (!id) return false;
  return getTraumaInjury(id)?.asksFallHeight === true;
}

export function needsBodyLocation(state: CaseState): boolean {
  if (usesNonTraumaPrimary(state)) return false;
  if (usesTraumaPrimary(state)) {
    return readDetail(state).traumaStage === "body";
  }
  return complaintTypesNeedBody(readDetail(state).complaintTypeIds);
}

export function primaryOpensNote(state: CaseState): boolean {
  if (!usesNonTraumaPrimary(state)) return false;
  return nonTraumaPrimaryOpensNote(readDetail(state).complaintTypeIds);
}

export function canCompleteTraumaMechanism(state: CaseState): boolean {
  const detail = readDetail(state);
  if (!detail.traumaTraffic) return false;
  if (detail.traumaTraffic === "traffic") {
    return detail.traumaVehicleId !== null;
  }
  return detail.traumaInjuryTypeId !== null;
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
      ...emptyChiefComplaint1Detail(),
      complaintTypeIds: nextIds,
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

export function toggleTraumaOhca(state: CaseState): CaseState {
  if (!usesTraumaPrimary(state)) return state;
  const detail = readDetail(state);
  return writeDetail(state, { ...detail, traumaOhca: !detail.traumaOhca });
}

export function setTraumaTraffic(
  state: CaseState,
  traffic: TraumaTrafficRelated,
): CaseState {
  if (!usesTraumaPrimary(state)) return state;
  const detail = readDetail(state);
  const same = detail.traumaTraffic === traffic;
  if (same) {
    return writeDetail(state, {
      ...detail,
      traumaTraffic: null,
      traumaVehicleId: null,
      traumaInjuryTypeId: null,
      traumaFallHeightMeters: null,
    });
  }
  return writeDetail(state, {
    ...detail,
    traumaTraffic: traffic,
    traumaVehicleId: null,
    traumaInjuryTypeId: null,
    traumaFallHeightMeters: null,
  });
}

export function setTraumaVehicle(state: CaseState, vehicleId: string): CaseState {
  if (!usesTraumaPrimary(state)) return state;
  if (!TRAUMA_VEHICLE_OPTIONS.some((o) => o.id === vehicleId)) return state;
  const detail = readDetail(state);
  const next =
    detail.traumaVehicleId === vehicleId
      ? null
      : vehicleId;
  return writeDetail(state, { ...detail, traumaVehicleId: next });
}

export function setTraumaInjuryType(
  state: CaseState,
  injuryTypeId: string,
): CaseState {
  if (!usesTraumaPrimary(state)) return state;
  if (!TRAUMA_INJURY_OPTIONS.some((o) => o.id === injuryTypeId)) return state;
  const detail = readDetail(state);
  const next =
    detail.traumaInjuryTypeId === injuryTypeId ? null : injuryTypeId;
  const asksHeight = next ? getTraumaInjury(next)?.asksFallHeight : false;
  return writeDetail(state, {
    ...detail,
    traumaInjuryTypeId: next,
    traumaFallHeightMeters: asksHeight ? detail.traumaFallHeightMeters : null,
  });
}

export function setTraumaFallHeightMeters(
  state: CaseState,
  raw: string,
): CaseState {
  if (!usesTraumaPrimary(state) || !traumaAsksFallHeight(state)) return state;
  const trimmed = raw.trim();
  if (trimmed === "") {
    return writeDetail(state, {
      ...readDetail(state),
      traumaFallHeightMeters: null,
    });
  }
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) return state;
  return writeDetail(state, {
    ...readDetail(state),
    traumaFallHeightMeters: n,
  });
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

  const detail = readDetail(state);

  if (usesTraumaPrimary(state)) {
    if (detail.traumaStage === "mechanism") {
      return canCompleteTraumaMechanism(state);
    }
    if (answer.status !== "answered") return false;
    return detail.bodyRegionIds.length > 0;
  }

  if (answer.status !== "answered") return false;
  if (detail.complaintTypeIds.length === 0) return false;

  if (usesNonTraumaPrimary(state)) {
    return true;
  }

  if (complaintTypesNeedBody(detail.complaintTypeIds)) {
    return detail.bodyRegionIds.length > 0;
  }
  return true;
}

export function completeChiefComplaint1(state: CaseState): CaseState {
  if (!canCompleteChiefComplaint1(state)) return state;

  const status = state.answers.chief_complaint_1?.status;
  if (status === "unknown" || status === "skipped") {
    return { ...state, currentStep: nextAfterPrimary(state) };
  }

  if (usesTraumaPrimary(state)) {
    const detail = readDetail(state);
    if (detail.traumaStage === "mechanism") {
      return writeDetail(state, { ...detail, traumaStage: "body" });
    }
    const written = writeDetail(state, {
      ...detail,
      drilldownRegionId: null,
    });
    return { ...written, currentStep: nextAfterPrimary(written) };
  }

  const detail = { ...readDetail(state), drilldownRegionId: null };
  const written = writeDetail(state, detail);
  return {
    ...written,
    currentStep: nextAfterPrimary(written),
  };
}

export function goBackFromChiefComplaint1(state: CaseState): CaseState {
  if (usesTraumaPrimary(state)) {
    const detail = readDetail(state);
    if (detail.traumaStage === "body") {
      return writeDetail(state, {
        ...detail,
        traumaStage: "mechanism" satisfies TraumaPrimaryStage,
        drilldownRegionId: null,
      });
    }
  }
  return { ...state, currentStep: "start" };
}
