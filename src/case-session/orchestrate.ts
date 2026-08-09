import { isHistoryStep, type HistoryStepId } from "../catalog/history-block.js";
import {
  beginInterview,
  setInformant,
  setSceneType,
  setSecondLanguage,
  startNewCase,
} from "./case-session.js";
import {
  canCompleteChiefComplaint1,
  clearBodyDrilldown,
  completeChiefComplaint1,
  getChiefComplaint1Detail,
  getPrimaryNote,
  goBackFromChiefComplaint1,
  markChiefComplaint1Unknown,
  needsBodyLocation,
  primaryOpensNote,
  setPrimaryNote,
  setTraumaFallHeightMeters,
  setTraumaInjuryType,
  setTraumaTraffic,
  setTraumaVehicle,
  skipChiefComplaint1,
  toggleBodyRegion,
  toggleBodySubregion,
  toggleComplaintType,
  toggleTraumaOhca,
  traumaAsksFallHeight,
  usesNonTraumaPrimary,
  usesTraumaPrimary,
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
  canCompleteChestOpqrst,
  completeChestOpqrst,
  getChestOpqrstDetail,
  goBackFromChestOpqrst,
  markChestOpqrstUnknown,
  setOpqrstOnset,
  setOpqrstQuality,
  setOpqrstRadiation,
  setOpqrstSeverity,
  setOpqrstTimeAmount,
  setOpqrstTimePattern,
  setOpqrstTimeUnit,
  setOpqrstTimeUnknown,
  skipChestOpqrst,
  toggleOpqrstProvocation,
  toggleOpqrstRadiationSite,
  toggleOpqrstRegion,
} from "./chest-opqrst.js";
import { PAIN_SCALE_SOURCE_URL } from "../catalog/chest-opqrst.js";
import {
  backFromPathStep,
  isChiefComplaintPathStep,
  needsQualityStep,
} from "./chief-complaint-path.js";
import { gateForChiefComplaintPath } from "./chief-complaint-path-gate.js";
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
  completeOtherSymptoms,
  getOtherSymptomsDetail,
  goBackFromOtherSymptoms,
  markOtherSymptomsUnknown,
  secondaryCatalogKind,
  skipOtherSymptoms,
  toggleSecondaryReason,
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
  SceneType,
  SecondLanguage,
  StartPhase,
} from "./types.js";

