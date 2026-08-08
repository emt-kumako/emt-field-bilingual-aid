import {
  getHistoryCatalog,
  isHistoryStep,
  nextHistoryStep,
  previousHistoryStep,
  type HistoryStepId,
} from "../catalog/history-block.js";
import {
  type CaseState,
  type InterviewStep,
  emptyStepAnswer,
} from "./types.js";

function getAnswer(state: CaseState, step: HistoryStepId) {
  return state.answers[step] ?? emptyStepAnswer();
}

function writeAnswer(
  state: CaseState,
  step: HistoryStepId,
  optionIds: string[],
  note: string,
  status: "answered" | "empty" = "answered",
): CaseState {
  const hasContent = optionIds.length > 0 || note.trim() !== "";
  return {
    ...state,
    answers: {
      ...state.answers,
      [step]: {
        ...emptyStepAnswer(),
        status: hasContent ? status : "empty",
        optionIds: [...optionIds],
        note,
      },
    },
  };
}

export function getListOptionIds(state: CaseState, step: HistoryStepId): string[] {
  return [...getAnswer(state, step).optionIds];
}

export function getListNote(state: CaseState, step: HistoryStepId): string {
  return getAnswer(state, step).note;
}

export function listStepNeedsNote(state: CaseState, step: HistoryStepId): boolean {
  const catalog = getHistoryCatalog(step);
  if (!catalog) return false;
  const selected = new Set(getListOptionIds(state, step));
  return catalog.options.some((opt) => opt.opensNote && selected.has(opt.id));
}

export function toggleListOption(
  state: CaseState,
  step: HistoryStepId,
  optionId: string,
): CaseState {
  const catalog = getHistoryCatalog(step);
  if (!catalog) return state;

  const option = catalog.options.find((o) => o.id === optionId);
  if (!option) return state;

  const current = getAnswer(state, step);
  let optionIds = [...current.optionIds];
  let note = current.note;

  if (catalog.selection === "single") {
    if (optionIds.includes(optionId) && !option.exclusive) {
      optionIds = [];
    } else {
      optionIds = [optionId];
    }
  } else if (option.exclusive) {
    optionIds = optionIds.includes(optionId) ? [] : [optionId];
  } else {
    const withoutExclusive = optionIds.filter((id) => {
      const opt = catalog.options.find((o) => o.id === id);
      return !opt?.exclusive;
    });
    const set = new Set(withoutExclusive);
    if (set.has(optionId)) set.delete(optionId);
    else set.add(optionId);
    optionIds = [...set];
  }

  const stillNeedsNote = catalog.options.some(
    (opt) => opt.opensNote && optionIds.includes(opt.id),
  );
  if (!stillNeedsNote) note = "";

  return writeAnswer(state, step, optionIds, note);
}

export function setListNote(
  state: CaseState,
  step: HistoryStepId,
  note: string,
): CaseState {
  const current = getAnswer(state, step);
  return writeAnswer(state, step, current.optionIds, note);
}

export function markListStepUnknown(
  state: CaseState,
  step: HistoryStepId,
): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      [step]: {
        ...emptyStepAnswer(),
        status: "unknown",
      },
    },
  };
}

export function skipListStep(state: CaseState, step: HistoryStepId): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      [step]: {
        ...emptyStepAnswer(),
        status: "skipped",
      },
    },
  };
}

export function canCompleteListStep(
  state: CaseState,
  step: HistoryStepId,
): boolean {
  const answer = state.answers[step];
  if (!answer) return false;
  if (answer.status === "unknown" || answer.status === "skipped") return true;
  if (answer.status !== "answered") return false;
  return answer.optionIds.length > 0;
}

export function completeListStep(
  state: CaseState,
  step: HistoryStepId,
): CaseState {
  if (!canCompleteListStep(state, step)) return state;
  return {
    ...state,
    currentStep: nextHistoryStep(step),
  };
}

export function goBackListStep(
  state: CaseState,
  step: HistoryStepId,
): CaseState {
  return {
    ...state,
    currentStep: previousHistoryStep(step),
  };
}

/** Free navigation for EMT edit-from-anywhere. */
export function goToStep(state: CaseState, step: InterviewStep): CaseState {
  return { ...state, currentStep: step };
}

export function currentHistoryStep(state: CaseState): HistoryStepId | null {
  return isHistoryStep(state.currentStep) ? state.currentStep : null;
}
