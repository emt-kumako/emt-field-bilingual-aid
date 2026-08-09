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
  toggleBodyRegion,
  toggleComplaintType,
} from "./chief-complaint-1.js";
import {
  completeChiefComplaintDuration,
  selectTimeBucket,
} from "./chief-complaint-duration.js";
import {
  completeChiefComplaintQuality,
  setPainScore,
  toggleQuality,
} from "./chief-complaint-quality.js";
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
    setSceneType(
      setInformant(setSecondLanguage(createCase(), "en"), "family"),
      "non_trauma",
    ),
  );
  state = setInformant(state, "self");
  state = toggleComplaintType(state, "pain");
  state = toggleBodyRegion(state, "chest");
  state = completeChiefComplaint1(state);
  state = toggleQuality(state, "crushing");
  state = setPainScore(state, 8);
  state = completeChiefComplaintQuality(state);
  state = selectTimeBucket(state, "about_20_min");
  state = completeChiefComplaintDuration(state);

  state = toggleListOption(state, "before", "working");
  state = completeListStep(state, "before");
  state = toggleListOption(state, "intake", "yesterday_dinner");
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
  it("builds bilingual summary for display; copy text stays Chinese", () => {
    const state = finishedCase();
    const sections = buildSummarySections(state);
    const byKey = Object.fromEntries(sections.map((s) => [s.key, s]));

    expect(byKey.informant?.value.zh).toContain("本人");
    expect(byKey.informant?.value.zh).toContain("家屬 → 本人");
    expect(byKey.informant?.value.other).toContain("Patient");
    expect(byKey.chief?.obtained).toBe(true);
    expect(byKey.chief?.value.zh).toContain("疼痛");
    expect(byKey.chief?.value.zh).toContain("痛尺：8/10");
    expect(byKey.chief?.value.other).toMatch(/Pain|pain/i);
    expect(byKey.chief?.editStep).toBe("chief_complaint_quality");
    expect(byKey.past_history?.obtained).toBe(false);
    expect(byKey.past_history?.value.zh).toContain("不知道");
    expect(byKey.medications?.value.zh).toContain("自備成藥");
    expect(byKey.other_symptoms?.value.zh).toContain("冒冷汗");
    expect(byKey.other_symptoms?.value.other.toLowerCase()).toContain("sweat");

    const text = formatSummaryText(state);
    expect(text).toContain("本機摘要");
    expect(text).not.toContain("非評估或診斷");
    expect(text).not.toContain("張小熊");
    expect(text).toContain("主訴：");
    expect(text).toContain("疼痛");
    expect(text).not.toMatch(/Chief complaint:/);
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
