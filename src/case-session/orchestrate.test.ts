import { describe, expect, it } from "vitest";
import { createCase } from "./case-session.js";
import { apply, viewFacts } from "./orchestrate.js";

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
    expect(viewFacts(state).gate.reason).toBe("need_scene_type");
    expect(viewFacts(state).gate.nextEnabled).toBe(false);

    state = apply(state, { type: "edit", slot: "sceneType", value: "non_trauma" });
    expect(viewFacts(state).screen).toMatchObject({
      step: "start",
      sceneType: "non_trauma",
    });
    expect(viewFacts(state).gate.nextEnabled).toBe(true);

    state = apply(state, { type: "nav", move: "next" });
    expect(state.currentStep).toBe("chief_complaint_1");
    expect(state.sceneType).toBe("non_trauma");
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
    expect(blocked.sceneType).toBeNull();

    state = apply(state, { type: "nav", move: "back" });
    expect(state.startPhase).toBe("language");
  });

  it("clears chief-path answers when Scene type changes but keeps history", () => {
    let state = createCase();
    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "informant", value: "self" });
    state = apply(state, { type: "edit", slot: "sceneType", value: "non_trauma" });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, {
      type: "edit",
      slot: "complaintType",
      value: "dyspnea",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "quality", value: "crushing" });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "timeAmount", value: "10" });
    state = apply(state, { type: "edit", slot: "timeUnit", value: "minutes" });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "listOption", value: "sleeping" });
    expect(state.answers.before?.optionIds).toContain("sleeping");
    expect(state.answers.chief_complaint_1).toBeTruthy();

    state = apply(state, { type: "nav", move: "edit", step: "start" });
    state = apply(state, { type: "edit", slot: "sceneType", value: "trauma" });
    expect(state.sceneType).toBe("trauma");
    expect(state.answers.chief_complaint_1).toBeUndefined();
    expect(state.answers.chief_complaint_quality).toBeUndefined();
    expect(state.answers.chief_complaint_duration).toBeUndefined();
    expect(state.answers.other_symptoms).toBeUndefined();
    expect(state.answers.before?.optionIds).toContain("sleeping");
  });

  it("clears Scene type on finish", () => {
    let state = createCase();
    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "informant", value: "self" });
    state = apply(state, { type: "edit", slot: "sceneType", value: "trauma" });
    state = apply(state, { type: "nav", move: "finish" });
    expect(state.sceneType).toBeNull();
    expect(state.currentStep).toBe("start");
  });

  it("routes trauma mechanism then body through apply", () => {
    let state = createCase();
    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "informant", value: "family" });
    state = apply(state, { type: "edit", slot: "sceneType", value: "trauma" });
    state = apply(state, { type: "nav", move: "next" });
    expect(state.currentStep).toBe("chief_complaint_1");
    expect(viewFacts(state).screen).toMatchObject({
      usesTraumaPrimary: true,
      traumaStage: "mechanism",
    });
    expect(viewFacts(state).gate.reason).toBe("need_trauma_mechanism");

    state = apply(state, { type: "edit", slot: "traumaOhca" });
    state = apply(state, {
      type: "edit",
      slot: "traumaTraffic",
      value: "traffic",
    });
    expect(viewFacts(state).gate.reason).toBe("need_trauma_vehicle");
    state = apply(state, {
      type: "edit",
      slot: "traumaVehicle",
      value: "motorcycle",
    });
    expect(viewFacts(state).gate.nextEnabled).toBe(true);
    state = apply(state, { type: "nav", move: "next" });
    expect(viewFacts(state).screen).toMatchObject({ traumaStage: "body" });

    state = apply(state, { type: "edit", slot: "bodyRegion", value: "chest" });
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

  it("covers non-traffic trauma with fall height", () => {
    let state = createCase();
    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "informant", value: "self" });
    state = apply(state, { type: "edit", slot: "sceneType", value: "trauma" });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, {
      type: "edit",
      slot: "traumaTraffic",
      value: "non_traffic",
    });
    state = apply(state, {
      type: "edit",
      slot: "traumaInjury",
      value: "fall_from_height",
    });
    state = apply(state, {
      type: "edit",
      slot: "traumaFallHeight",
      value: "2",
    });
    expect(viewFacts(state).screen).toMatchObject({
      traumaAsksFallHeight: true,
      traumaFallHeightMeters: 2,
    });
    state = apply(state, { type: "nav", move: "next" });
    expect(viewFacts(state).screen).toMatchObject({ traumaStage: "body" });
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
    state = apply(state, { type: "edit", slot: "sceneType", value: "trauma" });
    state = apply(state, { type: "nav", move: "next" });
    expect(state.currentStep).toBe("chief_complaint_1");
    state = apply(state, { type: "nav", move: "back" });
    expect(state.currentStep).toBe("start");
    expect(state.startPhase).toBe("informant");
    expect(state.sceneType).toBe("trauma");
  });

  it("uses single-select non-trauma primary catalog with OHCA-only and other note", () => {
    let state = createCase();
    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "informant", value: "self" });
    state = apply(state, { type: "edit", slot: "sceneType", value: "non_trauma" });
    state = apply(state, { type: "nav", move: "next" });

    expect(viewFacts(state).screen).toMatchObject({
      step: "chief_complaint_1",
      usesNonTraumaPrimary: true,
      needsBodyLocation: false,
    });
    expect(viewFacts(state).gate.nextEnabled).toBe(false);

    state = apply(state, { type: "edit", slot: "complaintType", value: "ohca" });
    expect(viewFacts(state).screen).toMatchObject({
      complaintTypeIds: ["ohca"],
    });
    expect(viewFacts(state).gate.nextEnabled).toBe(true);

    state = apply(state, {
      type: "edit",
      slot: "complaintType",
      value: "chest_pain",
    });
    expect(viewFacts(state).screen).toMatchObject({
      complaintTypeIds: ["chest_pain"],
    });

    state = apply(state, { type: "edit", slot: "complaintType", value: "other" });
    expect(viewFacts(state).screen).toMatchObject({
      complaintTypeIds: ["other"],
      primaryOpensNote: true,
    });
    state = apply(state, {
      type: "edit",
      slot: "primaryNote",
      value: "異味",
    });
    expect(viewFacts(state).screen).toMatchObject({ primaryNote: "異味" });

    state = apply(state, { type: "nav", move: "next" });
    expect(state.currentStep).toBe("chief_complaint_quality");
  });

  it("keeps unknown and skip available when Next is soft-gated", () => {
    let state = createCase();
    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "informant", value: "self" });
    state = apply(state, { type: "edit", slot: "sceneType", value: "trauma" });
    state = apply(state, { type: "nav", move: "next" });
    expect(viewFacts(state).gate.nextEnabled).toBe(false);

    const blockedNext = apply(state, { type: "nav", move: "next" });
    expect(blockedNext.currentStep).toBe("chief_complaint_1");

    let unknown = apply(state, { type: "nav", move: "unknown" });
    expect(unknown.answers.chief_complaint_1?.status).toBe("unknown");
    unknown = apply(unknown, { type: "nav", move: "next" });
    expect(unknown.currentStep).toBe("chief_complaint_quality");

    let skipped = apply(state, { type: "nav", move: "skip" });
    expect(skipped.answers.chief_complaint_1?.status).toBe("skipped");
    skipped = apply(skipped, { type: "nav", move: "next" });
    expect(skipped.currentStep).toBe("chief_complaint_quality");
  });
});
