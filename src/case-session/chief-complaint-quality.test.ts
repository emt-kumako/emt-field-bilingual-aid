import { describe, expect, it } from "vitest";
import {
  beginInterview,
  createCase,
  setInformant,
  setSceneType,
  setSecondLanguage,
} from "./case-session.js";
import {
  completeChiefComplaint1,
  toggleBodyRegion,
  toggleComplaintType,
} from "./chief-complaint-1.js";
import { formatApproxDuration } from "../catalog/chief-complaint-duration.js";
import {
  canCompleteChiefComplaintDuration,
  completeChiefComplaintDuration,
  getChiefComplaintDurationDetail,
  markChiefComplaintDurationUnknown,
  selectTimeBucket,
  setTimeAmount,
  setTimeRefine,
  setTimeUnit,
  skipChiefComplaintDuration,
} from "./chief-complaint-duration.js";
import {
  canCompleteChiefComplaintQuality,
  completeChiefComplaintQuality,
  getChiefComplaintQualityDetail,
  markChiefComplaintQualityUnknown,
  setPainScore,
  showsPainScale,
  skipChiefComplaintQuality,
  toggleQuality,
} from "./chief-complaint-quality.js";

function atQuality(complaintIds: string[], bodyRegion?: string) {
  let state = beginInterview(
    setSceneType(
      setInformant(setSecondLanguage(createCase(), "en"), "self"),
      "non_trauma",
    ),
  );
  for (const id of complaintIds) {
    state = toggleComplaintType(state, id);
  }
  if (bodyRegion) {
    state = toggleBodyRegion(state, bodyRegion);
  }
  return completeChiefComplaint1(state);
}

describe("chief complaint quality + duration", () => {
  it("records quality then duration; EMT refine is optional", () => {
    let state = atQuality(["pain"], "chest");
    expect(showsPainScale(state)).toBe(true);

    state = toggleQuality(state, "crushing");
    expect(canCompleteChiefComplaintQuality(state)).toBe(true);
    state = completeChiefComplaintQuality(state);
    expect(state.currentStep).toBe("chief_complaint_duration");

    state = selectTimeBucket(state, "about_20_min");
    expect(getChiefComplaintDurationDetail(state).timeMode).toBe("duration");
    expect(canCompleteChiefComplaintDuration(state)).toBe(true);

    state = setTimeRefine(state, "約 14:10 開始");
    state = completeChiefComplaintDuration(state);

    expect(state.currentStep).toBe("before");
    state = atQuality(["pain"], "chest");
    state = toggleQuality(state, "crushing");
    state = setPainScore(state, 7);
    state = completeChiefComplaintQuality(state);
    state = selectTimeBucket(state, "about_20_min");
    state = setTimeRefine(state, "約 14:10 開始");
    state = completeChiefComplaintDuration(state);
    const quality = getChiefComplaintQualityDetail(state);
    const duration = getChiefComplaintDurationDetail(state);
    expect(quality.qualityIds).toEqual(["crushing"]);
    expect(duration.timeBucketId).toBe("about_20_min");
    expect(duration.timeRefine).toBe("約 14:10 開始");
    expect(quality.painScore).toBe(7);
  });

  it("supports period time buckets on duration step", () => {
    let state = atQuality(["pain"], "abdomen");
    state = toggleQuality(state, "same_as_complaint");
    state = completeChiefComplaintQuality(state);
    state = selectTimeBucket(state, "yesterday");
    expect(getChiefComplaintDurationDetail(state).timeMode).toBe("period");
    expect(canCompleteChiefComplaintDuration(state)).toBe(true);
  });

  it("allows quality next with quality or pain, then asks duration", () => {
    let state = atQuality(["pain"], "chest");
    state = setPainScore(state, 4);
    expect(canCompleteChiefComplaintQuality(state)).toBe(true);
    state = completeChiefComplaintQuality(state);
    expect(state.currentStep).toBe("chief_complaint_duration");
  });

  it("accepts numeric duration with unit and shows bilingual approx text", () => {
    let state = atQuality(["weakness"]);
    state = toggleQuality(state, "numb");
    state = completeChiefComplaintQuality(state);
    state = setTimeAmount(state, "30");
    state = setTimeUnit(state, "minutes");
    const detail = getChiefComplaintDurationDetail(state);
    expect(detail.timeAmount).toBe(30);
    expect(detail.timeUnit).toBe("minutes");
    expect(detail.timeBucketId).toBeNull();
    expect(canCompleteChiefComplaintDuration(state)).toBe(true);
    expect(formatApproxDuration(30, "minutes", "zh")).toBe("約 30 分鐘");
    expect(formatApproxDuration(30, "minutes", "ja")).toBe("約30分");
    expect(formatApproxDuration(2, "hours", "en")).toBe("About 2 hours");

    state = selectTimeBucket(state, "today");
    expect(getChiefComplaintDurationDetail(state).timeAmount).toBeNull();
    expect(getChiefComplaintDurationDetail(state).timeBucketId).toBe("today");
  });

  it("hides pain scale for non-pain complaints and ignores score attempts", () => {
    let state = atQuality(["weakness"]);
    expect(showsPainScale(state)).toBe(false);

    state = setPainScore(state, 8);
    expect(getChiefComplaintQualityDetail(state).painScore).toBeNull();

    state = toggleQuality(state, "numb");
    state = completeChiefComplaintQuality(state);
    state = selectTimeBucket(state, "few_hours");
    state = completeChiefComplaintDuration(state);
    expect(state.currentStep).toBe("before");
    expect(getChiefComplaintQualityDetail(state).painScore).toBeNull();
  });

  it("marks unknown / skipped on each sub-step and can advance", () => {
    let unknown = markChiefComplaintQualityUnknown(atQuality(["dizziness"]));
    expect(unknown.answers.chief_complaint_quality?.status).toBe("unknown");
    unknown = completeChiefComplaintQuality(unknown);
    expect(unknown.currentStep).toBe("chief_complaint_duration");
    unknown = markChiefComplaintDurationUnknown(unknown);
    unknown = completeChiefComplaintDuration(unknown);
    expect(unknown.currentStep).toBe("before");

    let skipped = skipChiefComplaintQuality(atQuality(["pain"], "head"));
    expect(skipped.answers.chief_complaint_quality?.status).toBe("skipped");
    skipped = completeChiefComplaintQuality(skipped);
    skipped = skipChiefComplaintDuration(skipped);
    skipped = completeChiefComplaintDuration(skipped);
    expect(skipped.currentStep).toBe("before");
  });

  it("treats 同哪裡不舒服 as exclusive quality completion", () => {
    let state = atQuality(["bleeding"], "left_arm");
    state = toggleQuality(state, "sharp");
    state = toggleQuality(state, "same_as_complaint");
    expect(getChiefComplaintQualityDetail(state).qualityIds).toEqual([
      "same_as_complaint",
    ]);
    expect(canCompleteChiefComplaintQuality(state)).toBe(true);
  });
});
