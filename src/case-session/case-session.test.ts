import { describe, expect, it } from "vitest";
import {
  beginInterview,
  canBeginInterview,
  createCase,
  getStepAnswer,
  setInformant,
  setSecondLanguage,
  startNewCase,
  withAnswerForTesting,
} from "./case-session.js";

describe("CaseSession", () => {
  it("creates a fresh case at the start step with no answers", () => {
    const state = createCase();

    expect(state.id).toMatch(/^case-\d+$/);
    expect(state.currentStep).toBe("start");
    expect(state.secondLanguage).toBeNull();
    expect(state.informant).toBeNull();
    expect(state.informantHistory).toEqual([]);
    expect(state.answers).toEqual({});
    expect(getStepAnswer(state, "chief_complaint_1").status).toBe("empty");
  });

  it("startNewCase clears prior answers and identity fields", () => {
    const dirty = withAnswerForTesting(
      {
        ...createCase(),
        secondLanguage: "en",
        informant: "family",
        informantHistory: ["family"],
        currentStep: "summary",
      },
      "medications",
      ["antihypertensive"],
    );

    expect(getStepAnswer(dirty, "medications").optionIds).toEqual([
      "antihypertensive",
    ]);

    const next = startNewCase(dirty);

    expect(next.id).not.toBe(dirty.id);
    expect(next.currentStep).toBe("start");
    expect(next.secondLanguage).toBeNull();
    expect(next.informant).toBeNull();
    expect(next.informantHistory).toEqual([]);
    expect(next.answers).toEqual({});
    expect(next.returnToSummary).toBe(false);
    expect(getStepAnswer(next, "medications").status).toBe("empty");
  });

  it("stores second language selection (en / vi / id)", () => {
    let state = createCase();
    state = setSecondLanguage(state, "en");
    expect(state.secondLanguage).toBe("en");

    state = setSecondLanguage(state, "vi");
    expect(state.secondLanguage).toBe("vi");

    state = setSecondLanguage(state, "id");
    expect(state.secondLanguage).toBe("id");
  });

  it("stores informant and allows mid-case change without wiping answers", () => {
    let state = setInformant(createCase(), "family");
    expect(state.informant).toBe("family");
    expect(state.informantHistory).toEqual(["family"]);

    state = withAnswerForTesting(state, "before", ["sleeping"]);
    state = setInformant(state, "self");

    expect(state.informant).toBe("self");
    expect(state.informantHistory).toEqual(["family", "self"]);
    expect(getStepAnswer(state, "before").optionIds).toEqual(["sleeping"]);
  });

  it("does not append informant history when selecting the same informant", () => {
    let state = setInformant(createCase(), "friend");
    state = setInformant(state, "friend");
    expect(state.informantHistory).toEqual(["friend"]);
  });

  it("beginInterview requires language and informant, then leaves start", () => {
    let state = createCase();
    expect(canBeginInterview(state)).toBe(false);
    expect(beginInterview(state).currentStep).toBe("start");

    state = setSecondLanguage(state, "en");
    expect(canBeginInterview(state)).toBe(false);

    state = setInformant(state, "self");
    expect(canBeginInterview(state)).toBe(true);

    state = beginInterview(state);
    expect(state.currentStep).toBe("chief_complaint_1");
    expect(state.secondLanguage).toBe("en");
    expect(state.informant).toBe("self");
  });
});
