import { isHistoryStep, type HistoryStepId } from "../catalog/history-block.js";
import {
  beginInterview,
  createCase,
  setInformant,
  setSecondLanguage,
  startNewCase,
} from "./case-session.js";
import {
  canCompleteChiefComplaint1,
  clearBodyDrilldown,
  completeChiefComplaint1,
  getChiefComplaint1Detail,
  goBackFromChiefComplaint1,
  markChiefComplaint1Unknown,
  needsBodyLocation,
  skipChiefComplaint1,
  toggleBodyRegion,
  toggleBodySubregion,
  toggleComplaintType,
} from "./chief-complaint-1.js";
import {
  canCompleteChiefComplaintQuality,
  completeChiefComplaintQuality,
  getChiefComplaintQualityDetail,
  goBackFromChiefComplaintQuality,
  markChiefComplaintQualityUnknown,
  setPainScore,
  showsPainScale,
  skipChiefComplaintQuality,
  toggleQuality,
} from "./chief-complaint-quality.js";
import {
  canCompleteChiefComplaintDuration,
  completeChiefComplaintDuration,
  getChiefComplaintDurationDetail,
  goBackFromChiefComplaintDuration,
  markChiefComplaintDurationUnknown,
  selectTimeBucket,
  setTimeAmount,
  setTimeRefine,
  setTimeUnit,
  skipChiefComplaintDuration,
} from "./chief-complaint-duration.js";
import {
  canCompleteListStep,
  completeListStep,
  getListNote,
  getListOptionIds,
  goBackListStep,
  goToStep,
  listStepNeedsNote,
  markListStepUnknown,
  setListNote,
  skipListStep,
  toggleListOption,
} from "./list-step.js";
import {
  canCompleteOtherSymptoms,
  clearOtherBodyDrilldown,
  completeOtherSymptoms,
  getOtherSymptomsDetail,
  goBackFromOtherSymptoms,
  markOtherSymptomsUnknown,
  skipOtherSymptoms,
  toggleAccompanyingSymptom,
  toggleOtherBodyRegion,
  toggleOtherBodySubregion,
} from "./other-symptoms.js";
import {
  buildSummarySections,
  editFromSummary,
  formatSummaryText,
  returnToSummaryView,
  type SummarySection,
} from "./summary.js";
import type {
  CaseState,
  GateReason,
  Informant,
  InterviewStep,
  SecondLanguage,
  StartPhase,
} from "./types.js";

/** Where a content write lands; resolved against currentStep (+ startPhase). */
export type Slot =
  | "secondLanguage"
  | "informant"
  | "complaintType"
  | "bodyRegion"
  | "bodySubregion"
  | "bodyDrilldown"
  | "quality"
  | "painScore"
  | "timeBucket"
  | "timeAmount"
  | "timeUnit"
  | "timeRefine"
  | "listOption"
  | "listNote"
  | "accompanyingSymptom"
  | "otherBodyRegion"
  | "otherBodySubregion"
  | "otherBodyDrilldown";

export type Intent =
  | { type: "edit"; slot: Slot; value?: string }
  | {
      type: "nav";
      move: "next" | "back" | "unknown" | "skip" | "finish" | "return_to_summary";
    }
  | { type: "nav"; move: "goto"; step: InterviewStep }
  | { type: "nav"; move: "edit"; step: InterviewStep };

export type GateFacts = {
  reason: GateReason | null;
  nextEnabled: boolean;
};

