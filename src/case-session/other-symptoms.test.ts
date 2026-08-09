import { describe, expect, it } from "vitest";
import {
  beginInterview,
  createCase,
  setInformant,
  setSceneType,
  setSecondLanguage,
} from "./case-session.js";
import {
  canCompleteOtherSymptoms,
  completeOtherSymptoms,
  getOtherSymptomsDetail,
  markOtherSymptomsUnknown,
  skipOtherSymptoms,
  toggleAccompanyingSymptom,
  toggleOtherBodyRegion,
} from "./other-symptoms.js";
import type { CaseState } from "./types.js";

function atOtherSymptoms(): CaseState {
  return {
    ...beginInterview(
      setSceneType(
        setInformant(setSecondLanguage(createCase(), "en"), "self"),
        "trauma",
      ),
    ),
    currentStep: "other_symptoms",
  };
}

describe("other symptoms (感)", () => {
  it("is a single pass to summary with accompanying findings", () => {
    let state = atOtherSymptoms();
    state = toggleAccompanyingSymptom(state, "cold_sweat");
    state = toggleAccompanyingSymptom(state, "shortness_of_breath");
    state = toggleOtherBodyRegion(state, "chest");
    expect(canCompleteOtherSymptoms(state)).toBe(true);

    state = completeOtherSymptoms(state);
    expect(state.currentStep).toBe("summary");
    expect(getOtherSymptomsDetail(state).symptomIds).toEqual([
      "cold_sweat",
      "shortness_of_breath",
    ]);
    // Completing again from summary is not a restart of 主訴
    expect(state.currentStep).not.toBe("chief_complaint_1");
  });

  it("supports 沒有其他 / unknown / skip", () => {
    let none = toggleAccompanyingSymptom(atOtherSymptoms(), "none_other");
    expect(getOtherSymptomsDetail(none).symptomIds).toEqual(["none_other"]);
    none = completeOtherSymptoms(none);
    expect(none.currentStep).toBe("summary");

    let unknown = markOtherSymptomsUnknown(atOtherSymptoms());
    expect(unknown.answers.other_symptoms?.status).toBe("unknown");
    unknown = completeOtherSymptoms(unknown);
    expect(unknown.currentStep).toBe("summary");

    let skipped = skipOtherSymptoms(atOtherSymptoms());
    skipped = completeOtherSymptoms(skipped);
    expect(skipped.currentStep).toBe("summary");
  });
});
