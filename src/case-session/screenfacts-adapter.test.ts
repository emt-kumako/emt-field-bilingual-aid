import { describe, expect, it } from "vitest";
import mainSource from "../main.ts?raw";
import { createCase } from "./case-session.js";
import { apply, viewFacts } from "./orchestrate.js";

describe("ScreenFacts DOM adapter seam", () => {
  it("keeps main free of step getters and state.answers reads", () => {
    expect(mainSource).not.toMatch(/state\.answers/);
    expect(mainSource).not.toMatch(/getChiefComplaint1Detail/);
    expect(mainSource).not.toMatch(/getChiefComplaintQualityDetail/);
    expect(mainSource).not.toMatch(/getChiefComplaintDurationDetail/);
    expect(mainSource).not.toMatch(/getChestOpqrstDetail/);
    expect(mainSource).not.toMatch(/getOtherSymptomsDetail/);
    expect(mainSource).not.toMatch(/getListOptionIds/);
    expect(mainSource).not.toMatch(/getListNote/);
    expect(mainSource).not.toMatch(/listStepNeedsNote/);
    expect(mainSource).not.toMatch(/getPrimaryNote/);
    expect(mainSource).not.toMatch(/needsBodyLocation\(/);
    expect(mainSource).not.toMatch(/primaryOpensNote\(/);
    expect(mainSource).not.toMatch(/traumaAsksFallHeight\(/);
    expect(mainSource).not.toMatch(/usesTraumaPrimary\(/);
    expect(mainSource).not.toMatch(/usesNonTraumaPrimary\(/);
    expect(mainSource).not.toMatch(/showsPainScale\(/);
    expect(mainSource).not.toMatch(/formatDurationForLang\(/);
    expect(mainSource).toMatch(/viewFacts\(/);
    expect(mainSource).toMatch(/from "\.\/catalog\//);
  });

  it("exposes paint fields for chief complaint path and history screens", () => {
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
    expect(viewFacts(trauma).screen).toMatchObject({
      step: "chief_complaint_1",
      usesTraumaPrimary: true,
      traumaStage: "mechanism",
      traumaAsksFallHeight: false,
      answerStatus: "empty",
    });

    trauma = apply(trauma, {
      type: "edit",
      slot: "traumaTraffic",
      value: "non_traffic",
    });
    trauma = apply(trauma, {
      type: "edit",
      slot: "traumaInjury",
      value: "fall_from_height",
    });
    expect(viewFacts(trauma).screen).toMatchObject({
      traumaAsksFallHeight: true,
      traumaInjuryTypeId: "fall_from_height",
    });
    trauma = apply(trauma, { type: "nav", move: "next" });
    trauma = apply(trauma, {
      type: "edit",
      slot: "bodyRegion",
      value: "chest",
    });
    trauma = apply(trauma, { type: "nav", move: "next" });
    expect(viewFacts(trauma).screen).toMatchObject({
      step: "chief_complaint_quality",
      showsPainScale: false,
      needsQualityStep: true,
      answerStatus: "empty",
    });
    trauma = apply(trauma, {
      type: "edit",
      slot: "quality",
      value: "crushing",
    });
    trauma = apply(trauma, { type: "nav", move: "next" });
    expect(viewFacts(trauma).screen).toMatchObject({
      step: "chief_complaint_duration",
      timePattern: null,
      timeAmount: null,
      answerStatus: "empty",
    });
    trauma = apply(trauma, { type: "edit", slot: "timeAmount", value: "8" });
    trauma = apply(trauma, { type: "edit", slot: "timeUnit", value: "hours" });
    trauma = apply(trauma, { type: "nav", move: "next" });
    expect(viewFacts(trauma).screen).toMatchObject({
      step: "before",
      optionIds: [],
      note: "",
      noteRequired: false,
      answerStatus: "empty",
    });
    trauma = apply(trauma, {
      type: "edit",
      slot: "listOption",
      value: "sleeping",
    });
    expect(viewFacts(trauma).screen).toMatchObject({
      optionIds: ["sleeping"],
      answerStatus: "answered",
    });

    let chest = createCase();
    chest = apply(chest, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    chest = apply(chest, { type: "nav", move: "next" });
    chest = apply(chest, { type: "edit", slot: "informant", value: "self" });
    chest = apply(chest, {
      type: "edit",
      slot: "sceneType",
      value: "non_trauma",
    });
    chest = apply(chest, { type: "nav", move: "next" });
    chest = apply(chest, {
      type: "edit",
      slot: "complaintType",
      value: "chest_pain",
    });
    chest = apply(chest, { type: "nav", move: "next" });
    chest = apply(chest, {
      type: "edit",
      slot: "opqrstOnset",
      value: "sudden",
    });
    chest = apply(chest, {
      type: "edit",
      slot: "opqrstQuality",
      value: "pressure",
    });
    chest = apply(chest, {
      type: "edit",
      slot: "opqrstSeverity",
      value: "4",
    });
    chest = apply(chest, {
      type: "edit",
      slot: "opqrstTimePattern",
      value: "continuous",
    });
    chest = apply(chest, { type: "edit", slot: "timeAmount", value: "5" });
    chest = apply(chest, { type: "edit", slot: "timeUnit", value: "minutes" });
    expect(viewFacts(chest).screen).toMatchObject({
      step: "chest_opqrst",
      timePattern: "continuous",
      timeAmount: 5,
      timeUnit: "minutes",
      timeUnknown: false,
      answerStatus: "answered",
    });

    let other = createCase();
    other = apply(other, {
      type: "edit",
      slot: "secondLanguage",
      value: "en",
    });
    other = apply(other, { type: "nav", move: "next" });
    other = apply(other, { type: "edit", slot: "informant", value: "self" });
    other = apply(other, {
      type: "edit",
      slot: "sceneType",
      value: "non_trauma",
    });
    other = { ...other, currentStep: "other_symptoms" };
    expect(viewFacts(other).screen).toMatchObject({
      step: "other_symptoms",
      reasonIds: [],
      secondaryCatalog: "non_trauma",
      answerStatus: "empty",
    });
  });
});
