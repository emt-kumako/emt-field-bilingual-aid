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
  secondaryCatalogKind,
  skipOtherSymptoms,
  toggleSecondaryReason,
} from "./other-symptoms.js";
import type { CaseState } from "./types.js";

function atOtherSymptoms(scene: "trauma" | "non_trauma"): CaseState {
  return {
    ...beginInterview(
      setSceneType(
        setInformant(setSecondLanguage(createCase(), "en"), "self"),
        scene,
      ),
    ),
    currentStep: "other_symptoms",
  };
}

describe("secondary reasons (other_symptoms)", () => {
  it("uses trauma sensation catalog without body map fields", () => {
    let state = atOtherSymptoms("trauma");
    expect(secondaryCatalogKind(state)).toBe("trauma");
    expect(canCompleteOtherSymptoms(state)).toBe(false);

    state = toggleSecondaryReason(state, "pain");
    state = toggleSecondaryReason(state, "numbness");
    expect(getOtherSymptomsDetail(state).reasonIds).toEqual([
      "pain",
      "numbness",
    ]);
    expect(canCompleteOtherSymptoms(state)).toBe(true);

    // Traffic / OHCA / non-trauma primary ids are rejected on trauma path.
    const blocked = toggleSecondaryReason(state, "dyspnea");
    expect(blocked).toBe(state);

    state = completeOtherSymptoms(state);
    expect(state.currentStep).toBe("summary");
  });

  it("uses non-trauma primary catalog minus OHCA", () => {
    let state = atOtherSymptoms("non_trauma");
    expect(secondaryCatalogKind(state)).toBe("non_trauma");

    const ohca = toggleSecondaryReason(state, "ohca");
    expect(ohca).toBe(state);

    state = toggleSecondaryReason(state, "unconscious");
    state = toggleSecondaryReason(state, "dyspnea");
    expect(getOtherSymptomsDetail(state).reasonIds).toEqual([
      "unconscious",
      "dyspnea",
    ]);
    state = completeOtherSymptoms(state);
    expect(state.currentStep).toBe("summary");
  });

  it("supports unknown / skip without selections", () => {
    let unknown = markOtherSymptomsUnknown(atOtherSymptoms("trauma"));
    expect(unknown.answers.other_symptoms?.status).toBe("unknown");
    unknown = completeOtherSymptoms(unknown);
    expect(unknown.currentStep).toBe("summary");

    let skipped = skipOtherSymptoms(atOtherSymptoms("non_trauma"));
    skipped = completeOtherSymptoms(skipped);
    expect(skipped.currentStep).toBe("summary");
  });

  it("treats secondary「無」as exclusive of other reasons", () => {
    let trauma = atOtherSymptoms("trauma");
    trauma = toggleSecondaryReason(trauma, "pain");
    trauma = toggleSecondaryReason(trauma, "weakness");
    expect(getOtherSymptomsDetail(trauma).reasonIds).toEqual([
      "pain",
      "weakness",
    ]);
    trauma = toggleSecondaryReason(trauma, "none");
    expect(getOtherSymptomsDetail(trauma).reasonIds).toEqual(["none"]);
    trauma = toggleSecondaryReason(trauma, "bleeding");
    expect(getOtherSymptomsDetail(trauma).reasonIds).toEqual(["bleeding"]);

    let nonTrauma = atOtherSymptoms("non_trauma");
    nonTrauma = toggleSecondaryReason(nonTrauma, "none");
    expect(getOtherSymptomsDetail(nonTrauma).reasonIds).toEqual(["none"]);
    expect(canCompleteOtherSymptoms(nonTrauma)).toBe(true);
    nonTrauma = completeOtherSymptoms(nonTrauma);
    expect(nonTrauma.currentStep).toBe("summary");
  });
});