export type ScreenFacts =
  | {
      step: "start";
      startPhase: StartPhase;
      secondLanguage: SecondLanguage | null;
      informant: Informant | null;
      returnToSummary: boolean;
    }
  | {
      step: "chief_complaint_1";
      complaintTypeIds: string[];
      bodyRegionIds: string[];
      bodySubregionIds: string[];
      drilldownRegionId: string | null;
      needsBodyLocation: boolean;
    }
  | {
      step: "chief_complaint_quality";
      qualityIds: string[];
      painScore: number | null;
      showsPainScale: boolean;
    }
  | {
      step: "chief_complaint_duration";
      timeBucketId: string | null;
      timeAmount: number | null;
      timeUnit: "minutes" | "hours" | "days" | null;
      timeRefine: string;
      timeMode: "duration" | "period" | null;
    }
  | {
      step: "before" | "intake" | "past_history" | "medications" | "allergies";
      optionIds: string[];
      note: string;
      noteRequired: boolean;
      answerStatus: string;
    }
  | {
      step: "other_symptoms";
      symptomIds: string[];
      bodyRegionIds: string[];
      bodySubregionIds: string[];
      drilldownRegionId: string | null;
    }
  | {
      step: "summary";
      sections: SummarySection[];
      plainText: string;
    };

export type ViewFacts = {
  caseId: string;
  currentStep: InterviewStep;
  startPhase: StartPhase;
  secondLanguage: SecondLanguage | null;
  informant: Informant | null;
  returnToSummary: boolean;
  gate: GateFacts;
  screen: ScreenFacts;
};

function landingOnStart(state: CaseState): CaseState {
  if (state.currentStep !== "start") return state;
  if (!state.secondLanguage) {
    return { ...state, startPhase: "language" };
  }
  return { ...state, startPhase: "informant" };
}

function applyEdit(state: CaseState, slot: Slot, value?: string): CaseState {
  switch (slot) {
    case "secondLanguage":
      if (!value) return state;
      return setSecondLanguage(state, value as SecondLanguage);
    case "informant":
      if (!value) return state;
      return setInformant(state, value as Informant);
    case "complaintType":
      if (!value) return state;
      return toggleComplaintType(state, value);
    case "bodyRegion":
      if (!value) return state;
      return toggleBodyRegion(state, value);
    case "bodySubregion":
      if (!value) return state;
      return toggleBodySubregion(state, value);
    case "bodyDrilldown":
      return clearBodyDrilldown(state);
    case "quality":
      if (!value) return state;
      return toggleQuality(state, value);
    case "painScore":
      if (value === undefined || value === "") return state;
      return setPainScore(state, Number(value));
    case "timeBucket":
      if (!value) return state;
      return selectTimeBucket(state, value);
    case "timeAmount":
      return setTimeAmount(state, value ?? "");
    case "timeUnit":
      if (!value) return state;
      return setTimeUnit(state, value);
    case "timeRefine":
      return setTimeRefine(state, value ?? "");
    case "listOption": {
      if (!value || !isHistoryStep(state.currentStep)) return state;
      return toggleListOption(state, state.currentStep, value);
    }
    case "listNote": {
      if (!isHistoryStep(state.currentStep)) return state;
      return setListNote(state, state.currentStep, value ?? "");
    }
    case "accompanyingSymptom":
      if (!value) return state;
      return toggleAccompanyingSymptom(state, value);
    case "otherBodyRegion":
      if (!value) return state;
      return toggleOtherBodyRegion(state, value);
    case "otherBodySubregion":
      if (!value) return state;
      return toggleOtherBodySubregion(state, value);
    case "otherBodyDrilldown":
      return clearOtherBodyDrilldown(state);
    default:
      return state;
  }
}

function applyNavNext(state: CaseState): CaseState {
  switch (state.currentStep) {
    case "start":
      if (state.startPhase === "language") {
        if (!state.secondLanguage) return state;
        return { ...state, startPhase: "informant" };
      }
      if (!state.informant) return state;
      return state.returnToSummary
        ? returnToSummaryView(state)
        : beginInterview(state);
    case "chief_complaint_1":
      return completeChiefComplaint1(state);
    case "chief_complaint_quality":
      return completeChiefComplaintQuality(state);
    case "chief_complaint_duration":
      return completeChiefComplaintDuration(state);
    case "before":
    case "intake":
    case "past_history":
    case "medications":
    case "allergies":
      return completeListStep(state, state.currentStep);
    case "other_symptoms":
      return completeOtherSymptoms(state);
    default:
      return state;
  }
}

