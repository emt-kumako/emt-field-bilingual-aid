import {
  SCENE_TYPE_DEPENDENT_STEPS,
  type CaseState,
  type Informant,
  type InterviewStep,
  type SceneType,
  type SecondLanguage,
  emptyStepAnswer,
} from "./types.js";

let nextCaseSerial = 1;

function newCaseId(): string {
  const id = `case-${nextCaseSerial}`;
  nextCaseSerial += 1;
  return id;
}

export function createCase(): CaseState {
  return {
    id: newCaseId(),
    secondLanguage: null,
    informant: null,
    informantHistory: [],
    sceneType: null,
    startPhase: "language",
    currentStep: "start",
    answers: {},
    returnToSummary: false,
  };
}

/**
 * Wipe the current interview and return a fresh case.
 * Domain entry point for 「結束／新案件」— no prior answers remain.
 */
export function startNewCase(_previous?: CaseState): CaseState {
  return createCase();
}

export function setSecondLanguage(
  state: CaseState,
  language: SecondLanguage,
): CaseState {
  return {
    ...state,
    secondLanguage: language,
  };
}

/**
 * Set or change 答題者. Mid-case changes keep answers and append history.
 */
export function setInformant(state: CaseState, informant: Informant): CaseState {
  if (state.informant === informant) {
    return state;
  }

  const history =
    state.informant === null
      ? [informant]
      : [...state.informantHistory, informant];

  return {
    ...state,
    informant,
    informantHistory: history,
  };
}

/**
 * Set or change Scene type. Changing clears primary／secondary-path answers;
 * history mnemonic answers stay.
 */
export function setSceneType(state: CaseState, sceneType: SceneType): CaseState {
  if (state.sceneType === sceneType) {
    return state;
  }

  const answers = { ...state.answers };
  for (const step of SCENE_TYPE_DEPENDENT_STEPS) {
    delete answers[step];
  }

  let currentStep = state.currentStep;
  if (SCENE_TYPE_DEPENDENT_STEPS.includes(currentStep)) {
    currentStep = "chief_complaint_1";
  }

  return {
    ...state,
    sceneType,
    answers,
    currentStep,
  };
}

export function canBeginInterview(state: CaseState): boolean {
  return (
    state.secondLanguage !== null &&
    state.informant !== null &&
    state.sceneType !== null
  );
}

/** Leave start and enter 主訴 step 1 when language + informant + Scene type are set. */
export function beginInterview(state: CaseState): CaseState {
  if (!canBeginInterview(state)) {
    return state;
  }

  return {
    ...state,
    currentStep: "chief_complaint_1",
  };
}

export function getStepAnswer(
  state: CaseState,
  step: InterviewStep,
): ReturnType<typeof emptyStepAnswer> {
  return state.answers[step] ?? emptyStepAnswer();
}

/** Test-only helper to simulate progress before later tickets land. */
export function withAnswerForTesting(
  state: CaseState,
  step: InterviewStep,
  optionIds: string[],
): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      [step]: {
        ...emptyStepAnswer(),
        status: "answered",
        optionIds: [...optionIds],
      },
    },
  };
}
