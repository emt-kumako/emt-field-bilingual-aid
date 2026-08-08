import { describe, expect, it } from "vitest";
import { createCase } from "./case-session.js";
import { apply, viewFacts } from "./session.js";

describe("CaseSession apply / viewFacts", () => {
  it("keeps Start phase on Case and advances language → informant → interview", () => {
    let state = createCase();
    expect(state.startPhase).toBe("language");
    expect(viewFacts(state).gate.nextEnabled).toBe(false);
    expect(viewFacts(state).gate.reason).toBe("need_second_language");

    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    expect(viewFacts(state).gate.nextEnabled).toBe(true);

    state = apply(state, { type: "nav", move: "next" });
    expect(state.startPhase).toBe("informant");
    expect(viewFacts(state).screen).toMatchObject({
      step: "start",
      startPhase: "informant",
    });
    expect(viewFacts(state).gate.reason).toBe("need_informant");

    state = apply(state, { type: "edit", slot: "informant", value: "self" });
    state = apply(state, { type: "nav", move: "next" });
    expect(state.currentStep).toBe("chief_complaint_1");
  });

  it("soft-gates next but still allows back from informant to language", () => {
    let state = createCase();
    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "vi",
    });
    state = apply(state, { type: "nav", move: "next" });
    expect(state.startPhase).toBe("informant");

    const blocked = apply(state, { type: "nav", move: "next" });
    expect(blocked.currentStep).toBe("start");
    expect(blocked.startPhase).toBe("informant");
    expect(blocked.informant).toBeNull();

    state = apply(state, { type: "nav", move: "back" });
    expect(state.startPhase).toBe("language");
  });

  it("routes click and input through the same apply path", () => {
    let state = createCase();
    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "informant", value: "family" });
    state = apply(state, { type: "nav", move: "next" });
    expect(state.currentStep).toBe("chief_complaint_1");

    state = apply(state, {
      type: "edit",
      slot: "complaintType",
      value: "pain",
    });
    state = apply(state, { type: "edit", slot: "bodyRegion", value: "chest" });
    expect(viewFacts(state).gate.nextEnabled).toBe(true);
    state = apply(state, { type: "nav", move: "next" });
    expect(state.currentStep).toBe("chief_complaint_quality");

    state = apply(state, { type: "edit", slot: "quality", value: "crushing" });
    state = apply(state, { type: "nav", move: "next" });
    expect(state.currentStep).toBe("chief_complaint_duration");

    state = apply(state, { type: "edit", slot: "timeAmount", value: "30" });
    state = apply(state, { type: "edit", slot: "timeUnit", value: "minutes" });
    const facts = viewFacts(state);
    expect(facts.gate.nextEnabled).toBe(true);
    expect(facts.screen).toMatchObject({
      step: "chief_complaint_duration",
      timeAmount: 30,
      timeUnit: "minutes",
    });
  });

  it("lands on informant Start phase when backing from chief complaint 1", () => {
    let state = createCase();
    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "informant", value: "self" });
    state = apply(state, { type: "nav", move: "next" });
    expect(state.currentStep).toBe("chief_complaint_1");
    state = apply(state, { type: "nav", move: "back" });
    expect(state.currentStep).toBe("start");
    expect(state.startPhase).toBe("informant");
  });
});
