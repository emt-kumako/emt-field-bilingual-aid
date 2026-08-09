import {
  getSecondaryReason,
  secondaryReasonsForScene,
} from "../catalog/secondary-reason.js";
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
    reasonIds: d.reasonIds ?? [],
  };
}

function writeDetail(state: CaseState, detail: OtherSymptomsDetail): CaseState {
  const hasContent = detail.reasonIds.length > 0;

  return {
    ...state,
    answers: {
      ...state.answers,
      other_symptoms: {
        ...emptyStepAnswer(),
        status: hasContent ? "answered" : "empty",
        optionIds: [...detail.reasonIds],
        detail: { ...detail },
      },
    },
  };
}

export function getOtherSymptomsDetail(state: CaseState): OtherSymptomsDetail {
  return readDetail(state);
}

export function secondaryCatalogKind(
  state: CaseState,
): "trauma" | "non_trauma" | null {
  if (state.sceneType === "trauma" || state.sceneType === "non_trauma") {
    return state.sceneType;
  }
  return null;
}

export function toggleSecondaryReason(
  state: CaseState,
  reasonId: string,
): CaseState {
  const catalog = secondaryReasonsForScene(state.sceneType);
  if (!catalog.some((o) => o.id === reasonId)) return state;
  if (!getSecondaryReason(state.sceneType, reasonId)) return state;

  const detail = readDetail(state);
  return writeDetail(state, {
    reasonIds: nextSelectedIds(detail.reasonIds, catalog, reasonId, "multi"),
  });
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
  return readDetail(state).reasonIds.length > 0;
}

/** Single pass only — advances to summary, never restarts 主訴. */
export function completeOtherSymptoms(state: CaseState): CaseState {
  if (!canCompleteOtherSymptoms(state)) return state;
  const status = state.answers.other_symptoms?.status;
  if (status === "unknown" || status === "skipped") {
    return { ...state, currentStep: "summary", returnToSummary: false };
  }
  return {
    ...writeDetail(state, readDetail(state)),
    currentStep: "summary",
    returnToSummary: false,
  };
}

export function goBackFromOtherSymptoms(state: CaseState): CaseState {
  return { ...state, currentStep: "allergies" };
}
