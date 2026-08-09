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
    expect(state.currentStep).toBe("chief_complaint_duration");
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
    expect(unknown.currentStep).toBe("chief_complaint_duration");

    let skipped = apply(state, { type: "nav", move: "skip" });
    expect(skipped.answers.chief_complaint_1?.status).toBe("skipped");
    skipped = apply(skipped, { type: "nav", move: "next" });
    expect(skipped.currentStep).toBe("chief_complaint_duration");
  });

  it("routes quality conditionally and keeps shared duration off the OPQRST path", () => {
    let trauma = createCase();
    trauma = apply(trauma, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    trauma = apply(trauma, { type: "nav", move: "next" });
    trauma = apply(trauma, { type: "edit", slot: "informant", value: "self" });
    trauma = apply(trauma, {
      type: "edit",
      slot: "sceneType",
      value: "trauma",
    });
    trauma = apply(trauma, { type: "nav", move: "next" });
    trauma = apply(trauma, {
      type: "edit",
      slot: "traumaTraffic",
      value: "traffic",
    });
    trauma = apply(trauma, {
      type: "edit",
      slot: "traumaVehicle",
      value: "motorcycle",
    });
    trauma = apply(trauma, { type: "nav", move: "next" });
    trauma = apply(trauma, {
      type: "edit",
      slot: "bodyRegion",
      value: "chest",
    });
    trauma = apply(trauma, { type: "nav", move: "next" });
    expect(trauma.currentStep).toBe("chief_complaint_quality");
    trauma = apply(trauma, {
      type: "edit",
      slot: "quality",
      value: "crushing",
    });
    trauma = apply(trauma, { type: "nav", move: "next" });
    expect(trauma.currentStep).toBe("chief_complaint_duration");

    let fever = createCase();
    fever = apply(fever, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    fever = apply(fever, { type: "nav", move: "next" });
    fever = apply(fever, { type: "edit", slot: "informant", value: "self" });
    fever = apply(fever, {
      type: "edit",
      slot: "sceneType",
      value: "non_trauma",
    });
    fever = apply(fever, { type: "nav", move: "next" });
    fever = apply(fever, {
      type: "edit",
      slot: "complaintType",
      value: "fever",
    });
    fever = apply(fever, { type: "nav", move: "next" });
    expect(fever.currentStep).toBe("chief_complaint_duration");
    fever = apply(fever, { type: "nav", move: "back" });
    expect(fever.currentStep).toBe("chief_complaint_1");

    let abdomen = createCase();
    abdomen = apply(abdomen, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    abdomen = apply(abdomen, { type: "nav", move: "next" });
    abdomen = apply(abdomen, {
      type: "edit",
      slot: "informant",
      value: "self",
    });
    abdomen = apply(abdomen, {
      type: "edit",
      slot: "sceneType",
      value: "non_trauma",
    });
    abdomen = apply(abdomen, { type: "nav", move: "next" });
    abdomen = apply(abdomen, {
      type: "edit",
      slot: "complaintType",
      value: "abdominal_pain",
    });
    abdomen = apply(abdomen, { type: "nav", move: "next" });
    expect(abdomen.currentStep).toBe("chief_complaint_quality");
    expect(viewFacts(abdomen).screen).toMatchObject({
      step: "chief_complaint_quality",
      showsPainScale: true,
      needsQualityStep: true,
    });
  });

  it("routes non-trauma chest_pain through OPQRST, writes duration, skips quality/duration", () => {
    let state = createCase();
    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "informant", value: "self" });
    state = apply(state, {
      type: "edit",
      slot: "sceneType",
      value: "non_trauma",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, {
      type: "edit",
      slot: "complaintType",
      value: "chest_pain",
    });
    state = apply(state, { type: "nav", move: "next" });

    expect(state.currentStep).toBe("chest_opqrst");
    expect(viewFacts(state).screen).toMatchObject({
      step: "chest_opqrst",
      onsetId: null,
      severity: null,
      timeUnknown: false,
    });
    expect(viewFacts(state).gate).toEqual({
      reason: "need_opqrst",
      nextEnabled: false,
    });

    const blocked = apply(state, { type: "nav", move: "next" });
    expect(blocked.currentStep).toBe("chest_opqrst");

    state = apply(state, {
      type: "edit",
      slot: "opqrstOnset",
      value: "sudden",
    });
    state = apply(state, {
      type: "edit",
      slot: "opqrstQuality",
      value: "pressure",
    });
    state = apply(state, {
      type: "edit",
      slot: "opqrstSeverity",
      value: "7",
    });
    state = apply(state, {
      type: "edit",
      slot: "opqrstTimePattern",
      value: "continuous",
    });
    expect(viewFacts(state).gate.nextEnabled).toBe(false);

    state = apply(state, {
      type: "edit",
      slot: "timeAmount",
      value: "30",
    });
    state = apply(state, {
      type: "edit",
      slot: "timeUnit",
      value: "minutes",
    });
    expect(viewFacts(state).gate.nextEnabled).toBe(true);
    expect(viewFacts(state).screen).toMatchObject({
      step: "chest_opqrst",
      onsetId: "sudden",
      qualityId: "pressure",
      severity: 7,
      timePattern: "continuous",
      timeAmount: 30,
      timeUnit: "minutes",
    });
    expect(state.answers.chief_complaint_duration?.detail).toMatchObject({
      timePattern: "continuous",
      timeAmount: 30,
      timeUnit: "minutes",
    });

    state = apply(state, { type: "nav", move: "next" });
    expect(state.currentStep).toBe("before");

    state = apply(state, { type: "nav", move: "back" });
    expect(state.currentStep).toBe("chest_opqrst");
  });

  it("branches secondary reasons by Scene type without body map", () => {
    let trauma = createCase();
    trauma = apply(trauma, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    trauma = apply(trauma, { type: "nav", move: "next" });
    trauma = apply(trauma, { type: "edit", slot: "informant", value: "self" });
    trauma = apply(trauma, {
      type: "edit",
      slot: "sceneType",
      value: "trauma",
    });
    trauma = { ...trauma, currentStep: "other_symptoms" };

    expect(viewFacts(trauma).screen).toMatchObject({
      step: "other_symptoms",
      reasonIds: [],
      secondaryCatalog: "trauma",
    });
    expect(viewFacts(trauma).gate.reason).toBe("need_secondary_reason");

    trauma = apply(trauma, {
      type: "edit",
      slot: "secondaryReason",
      value: "pain",
    });
    trauma = apply(trauma, {
      type: "edit",
      slot: "secondaryReason",
      value: "weakness",
    });
    expect(viewFacts(trauma).screen).toMatchObject({
      reasonIds: ["pain", "weakness"],
    });
    expect(viewFacts(trauma).gate.nextEnabled).toBe(true);
    const rejected = apply(trauma, {
      type: "edit",
      slot: "secondaryReason",
      value: "dyspnea",
    });
    expect(rejected).toEqual(trauma);

    let nonTrauma = createCase();
    nonTrauma = apply(nonTrauma, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    nonTrauma = apply(nonTrauma, { type: "nav", move: "next" });
    nonTrauma = apply(nonTrauma, {
      type: "edit",
      slot: "informant",
      value: "self",
    });
    nonTrauma = apply(nonTrauma, {
      type: "edit",
      slot: "sceneType",
      value: "non_trauma",
    });
    nonTrauma = { ...nonTrauma, currentStep: "other_symptoms" };

    expect(viewFacts(nonTrauma).screen).toMatchObject({
      secondaryCatalog: "non_trauma",
    });
    const ohcaRejected = apply(nonTrauma, {
      type: "edit",
      slot: "secondaryReason",
      value: "ohca",
    });
    expect(ohcaRejected).toEqual(nonTrauma);

    nonTrauma = apply(nonTrauma, {
      type: "edit",
      slot: "secondaryReason",
      value: "fever",
    });
    nonTrauma = apply(nonTrauma, {
      type: "edit",
      slot: "secondaryReason",
      value: "dyspnea",
    });
    expect(viewFacts(nonTrauma).screen).toMatchObject({
      reasonIds: ["fever", "dyspnea"],
    });
    nonTrauma = apply(nonTrauma, { type: "nav", move: "next" });
    expect(nonTrauma.currentStep).toBe("summary");
  });

  it("allows OPQRST unknown/skip and time-unknown to satisfy T", () => {
    let state = createCase();
    state = apply(state, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, { type: "edit", slot: "informant", value: "self" });
    state = apply(state, {
      type: "edit",
      slot: "sceneType",
      value: "non_trauma",
    });
    state = apply(state, { type: "nav", move: "next" });
    state = apply(state, {
      type: "edit",
      slot: "complaintType",
      value: "chest_pain",
    });
    state = apply(state, { type: "nav", move: "next" });

    let unknown = apply(state, { type: "nav", move: "unknown" });
    expect(unknown.answers.chest_opqrst?.status).toBe("unknown");
    unknown = apply(unknown, { type: "nav", move: "next" });
    expect(unknown.currentStep).toBe("before");

    let skipped = apply(state, { type: "nav", move: "skip" });
    expect(skipped.answers.chest_opqrst?.status).toBe("skipped");
    skipped = apply(skipped, { type: "nav", move: "next" });
    expect(skipped.currentStep).toBe("before");

    state = apply(state, {
      type: "edit",
      slot: "opqrstOnset",
      value: "gradual",
    });
    state = apply(state, {
      type: "edit",
      slot: "opqrstQuality",
      value: "stabbing",
    });
    state = apply(state, {
      type: "edit",
      slot: "opqrstSeverity",
      value: "0",
    });
    state = apply(state, {
      type: "edit",
      slot: "opqrstTimePattern",
      value: "intermittent",
    });
    state = apply(state, { type: "edit", slot: "opqrstTimeUnknown" });
    expect(viewFacts(state).screen).toMatchObject({ timeUnknown: true });
    expect(viewFacts(state).gate.nextEnabled).toBe(true);
    state = apply(state, { type: "nav", move: "next" });
    expect(state.currentStep).toBe("before");
  });
});
