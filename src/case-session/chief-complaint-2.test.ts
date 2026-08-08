import { describe, expect, it } from "vitest";
import {
  beginInterview,
  createCase,
  setInformant,
  setSecondLanguage,
} from "./case-session.js";
import {
  completeChiefComplaint1,
  toggleBodyRegion,
  toggleComplaintType,
} from "./chief-complaint-1.js";
import { formatApproxDuration } from "../catalog/chief-complaint-2.js";
import {
  canCompleteChiefComplaint2,
  canCompleteChiefComplaintDuration,
  completeChiefComplaint2,
  completeChiefComplaintDuration,
  getChiefComplaint2Detail,
  markChiefComplaint2Unknown,
  markChiefComplaintDurationUnknown,
  selectTimeBucket,
  setPainScore,
  setTimeAmount,
  setTimeRefine,
  setTimeUnit,
  showsPainScale,
  skipChiefComplaint2,
  skipChiefComplaintDuration,
  toggleQuality,
} from "./chief-complaint-2.js";

function atStep2(complaintIds: string[], bodyRegion?: string) {
  let state = beginInterview(
    setInformant(setSecondLanguage(createCase(), "en"), "self"),
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
    let state = atStep2(["pain"], "chest");
    expect(showsPainScale(state)).toBe(true);

    state = toggleQuality(state, "crushing");
    expect(canCompleteChiefComplaint2(state)).toBe(true);
    state = completeChiefComplaint2(state);
    expect(state.currentStep).toBe("chief_complaint_duration");

    state = selectTimeBucket(state, "about_20_min");
    expect(getChiefComplaint2Detail(state).timeMode).toBe("duration");
    expect(canCompleteChiefComplaintDuration(state)).toBe(true);

    state = setTimeRefine(state, "約 14:10 開始");
    state = completeChiefComplaintDuration(state);

    expect(state.currentStep).toBe("before");
    // pain score set on quality step
    state = atStep2(["pain"], "chest");
    state = toggleQuality(state, "crushing");
    state = setPainScore(state, 7);
    state = completeChiefComplaint2(state);
    state = selectTimeBucket(state, "about_20_min");
    state = setTimeRefine(state, "約 14:10 開始");
    state = completeChiefComplaintDuration(state);
    const detail = getChiefComplaint2Detail(state);
    expect(detail.qualityIds).toEqual(["crushing"]);
    expect(detail.timeBucketId).toBe("about_20_min");
    expect(detail.timeRefine).toBe("約 14:10 開始");
    expect(detail.painScore).toBe(7);
  });

  it("supports period time buckets on duration step", () => {
    let state = atStep2(["pain"], "abdomen");
    state = toggleQuality(state, "same_as_complaint");
    state = completeChiefComplaint2(state);
    state = selectTimeBucket(state, "yesterday");
    expect(getChiefComplaint2Detail(state).timeMode).toBe("period");
    expect(canCompleteChiefComplaintDuration(state)).toBe(true);
  });

  it("allows quality next with quality or pain, then asks duration", () => {
    let state = atStep2(["pain"], "chest");
    state = setPainScore(state, 4);
    expect(canCompleteChiefComplaint2(state)).toBe(true);
    state = completeChiefComplaint2(state);
    expect(state.currentStep).toBe("chief_complaint_duration");
  });

  it("accepts numeric duration with unit and shows bilingual approx text", () => {
    let state = atStep2(["weakness"]);
    state = toggleQuality(state, "numb");
    state = completeChiefComplaint2(state);
    state = setTimeAmount(state, "30");
    state = setTimeUnit(state, "minutes");
    const detail = getChiefComplaint2Detail(state);
    expect(detail.timeAmount).toBe(30);
    expect(detail.timeUnit).toBe("minutes");
    expect(detail.timeBucketId).toBeNull();
    expect(canCompleteChiefComplaintDuration(state)).toBe(true);
    expect(formatApproxDuration(30, "minutes", "zh")).toBe("約 30 分鐘");
    expect(formatApproxDuration(30, "minutes", "ja")).toBe("約30分");
    expect(formatApproxDuration(2, "hours", "en")).toBe("About 2 hours");

    state = selectTimeBucket(state, "today");
    expect(getChiefComplaint2Detail(state).timeAmount).toBeNull();
    expect(getChiefComplaint2Detail(state).timeBucketId).toBe("today");
  });

  it("hides pain scale for non-pain complaints and ignores score attempts", () => {
    let state = atStep2(["weakness"]);
    expect(showsPainScale(state)).toBe(false);

    state = setPainScore(state, 8);
    expect(getChiefComplaint2Detail(state).painScore).toBeNull();

    state = toggleQuality(state, "numb");
    state = completeChiefComplaint2(state);
    state = selectTimeBucket(state, "few_hours");
    state = completeChiefComplaintDuration(state);
    expect(state.currentStep).toBe("before");
    expect(getChiefComplaint2Detail(state).painScore).toBeNull();
  });

  it("marks unknown / skipped on each sub-step and can advance", () => {
    let unknown = markChiefComplaint2Unknown(atStep2(["dizziness"]));
    expect(unknown.answers.chief_complaint_2?.status).toBe("unknown");
    unknown = completeChiefComplaint2(unknown);
    expect(unknown.currentStep).toBe("chief_complaint_duration");
    unknown = markChiefComplaintDurationUnknown(unknown);
    unknown = completeChiefComplaintDuration(unknown);
    expect(unknown.currentStep).toBe("before");

    let skipped = skipChiefComplaint2(atStep2(["pain"], "head"));
    expect(skipped.answers.chief_complaint_2?.status).toBe("skipped");
    skipped = completeChiefComplaint2(skipped);
    skipped = skipChiefComplaintDuration(skipped);
    skipped = completeChiefComplaintDuration(skipped);
    expect(skipped.currentStep).toBe("before");
  });

  it("treats 同哪裡不舒服 as exclusive quality completion", () => {
    let state = atStep2(["bleeding"], "left_arm");
    state = toggleQuality(state, "sharp");
    state = toggleQuality(state, "same_as_complaint");
    expect(getChiefComplaint2Detail(state).qualityIds).toEqual([
      "same_as_complaint",
    ]);
    expect(canCompleteChiefComplaint2(state)).toBe(true);
  });
});