/** Where a content write lands; resolved against currentStep (+ startPhase). */
export type Slot =
  | "secondLanguage"
  | "informant"
  | "sceneType"
  | "complaintType"
  | "primaryNote"
  | "traumaOhca"
  | "traumaTraffic"
  | "traumaVehicle"
  | "traumaInjury"
  | "traumaFallHeight"
  | "opqrstOnset"
  | "opqrstProvocation"
  | "opqrstQuality"
  | "opqrstRegion"
  | "opqrstRadiation"
  | "opqrstRadiationSite"
  | "opqrstSeverity"
  | "opqrstTimePattern"
  | "opqrstTimeUnknown"
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
  | "secondaryReason";

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
      sceneType: SceneType | null;
      returnToSummary: boolean;
    }
  | {
      step: "chief_complaint_1";
      complaintTypeIds: string[];
      bodyRegionIds: string[];
      bodySubregionIds: string[];
      drilldownRegionId: string | null;
      needsBodyLocation: boolean;
      usesNonTraumaPrimary: boolean;
      usesTraumaPrimary: boolean;
      primaryNote: string;
      primaryOpensNote: boolean;
      traumaOhca: boolean;
      traumaTraffic: "traffic" | "non_traffic" | null;
      traumaVehicleId: string | null;
      traumaInjuryTypeId: string | null;
      traumaFallHeightMeters: number | null;
      traumaAsksFallHeight: boolean;
      traumaStage: "mechanism" | "body";
      answerStatus: string;
    }
  | {
      step: "chest_opqrst";
      onsetId: string | null;
      provocationIds: string[];
      qualityId: string | null;
      regionIds: string[];
      radiation: boolean;
      radiationSiteIds: string[];
      severity: number | null;
      timePattern: "intermittent" | "continuous" | null;
      timeAmount: number | null;
      timeUnit: "minutes" | "hours" | "days" | null;
      timeUnknown: boolean;
      painScaleSourceUrl: string;
      answerStatus: string;
    }
  | {
      step: "chief_complaint_quality";
      qualityIds: string[];
      painScore: number | null;
      showsPainScale: boolean;
      needsQualityStep: boolean;
      answerStatus: string;
    }
  | {
      step: "chief_complaint_duration";
      timeBucketId: string | null;
      timeAmount: number | null;
      timeUnit: "minutes" | "hours" | "days" | null;
      timeRefine: string;
      timeMode: "duration" | "period" | null;
      timePattern: "intermittent" | "continuous" | null;
      timeUnknown: boolean;
      answerStatus: string;
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
      reasonIds: string[];
      secondaryCatalog: "trauma" | "non_trauma" | null;
      answerStatus: string;
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
  sceneType: SceneType | null;
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
    case "sceneType":
      if (!value) return state;
      return setSceneType(state, value as SceneType);
    case "complaintType":
      if (!value) return state;
      return toggleComplaintType(state, value);
    case "primaryNote":
      return setPrimaryNote(state, value ?? "");
    case "traumaOhca":
      return toggleTraumaOhca(state);
    case "traumaTraffic":
      if (!value) return state;
      if (value !== "traffic" && value !== "non_traffic") return state;
      return setTraumaTraffic(state, value);
    case "traumaVehicle":
      if (!value) return state;
      return setTraumaVehicle(state, value);
    case "traumaInjury":
      if (!value) return state;
      return setTraumaInjuryType(state, value);
    case "traumaFallHeight":
      return setTraumaFallHeightMeters(state, value ?? "");
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
    case "opqrstOnset":
      if (!value) return state;
      return setOpqrstOnset(state, value);
    case "opqrstProvocation":
      if (!value) return state;
      return toggleOpqrstProvocation(state, value);
    case "opqrstQuality":
      if (!value) return state;
      return setOpqrstQuality(state, value);
    case "opqrstRegion":
      if (!value) return state;
      return toggleOpqrstRegion(state, value);
    case "opqrstRadiation":
      if (value === "true") return setOpqrstRadiation(state, true);
      if (value === "false") return setOpqrstRadiation(state, false);
      return setOpqrstRadiation(
        state,
        !getChestOpqrstDetail(state).radiation,
      );
    case "opqrstRadiationSite":
      if (!value) return state;
      return toggleOpqrstRadiationSite(state, value);
    case "opqrstSeverity":
      if (value === undefined || value === "") return state;
      return setOpqrstSeverity(state, Number(value));
    case "opqrstTimePattern":
      if (value !== "intermittent" && value !== "continuous") return state;
      return setOpqrstTimePattern(state, value);
    case "opqrstTimeUnknown":
      return setOpqrstTimeUnknown(state);
    case "timeAmount":
      if (state.currentStep === "chest_opqrst") {
        return setOpqrstTimeAmount(state, value ?? "");
      }
      return setTimeAmount(state, value ?? "");
    case "timeUnit":
      if (!value) return state;
      if (state.currentStep === "chest_opqrst") {
        return setOpqrstTimeUnit(state, value);
      }
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
    case "secondaryReason":
      if (!value) return state;
      return toggleSecondaryReason(state, value);
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
      if (!state.informant || !state.sceneType) return state;
      return state.returnToSummary
        ? returnToSummaryView(state)
        : beginInterview(state);
    case "chief_complaint_1":
      return completeChiefComplaint1(state);
    case "chest_opqrst":
      return completeChestOpqrst(state);
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
    case "chest_opqrst":
      return goBackFromChestOpqrst(state);
    case "chief_complaint_quality":
      return goBackFromChiefComplaintQuality(state);
    case "chief_complaint_duration":
      return goBackFromChiefComplaintDuration(state);
    case "before":
      return { ...state, currentStep: backFromPathStep(state) };
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
    case "chest_opqrst":
      return markChestOpqrstUnknown(state);
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
    case "chest_opqrst":
      return skipChestOpqrst(state);
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
        if (state.informant === null) {
          return { reason: "need_informant", nextEnabled: false };
        }
        if (state.sceneType === null) {
          return { reason: "need_scene_type", nextEnabled: false };
        }
        return { reason: null, nextEnabled: true };
      }
    case "chief_complaint_1":
    case "chest_opqrst":
    case "chief_complaint_quality":
    case "chief_complaint_duration":
      return gateForChiefComplaintPath(state);
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
        : { reason: "need_secondary_reason", nextEnabled: false };
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
        sceneType: state.sceneType,
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
        usesNonTraumaPrimary: usesNonTraumaPrimary(state),
        usesTraumaPrimary: usesTraumaPrimary(state),
        primaryNote: getPrimaryNote(state),
        primaryOpensNote: primaryOpensNote(state),
        traumaOhca: d.traumaOhca,
        traumaTraffic: d.traumaTraffic,
        traumaVehicleId: d.traumaVehicleId,
        traumaInjuryTypeId: d.traumaInjuryTypeId,
        traumaFallHeightMeters: d.traumaFallHeightMeters,
        traumaAsksFallHeight: traumaAsksFallHeight(state),
        traumaStage: d.traumaStage,
        answerStatus: state.answers.chief_complaint_1?.status ?? "empty",
      };
    }
    case "chest_opqrst": {
      const d = getChestOpqrstDetail(state);
      const dur = getChiefComplaintDurationDetail(state);
      return {
        step: "chest_opqrst",
        onsetId: d.onsetId,
        provocationIds: d.provocationIds,
        qualityId: d.qualityId,
        regionIds: d.regionIds,
        radiation: d.radiation,
        radiationSiteIds: d.radiationSiteIds,
        severity: d.severity,
        timePattern: dur.timePattern,
        timeAmount: dur.timeAmount,
        timeUnit: dur.timeUnit,
        timeUnknown: dur.timeUnknown,
        painScaleSourceUrl: PAIN_SCALE_SOURCE_URL,
        answerStatus: state.answers.chest_opqrst?.status ?? "empty",
      };
    }
    case "chief_complaint_quality": {
      const d = getChiefComplaintQualityDetail(state);
      return {
        step: "chief_complaint_quality",
        qualityIds: d.qualityIds,
        painScore: d.painScore,
        showsPainScale: showsPainScale(state),
        needsQualityStep: needsQualityStep(state),
        answerStatus: state.answers.chief_complaint_quality?.status ?? "empty",
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
        timePattern: d.timePattern,
        timeUnknown: d.timeUnknown,
        answerStatus: state.answers.chief_complaint_duration?.status ?? "empty",
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
        reasonIds: d.reasonIds,
        secondaryCatalog: secondaryCatalogKind(state),
        answerStatus: state.answers.other_symptoms?.status ?? "empty",
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
    sceneType: state.sceneType,
    returnToSummary: state.returnToSummary,
    gate: gateFor(state),
    screen,
  };
}
