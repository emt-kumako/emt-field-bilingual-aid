/**
 * Chief complaint path — next / back / summary-edit for
 * primary → (quality | OPQRST | duration) → before.
 * Soft gate lives in chief-complaint-path-gate.ts (avoids import cycle with step completes).
 */
import {
  getChiefComplaint1Detail,
  usesNonTraumaPrimary,
  usesTraumaPrimary,
} from "./chief-complaint-1.js";
import { isChestOpqrstPath } from "./chest-opqrst.js";
import { type CaseState, type InterviewStep } from "./types.js";

const NON_TRAUMA_QUALITY_TRIGGERS = new Set(["abdominal_pain", "pain"]);

/** Whether the shared quality step should appear after primary. */
export function needsQualityStep(state: CaseState): boolean {
  const status = state.answers.chief_complaint_1?.status;
  if (status !== "answered") return false;

  if (usesTraumaPrimary(state)) return true;

  const ids = getChiefComplaint1Detail(state).complaintTypeIds;
  if (usesNonTraumaPrimary(state) && ids.includes("chest_pain")) {
    return false;
  }
  return ids.some((id) => NON_TRAUMA_QUALITY_TRIGGERS.has(id));
}

/** Step after leaving primary (answers already written). */
export function nextAfterPrimary(state: CaseState): InterviewStep {
  const status = state.answers.chief_complaint_1?.status;
  if (status === "unknown" || status === "skipped") {
    return "chief_complaint_duration";
  }
  const ids = getChiefComplaint1Detail(state).complaintTypeIds;
  if (usesNonTraumaPrimary(state) && ids.includes("chest_pain")) {
    return "chest_opqrst";
  }
  if (needsQualityStep(state)) return "chief_complaint_quality";
  return "chief_complaint_duration";
}

export function nextAfterQuality(_state: CaseState): InterviewStep {
  return "chief_complaint_duration";
}

export function nextAfterOpqrst(_state: CaseState): InterviewStep {
  return "before";
}

export function nextAfterDuration(_state: CaseState): InterviewStep {
  return "before";
}

/** Back target when leaving a path step (not intra-primary mechanism↔body). */
export function backFromPathStep(state: CaseState): InterviewStep {
  switch (state.currentStep) {
    case "chest_opqrst":
      return "chief_complaint_1";
    case "chief_complaint_quality":
      return "chief_complaint_1";
    case "chief_complaint_duration":
      if (isChestOpqrstPath(state)) return "chest_opqrst";
      if (needsQualityStep(state)) return "chief_complaint_quality";
      return "chief_complaint_1";
    case "before":
      if (isChestOpqrstPath(state)) return "chest_opqrst";
      return "chief_complaint_duration";
    default:
      return "chief_complaint_1";
  }
}

/** Summary edit target for the chief complaint block. */
export function chiefComplaintEditStep(state: CaseState): InterviewStep {
  const a1 = state.answers.chief_complaint_1;
  const aOpqrst = state.answers.chest_opqrst;
  const aQuality = state.answers.chief_complaint_quality;
  const aDur = state.answers.chief_complaint_duration;
  const incomplete = (status: string | undefined) =>
    !status || status === "empty";

  if (
    incomplete(a1?.status) &&
    a1?.status !== "unknown" &&
    a1?.status !== "skipped"
  ) {
    return "chief_complaint_1";
  }
  if (isChestOpqrstPath(state)) {
    if (
      aOpqrst?.status === "answered" ||
      aOpqrst?.status === "unknown" ||
      aOpqrst?.status === "skipped" ||
      incomplete(aOpqrst?.status)
    ) {
      return "chest_opqrst";
    }
    return "chief_complaint_1";
  }
  if (needsQualityStep(state)) {
    if (
      incomplete(aQuality?.status) &&
      aQuality?.status !== "unknown" &&
      aQuality?.status !== "skipped"
    ) {
      return "chief_complaint_quality";
    }
  }
  if (
    incomplete(aDur?.status) &&
    aDur?.status !== "unknown" &&
    aDur?.status !== "skipped"
  ) {
    return "chief_complaint_duration";
  }
  if (needsQualityStep(state) && aQuality?.status === "answered") {
    return "chief_complaint_quality";
  }
  if (aDur?.status === "answered") return "chief_complaint_duration";
  return "chief_complaint_1";
}

export function isChiefComplaintPathStep(step: InterviewStep): boolean {
  return (
    step === "chief_complaint_1" ||
    step === "chest_opqrst" ||
    step === "chief_complaint_quality" ||
    step === "chief_complaint_duration"
  );
}
