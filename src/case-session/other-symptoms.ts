import { getBodyRegion } from "../catalog/chief-complaint-1.js";
import { getAccompanyingSymptom } from "../catalog/other-symptoms.js";
import {
  type CaseState,
  type OtherSymptomsDetail,
  emptyOtherSymptomsDetail,
  emptyStepAnswer,
} from "./types.js";

function readDetail(state: CaseState): OtherSymptomsDetail {
  const answer = state.answers.other_symptoms;
  if (!answer) return emptyOtherSymptomsDetail();
  const d = answer.detail as Partial<OtherSymptomsDetail>;
  return {
    symptomIds: d.symptomIds ?? [],
    bodyRegionIds: d.bodyRegionIds ?? [],
    bodySubregionIds: d.bodySubregionIds ?? [],
    drilldownRegionId: d.drilldownRegionId ?? null,
  };
}

function writeDetail(state: CaseState, detail: OtherSymptomsDetail): CaseState {
  const hasContent =
    detail.symptomIds.length > 0 ||
    detail.bodyRegionIds.length > 0 ||
    detail.bodySubregionIds.length > 0;

  return {
    ...state,
    answers: {
      ...state.answers,
      other_symptoms: {
        ...emptyStepAnswer(),
        status: hasContent ? "answered" : "empty",
        optionIds: [...detail.symptomIds],
        detail: { ...detail },
      },
    },
  };
}

export function getOtherSymptomsDetail(state: CaseState): OtherSymptomsDetail {
  return readDetail(state);
}

export function toggleAccompanyingSymptom(
  state: CaseState,
  symptomId: string,
): CaseState {
  const option = getAccompanyingSymptom(symptomId);
  if (!option) return state;

  const detail = readDetail(state);
  let symptomIds = [...detail.symptomIds];

  if (option.exclusive) {
    symptomIds = symptomIds.includes(symptomId) ? [] : [symptomId];
    return writeDetail(state, {
      symptomIds,
      bodyRegionIds: [],
      bodySubregionIds: [],
      drilldownRegionId: null,
    });
  }

  const withoutExclusive = symptomIds.filter((id) => {
    return !getAccompanyingSymptom(id)?.exclusive;
  });
  const set = new Set(withoutExclusive);
  if (set.has(symptomId)) set.delete(symptomId);
  else set.add(symptomId);

  return writeDetail(state, {
    ...detail,
    symptomIds: [...set],
  });
}

export function toggleOtherBodyRegion(
  state: CaseState,
  regionId: string,
): CaseState {
  const detail = readDetail(state);
  if (detail.symptomIds.some((id) => getAccompanyingSymptom(id)?.exclusive)) {
    return state;
  }

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

export function toggleOtherBodySubregion(
  state: CaseState,
  subregionId: string,
): CaseState {
  const detail = readDetail(state);
  const set = new Set(detail.bodySubregionIds);
  if (set.has(subregionId)) set.delete(subregionId);
  else set.add(subregionId);
  return writeDetail(state, {
    ...detail,
    bodySubregionIds: [...set],
  });
}

export function clearOtherBodyDrilldown(state: CaseState): CaseState {
  const detail = readDetail(state);
  return writeDetail(state, { ...detail, drilldownRegionId: null });
}

export function markOtherSymptomsUnknown(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      other_symptoms: {
        ...emptyStepAnswer(),
        status: "unknown",
        detail: emptyOtherSymptomsDetail(),
      },
    },
  };
}

export function skipOtherSymptoms(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      other_symptoms: {
        ...emptyStepAnswer(),
        status: "skipped",
        detail: emptyOtherSymptomsDetail(),
      },
    },
  };
}

export function canCompleteOtherSymptoms(state: CaseState): boolean {
  const answer = state.answers.other_symptoms;
  if (!answer) return false;
  if (answer.status === "unknown" || answer.status === "skipped") return true;
  if (answer.status !== "answered") return false;
  const detail = readDetail(state);
  return detail.symptomIds.length > 0 || detail.bodyRegionIds.length > 0;
}

/** Single pass only — advances to summary, never restarts 主訴. */
export function completeOtherSymptoms(state: CaseState): CaseState {
  if (!canCompleteOtherSymptoms(state)) return state;
  const detail = { ...readDetail(state), drilldownRegionId: null };
  const status = state.answers.other_symptoms?.status;
  if (status === "unknown" || status === "skipped") {
    return { ...state, currentStep: "summary", returnToSummary: false };
  }
  return {
    ...writeDetail(state, detail),
    currentStep: "summary",
    returnToSummary: false,
  };
}

export function goBackFromOtherSymptoms(state: CaseState): CaseState {
  return { ...state, currentStep: "allergies" };
}