function applyNavBack(state: CaseState): CaseState {
  switch (state.currentStep) {
    case "start":
      if (state.startPhase === "informant") {
        return { ...state, startPhase: "language" };
      }
      return state;
    case "chief_complaint_1":
      return landingOnStart(goBackFromChiefComplaint1(state));
    case "chief_complaint_quality":
      return goBackFromChiefComplaintQuality(state);
    case "chief_complaint_duration":
      return goBackFromChiefComplaintDuration(state);
    case "before":
    case "intake":
    case "past_history":
    case "medications":
    case "allergies":
      return goBackListStep(state, state.currentStep);
    case "other_symptoms":
      return goBackFromOtherSymptoms(state);
    default:
      return state;
  }
}

function applyNavUnknown(state: CaseState): CaseState {
  switch (state.currentStep) {
    case "chief_complaint_1":
      return markChiefComplaint1Unknown(state);
    case "chief_complaint_quality":
      return markChiefComplaintQualityUnknown(state);
    case "chief_complaint_duration":
      return markChiefComplaintDurationUnknown(state);
    case "before":
    case "intake":
    case "past_history":
    case "medications":
    case "allergies":
      return markListStepUnknown(state, state.currentStep);
    case "other_symptoms":
      return markOtherSymptomsUnknown(state);
    default:
      return state;
  }
}

function applyNavSkip(state: CaseState): CaseState {
  switch (state.currentStep) {
    case "chief_complaint_1":
      return skipChiefComplaint1(state);
    case "chief_complaint_quality":
      return skipChiefComplaintQuality(state);
    case "chief_complaint_duration":
      return skipChiefComplaintDuration(state);
    case "before":
    case "intake":
    case "past_history":
    case "medications":
    case "allergies":
      return skipListStep(state, state.currentStep);
    case "other_symptoms":
      return skipOtherSymptoms(state);
    default:
      return state;
  }
}

/**
 * Sole write path for CaseSession. Clicks and inputs both become Intent.
 * Soft-gated next is a no-op; back / unknown / skip are never blocked here.
 */
export function apply(state: CaseState, intent: Intent): CaseState {
  if (intent.type === "edit") {
    return applyEdit(state, intent.slot, intent.value);
  }

  switch (intent.move) {
    case "next": {
      const facts = viewFacts(state);
      if (!facts.gate.nextEnabled) return state;
      return applyNavNext(state);
    }
    case "back":
      return applyNavBack(state);
    case "unknown":
      return applyNavUnknown(state);
    case "skip":
      return applyNavSkip(state);
    case "finish":
      return startNewCase(state);
    case "return_to_summary":
      return returnToSummaryView(state);
    case "goto":
      if (isHistoryStep(intent.step)) {
        return goToStep(state, intent.step);
      }
      return state;
    case "edit": {
      let next = editFromSummary(state, intent.step);
      if (intent.step === "start") {
        next = landingOnStart(next);
      }
      return next;
    }
    default:
      return state;
  }
}

