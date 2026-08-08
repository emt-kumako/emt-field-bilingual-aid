import { describe, expect, it } from "vitest";
import {
  beginInterview,
  createCase,
  setInformant,
  setSecondLanguage,
} from "./case-session.js";
import {
  completeChiefComplaint1,
  toggleComplaintType,
} from "./chief-complaint-1.js";
import {
  completeChiefComplaint2,
  selectTimeBucket,
} from "./chief-complaint-2.js";
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

function atBefore() {
  let state = beginInterview(
    setInformant(setSecondLanguage(createCase(), "en"), "family"),
  );
  state = toggleComplaintType(state, "weakness");
  state = completeChiefComplaint1(state);
  state = selectTimeBucket(state, "few_hours");
  return completeChiefComplaint2(state);
}

describe("history list steps 之前→吃→過→藥→敏", () => {
  it("supports multi-select and EMT 其他 note", () => {
    let state = atBefore();
    expect(state.currentStep).toBe("before");

    state = toggleListOption(state, "before", "walking");
    state = toggleListOption(state, "before", "working");
    expect(getListOptionIds(state, "before")).toEqual(["walking", "working"]);

    state = toggleListOption(state, "before", "other");
    expect(listStepNeedsNote(state, "before")).toBe(true);
    state = setListNote(state, "before", "剛搬完重物");
    expect(getListNote(state, "before")).toBe("剛搬完重物");
    expect(canCompleteListStep(state, "before")).toBe(true);

    state = completeListStep(state, "before");
    expect(state.currentStep).toBe("intake");
  });

  it("uses single-select for 吃 and exclusive 無 clears other meds", () => {
    let state = atBefore();
    state = toggleListOption(state, "before", "resting");
    state = completeListStep(state, "before");

    state = toggleListOption(state, "intake", "within_1h");
    state = toggleListOption(state, "intake", "over_4h");
    expect(getListOptionIds(state, "intake")).toEqual(["over_4h"]);
    state = completeListStep(state, "intake");

    state = toggleListOption(state, "past_history", "diabetes");
    state = completeListStep(state, "past_history");

    state = toggleListOption(state, "medications", "antihypertensive");
    state = toggleListOption(state, "medications", "diabetes_meds");
    state = toggleListOption(state, "medications", "none");
    expect(getListOptionIds(state, "medications")).toEqual(["none"]);
  });

  it("marks skip/unknown per step and allows free back/forward edit", () => {
    let state = atBefore();
    state = markListStepUnknown(state, "before");
    expect(state.answers.before?.status).toBe("unknown");
    state = completeListStep(state, "before");

    state = skipListStep(state, "intake");
    expect(state.answers.intake?.status).toBe("skipped");
    state = completeListStep(state, "intake");
    expect(state.currentStep).toBe("past_history");

    state = goBackListStep(state, "past_history");
    expect(state.currentStep).toBe("intake");

    state = goToStep(state, "medications");
    state = toggleListOption(state, "medications", "painkillers");
    expect(getListOptionIds(state, "medications")).toEqual(["painkillers"]);

    state = goToStep(state, "allergies");
    state = toggleListOption(state, "allergies", "drug_allergy");
    state = setListNote(state, "allergies", "盤尼西林");
    state = completeListStep(state, "allergies");
    expect(state.currentStep).toBe("other_symptoms");
  });
});
