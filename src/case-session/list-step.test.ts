import { describe, expect, it } from "vitest";
import {
  beginInterview,
  createCase,
  setInformant,
  setSceneType,
  setSecondLanguage,
} from "./case-session.js";
import {
  completeChiefComplaint1,
  setTraumaTraffic,
  setTraumaVehicle,
  toggleBodyRegion,
} from "./chief-complaint-1.js";
import {
  completeChiefComplaintDuration,
  selectTimeBucket,
} from "./chief-complaint-duration.js";
import {
  completeChiefComplaintQuality,
  toggleQuality,
} from "./chief-complaint-quality.js";
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
    setSceneType(
      setInformant(setSecondLanguage(createCase(), "en"), "family"),
      "trauma",
    ),
  );
  state = setTraumaTraffic(state, "traffic");
  state = setTraumaVehicle(state, "car");
  state = completeChiefComplaint1(state);
  state = toggleBodyRegion(state, "abdomen");
  state = completeChiefComplaint1(state);
  state = toggleQuality(state, "same_as_complaint");
  state = completeChiefComplaintQuality(state);
  state = selectTimeBucket(state, "few_hours");
  return completeChiefComplaintDuration(state);
}

describe("history list steps 之前→吃→過→藥→敏", () => {
  it("toggles options and advances through the mnemonic", () => {
    let state = atBefore();
    expect(state.currentStep).toBe("before");
    state = toggleListOption(state, "before", "sleeping");
    expect(getListOptionIds(state, "before")).toContain("sleeping");
    expect(canCompleteListStep(state, "before")).toBe(true);
    state = completeListStep(state, "before");
    expect(state.currentStep).toBe("intake");
  });

  it("opens note field when opensNote option selected", () => {
    let state = atBefore();
    state = toggleListOption(state, "before", "other");
    expect(listStepNeedsNote(state, "before")).toBe(true);
    state = setListNote(state, "before", "逛街中");
    expect(getListNote(state, "before")).toBe("逛街中");
    expect(canCompleteListStep(state, "before")).toBe(true);
  });

  it("supports unknown, skip, back, and goto", () => {
    let state = atBefore();
    state = markListStepUnknown(state, "before");
    expect(canCompleteListStep(state, "before")).toBe(true);
    state = completeListStep(state, "before");
    expect(state.currentStep).toBe("intake");

    state = skipListStep(state, "intake");
    state = completeListStep(state, "intake");
    expect(state.currentStep).toBe("past_history");

    state = goBackListStep(state, "past_history");
    expect(state.currentStep).toBe("intake");

    state = goToStep(state, "medications");
    expect(state.currentStep).toBe("medications");
  });
});
