import {
  ACCOMPANYING_SYMPTOMS,
  getAccompanyingSymptom,
} from "../catalog/other-symptoms.js";
import {
  clearDrilldown,
  toggleRegion,
  toggleSubregion,
} from "./body-selection.js";
import { nextSelectedIds } from "./option-selection.js";
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
  const symptomIds = nextSelectedIds(
    detail.symptomIds,
    ACCOMPANYING_SYMPTOMS,
    symptomId,
  );

  // Exclusive symptoms clear body selection (step policy — not Option selection).
  if (option.exclusive) {
    return writeDetail(state, {
      symptomIds,
      bodyRegionIds: [],
      bodySubregionIds: [],
      drilldownRegionId: null,
    });
  }

  return writeDetail(state, {
    ...detail,
    symptomIds,
  });
}

export function toggleOtherBodyRegion(
  state: CaseState,
  regionId: string,
): CaseState {
  const detail = readDetail(state);
  // Exclusive accompanying symptom locks the body map (step policy).
  if (detail.symptomIds.some((id) => getAccompanyingSymptom(id)?.exclusive)) {
    return state;
  }
  const next = toggleRegion(detail, regionId);
  if (!next) return state;
  return writeDetail(state, { ...detail, ...next });
}

export function toggleOtherBodySubregion(
  state: CaseState,
  subregionId: string,
): CaseState {
  const detail = readDetail(state);
  return writeDetail(state, {
    ...detail,
    ...toggleSubregion(detail, subregionId),
  });
}

export function clearOtherBodyDrilldown(state: CaseState): CaseState {
  const detail = readDetail(state);
  return writeDetail(state, { ...detail, ...clearDrilldown(detail) });
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