function gateFor(state: CaseState): GateFacts {
  switch (state.currentStep) {
    case "start":
      if (state.startPhase === "language") {
        const ok = state.secondLanguage !== null;
        return {
          reason: ok ? null : "need_second_language",
          nextEnabled: ok,
        };
      }
      {
        const ok = state.informant !== null;
        return {
          reason: ok ? null : "need_informant",
          nextEnabled: ok,
        };
      }
    case "chief_complaint_1": {
      if (canCompleteChiefComplaint1(state)) {
        return { reason: null, nextEnabled: true };
      }
      const detail = getChiefComplaint1Detail(state);
      if (detail.complaintTypeIds.length === 0) {
        return { reason: "need_complaint_type", nextEnabled: false };
      }
      if (needsBodyLocation(state) && detail.bodyRegionIds.length === 0) {
        return { reason: "need_body_location", nextEnabled: false };
      }
      return { reason: "need_complaint_type", nextEnabled: false };
    }
    case "chief_complaint_quality":
      return canCompleteChiefComplaintQuality(state)
        ? { reason: null, nextEnabled: true }
        : { reason: "need_quality_or_pain", nextEnabled: false };
    case "chief_complaint_duration":
      return canCompleteChiefComplaintDuration(state)
        ? { reason: null, nextEnabled: true }
        : { reason: "need_duration", nextEnabled: false };
    case "before":
    case "intake":
    case "past_history":
    case "medications":
    case "allergies":
      return canCompleteListStep(state, state.currentStep)
        ? { reason: null, nextEnabled: true }
        : { reason: "need_list_selection", nextEnabled: false };
    case "other_symptoms":
      return canCompleteOtherSymptoms(state)
        ? { reason: null, nextEnabled: true }
        : { reason: "need_other_symptom_or_body", nextEnabled: false };
    case "summary":
      return { reason: null, nextEnabled: true };
    default:
      return { reason: null, nextEnabled: true };
  }
}

function screenFor(state: CaseState): ScreenFacts {
  switch (state.currentStep) {
    case "start":
      return {
        step: "start",
        startPhase:
          state.startPhase === "informant" && state.secondLanguage
            ? "informant"
            : "language",
        secondLanguage: state.secondLanguage,
        informant: state.informant,
        returnToSummary: state.returnToSummary,
      };
    case "chief_complaint_1": {
      const d = getChiefComplaint1Detail(state);
      return {
        step: "chief_complaint_1",
        complaintTypeIds: d.complaintTypeIds,
        bodyRegionIds: d.bodyRegionIds,
        bodySubregionIds: d.bodySubregionIds,
        drilldownRegionId: d.drilldownRegionId,
        needsBodyLocation: needsBodyLocation(state),
      };
    }
    case "chief_complaint_quality": {
      const d = getChiefComplaintQualityDetail(state);
      return {
        step: "chief_complaint_quality",
        qualityIds: d.qualityIds,
        painScore: d.painScore,
        showsPainScale: showsPainScale(state),
      };
    }
    case "chief_complaint_duration": {
      const d = getChiefComplaintDurationDetail(state);
      return {
        step: "chief_complaint_duration",
        timeBucketId: d.timeBucketId,
        timeAmount: d.timeAmount,
        timeUnit: d.timeUnit,
        timeRefine: d.timeRefine,
        timeMode: d.timeMode,
      };
    }
    case "before":
    case "intake":
    case "past_history":
    case "medications":
    case "allergies": {
      const step = state.currentStep as HistoryStepId;
      return {
        step,
        optionIds: getListOptionIds(state, step),
        note: getListNote(state, step),
        noteRequired: listStepNeedsNote(state, step),
        answerStatus: state.answers[step]?.status ?? "empty",
      };
    }
    case "other_symptoms": {
      const d = getOtherSymptomsDetail(state);
      return {
        step: "other_symptoms",
        symptomIds: d.symptomIds,
        bodyRegionIds: d.bodyRegionIds,
        bodySubregionIds: d.bodySubregionIds,
        drilldownRegionId: d.drilldownRegionId,
      };
    }
    case "summary":
      return {
        step: "summary",
        sections: buildSummarySections(state),
        plainText: formatSummaryText(state),
      };
  }
}

/** Sole orchestration read for the DOM adapter. */
export function viewFacts(state: CaseState): ViewFacts {
  const screen = screenFor(state);
  const startPhase =
    screen.step === "start" ? screen.startPhase : state.startPhase;
  return {
    caseId: state.id,
    currentStep: state.currentStep,
    startPhase,
    secondLanguage: state.secondLanguage,
    informant: state.informant,
    returnToSummary: state.returnToSummary,
    gate: gateFor(state),
    screen,
  };
}

export { createCase, startNewCase };
