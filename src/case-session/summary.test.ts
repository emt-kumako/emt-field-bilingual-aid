import { describe, expect, it } from "vitest";
import {
  beginInterview,
  createCase,
  setInformant,
  setSecondLanguage,
  startNewCase,
} from "./case-session.js";
import {
  completeChiefComplaint1,
  toggleBodyRegion,
  toggleComplaintType,
} from "./chief-complaint-1.js";
import {
  completeChiefComplaint2,
  selectTimeBucket,
  setPainScore,
  toggleQuality,
} from "./chief-complaint-2.js";
import {
  completeListStep,
  markListStepUnknown,
  setListNote,
  toggleListOption,
} from "./list-step.js";
import {
  completeOtherSymptoms,
  toggleAccompanyingSymptom,
} from "./other-symptoms.js";
import {
  buildSummarySections,
  editFromSummary,
  finishCase,
  formatSummaryText,
  returnToSummaryView,
} from "./summary.js";

function finishedCase() {
  let state = beginInterview(
    setInformant(setSecondLanguage(createCase(), "en"), "family"),
  );
  state = setInformant(state, "self");
  state = toggleComplaintType(state, "pain");
  state = toggleBodyRegion(state, "chest");
  state = completeChiefComplaint1(state);
  state = toggleQuality(state, "crushing");
  state = selectTimeBucket(state, "about_20_min");
  state = setPainScore(state, 8);
  state = completeChiefComplaint2(state);

  state = toggleListOption(state, "before", "working");
  state = completeListStep(state, "before");
  state = toggleListOption(state, "intake", "over_4h");
  state = completeListStep(state, "intake");
  state = markListStepUnknown(state, "past_history");
  state = completeListStep(state, "past_history");
  state = toggleListOption(state, "medications", "other");
  state = setListNote(state, "medications", "自備成藥");
  state = completeListStep(state, "medications");
  state = toggleListOption(state, "allergies", "none");
  state = completeListStep(state, "allergies");

  state = toggleAccompanyingSymptom(state, "cold_sweat");
  return completeOtherSymptoms(state);
}

describe("summary + clear", () => {
  it("builds Chinese-primary summary with obtained vs not-obtained", () => {
    const state = finishedCase();
    const sections = buildSummarySections(state);
    const byKey = Object.fromEntries(sections.map((s) => [s.key, s]));

    expect(byKey.informant?.value).toContain("本人");
    expect(byKey.informant?.value).toContain("家屬 → 本人");
    expect(byKey.chief?.obtained).toBe(true);
    expect(byKey.chief?.value).toContain("疼痛");
    expect(byKey.chief?.value).toContain("痛尺：8/10");
    expect(byKey.past_history?.obtained).toBe(false);
    expect(byKey.past_history?.value).toContain("不知道");
    expect(byKey.medications?.value).toContain("自備成藥");
    expect(byKey.other_symptoms?.value).toContain("冒冷汗");

    const text = formatSummaryText(state);
    expect(text).toContain("本機摘要");
    expect(text).toContain("非評估或診斷");
    expect(text).toContain("主訴：");
  });

  it("supports edit-from-summary return and finishCase clear", () => {
    let state = finishedCase();
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

    // startNewCase is the same clear path
    expect(startNewCase(state).answers).toEqual({});
  });
});
