import { describe, expect, it } from "vitest";
import {
  beginInterview,
  createCase,
  setInformant,
  setSceneType,
  setSecondLanguage,
  startNewCase,
} from "./case-session.js";
import {
  completeChiefComplaint1,
  setTraumaTraffic,
  setTraumaVehicle,
  toggleBodyRegion,
  toggleComplaintType,
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
  completeChestOpqrst,
  setOpqrstOnset,
  setOpqrstQuality,
  setOpqrstSeverity,
  setOpqrstTimeAmount,
  setOpqrstTimePattern,
  setOpqrstTimeUnit,
  toggleOpqrstRegion,
} from "./chest-opqrst.js";
import {
  completeListStep,
  markListStepUnknown,
  setListNote,
  toggleListOption,
} from "./list-step.js";
import {
  completeOtherSymptoms,
  toggleSecondaryReason,
} from "./other-symptoms.js";
import {
  buildSummarySections,
  editFromSummary,
  finishCase,
  formatSummaryText,
  returnToSummaryView,
} from "./summary.js";
import type { CaseState } from "./types.js";

function fillHistory(state: CaseState): CaseState {
  let next = toggleListOption(state, "before", "working");
  next = completeListStep(next, "before");
  next = toggleListOption(next, "intake", "yesterday_dinner");
  next = completeListStep(next, "intake");
  next = markListStepUnknown(next, "past_history");
  next = completeListStep(next, "past_history");
  next = toggleListOption(next, "medications", "other");
  next = setListNote(next, "medications", "自備成藥");
  next = completeListStep(next, "medications");
  next = toggleListOption(next, "allergies", "none");
  return completeListStep(next, "allergies");
}

function finishedTraumaCase(): CaseState {
  let state = beginInterview(
    setSceneType(
      setInformant(setSecondLanguage(createCase(), "en"), "family"),
      "trauma",
    ),
  );
  state = setInformant(state, "self");
  state = setTraumaTraffic(state, "traffic");
  state = setTraumaVehicle(state, "motorcycle");
  state = completeChiefComplaint1(state);
  state = toggleBodyRegion(state, "chest");
  state = completeChiefComplaint1(state);
  state = toggleQuality(state, "crushing");
  state = completeChiefComplaintQuality(state);
  state = selectTimeBucket(state, "about_20_min");
  state = completeChiefComplaintDuration(state);
  state = fillHistory(state);
  state = toggleSecondaryReason(state, "pain");
  return completeOtherSymptoms(state);
}

function finishedChestOpqrstCase(): CaseState {
  let state = beginInterview(
    setSceneType(
      setInformant(setSecondLanguage(createCase(), "en"), "self"),
      "non_trauma",
    ),
  );
  state = toggleComplaintType(state, "chest_pain");
  state = completeChiefComplaint1(state);
  expect(state.currentStep).toBe("chest_opqrst");

  state = setOpqrstOnset(state, "sudden");
  state = setOpqrstQuality(state, "pressure");
  state = toggleOpqrstRegion(state, "chest_front");
  state = setOpqrstSeverity(state, 7);
  state = setOpqrstTimePattern(state, "continuous");
  state = setOpqrstTimeAmount(state, "30");
  state = setOpqrstTimeUnit(state, "minutes");
  state = completeChestOpqrst(state);
  expect(state.currentStep).toBe("before");

  state = fillHistory(state);
  state = toggleSecondaryReason(state, "dyspnea");
  state = toggleSecondaryReason(state, "fever");
  return completeOtherSymptoms(state);
}

describe("summary + clear", () => {
  it("builds trauma chief narrative with Scene type; secondary is its own section", () => {
    const state = finishedTraumaCase();
    const sections = buildSummarySections(state);
    const byKey = Object.fromEntries(sections.map((s) => [s.key, s]));

    expect(byKey.informant?.value.zh).toContain("本人");
    expect(byKey.informant?.value.zh).toContain("家屬 → 本人");
    expect(byKey.informant?.value.other).toContain("Patient");
    expect(byKey.chief?.obtained).toBe(true);
    expect(byKey.chief?.value.zh).toContain("創傷");
    expect(byKey.chief?.value.other.toLowerCase()).toContain("trauma");
    expect(byKey.chief?.value.zh).toMatch(/機車|壓迫|交通事故/);
    expect(byKey.chief?.value.zh).toContain("胸");
    expect(byKey.chief?.editStep).toBe("chief_complaint_quality");
    expect(byKey.past_history?.obtained).toBe(false);
    expect(byKey.past_history?.value.zh).toContain("不知道");
    expect(byKey.medications?.value.zh).toContain("自備成藥");
    expect(byKey.other_symptoms?.label.zh).toBe("還有其他感覺不舒服的地方");
    expect(byKey.other_symptoms?.value.zh).toContain("疼痛");
    expect(byKey.other_symptoms?.value.other.toLowerCase()).toContain("pain");

    const text = formatSummaryText(state);
    expect(text).toContain("本機摘要");
    expect(text).not.toContain("非評估或診斷");
    expect(text).not.toContain("張小熊");
    expect(text).toContain("主訴：");
    expect(text).toContain("創傷");
    expect(text).toContain("還有其他感覺不舒服的地方：");
    expect(text).toMatch(/機車|壓迫|交通事故/);
    expect(text).not.toMatch(/Chief complaint:/);
  });

  it("builds non-trauma chest OPQRST narrative and Chinese clipboard copy", () => {
    const state = finishedChestOpqrstCase();
    const sections = buildSummarySections(state);
    const byKey = Object.fromEntries(sections.map((s) => [s.key, s]));

    expect(byKey.chief?.obtained).toBe(true);
    expect(byKey.chief?.editStep).toBe("chest_opqrst");
    expect(byKey.chief?.value.zh).toContain("非創傷");
    expect(byKey.chief?.value.zh).toMatch(/胸痛|胸悶/);
    expect(byKey.chief?.value.zh).toContain("突然發生");
    expect(byKey.chief?.value.zh).toMatch(/壓痛|壓迫/);
    expect(byKey.chief?.value.zh).toContain("7/10");
    expect(byKey.chief?.value.zh).toContain("一直持續");
    expect(byKey.chief?.value.zh).toMatch(/30|分鐘/);
    expect(byKey.chief?.value.other.toLowerCase()).toContain("non-trauma");

    expect(byKey.other_symptoms?.label.zh).toBe("還有其他感覺不舒服的地方");
    expect(byKey.other_symptoms?.value.zh).toMatch(/喘|發燒/);

    const text = formatSummaryText(state);
    expect(text).toContain("主訴：非創傷");
    expect(text).toContain("還有其他感覺不舒服的地方：");
    expect(text).not.toContain("非評估或診斷");
    expect(text).not.toMatch(/Chief complaint:/);
    expect(text).not.toMatch(/Anywhere else/);
  });

  it("supports edit-from-summary return and finishCase clear", () => {
    let state = finishedTraumaCase();
    state = editFromSummary(state, "medications");
    expect(state.currentStep).toBe("medications");
    expect(state.returnToSummary).toBe(true);

    state = returnToSummaryView(state);
    expect(state.currentStep).toBe("summary");
    expect(state.returnToSummary).toBe(false);

    const cleared = finishCase(state);
    expect(cleared.currentStep).toBe("start");
    expect(cleared.answers).toEqual({});
    expect(cleared.informant).toBeNull();
    expect(cleared.id).not.toBe(state.id);

    expect(startNewCase(state).answers).toEqual({});
  });
});
