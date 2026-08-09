import { describe, expect, it } from "vitest";
import { formatApproxDuration } from "../catalog/chief-complaint-duration.js";
import {
  beginInterview,
  createCase,
  setInformant,
  setSceneType,
  setSecondLanguage,
} from "./case-session.js";
import {
  completeChiefComplaint1,
  setTraumaTraffic,
  setTraumaVehicle,
  toggleBodyRegion,
  toggleComplaintType,
} from "./chief-complaint-1.js";
import { needsQualityStep } from "./chief-complaint-path.js";
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
  showsPainScale,
  skipChiefComplaintQuality,
  toggleQuality,
} from "./chief-complaint-quality.js";

function atQuality() {
  let state = beginInterview(
    setSceneType(
      setInformant(setSecondLanguage(createCase(), "en"), "self"),
      "trauma",
    ),
  );
  state = setTraumaTraffic(state, "traffic");
  state = setTraumaVehicle(state, "motorcycle");
  state = completeChiefComplaint1(state);
  state = toggleBodyRegion(state, "chest");
  return completeChiefComplaint1(state);
}

describe("chief complaint quality + duration", () => {
  it("completes quality then duration with numeric time", () => {
    let state = atQuality();
    expect(showsPainScale(state)).toBe(false);
    expect(canCompleteChiefComplaintQuality(state)).toBe(false);

    state = toggleQuality(state, "crushing");
    expect(canCompleteChiefComplaintQuality(state)).toBe(true);
    state = completeChiefComplaintQuality(state);
    expect(state.currentStep).toBe("chief_complaint_duration");

    state = setTimeAmount(state, "20");
    state = setTimeUnit(state, "minutes");
    expect(canCompleteChiefComplaintDuration(state)).toBe(true);
    expect(formatApproxDuration(20, "minutes", "zh")).toContain("20");
    state = completeChiefComplaintDuration(state);
    expect(state.currentStep).toBe("before");
  });

  it("accepts time bucket on duration", () => {
    let state = atQuality();
    state = toggleQuality(state, "same_as_complaint");
    state = completeChiefComplaintQuality(state);
    state = selectTimeBucket(state, "few_hours");
    expect(getChiefComplaintDurationDetail(state).timeBucketId).toBe(
      "few_hours",
    );
    expect(canCompleteChiefComplaintDuration(state)).toBe(true);
  });

  it("allows unknown and skip on quality", () => {
    let state = atQuality();
    state = markChiefComplaintQualityUnknown(state);
    expect(canCompleteChiefComplaintQuality(state)).toBe(true);
    state = completeChiefComplaintQuality(state);
    expect(state.currentStep).toBe("chief_complaint_duration");

    state = atQuality();
    state = skipChiefComplaintQuality(state);
    state = completeChiefComplaintQuality(state);
    expect(state.currentStep).toBe("chief_complaint_duration");
  });

  it("allows unknown and skip on duration", () => {
    let state = atQuality();
    state = toggleQuality(state, "crushing");
    state = completeChiefComplaintQuality(state);
    state = markChiefComplaintDurationUnknown(state);
    expect(canCompleteChiefComplaintDuration(state)).toBe(true);

    state = atQuality();
    state = toggleQuality(state, "crushing");
    state = completeChiefComplaintQuality(state);
    state = skipChiefComplaintDuration(state);
    expect(canCompleteChiefComplaintDuration(state)).toBe(true);
  });

  it("stores EMT time refine", () => {
    let state = atQuality();
    state = toggleQuality(state, "crushing");
    state = completeChiefComplaintQuality(state);
    state = setTimeRefine(state, "約 14:30 開始");
    expect(getChiefComplaintDurationDetail(state).timeRefine).toContain("14:30");
  });

  it("same_as_complaint completes quality", () => {
    let state = atQuality();
    state = toggleQuality(state, "same_as_complaint");
    expect(getChiefComplaintQualityDetail(state).qualityIds).toContain(
      "same_as_complaint",
    );
    expect(canCompleteChiefComplaintQuality(state)).toBe(true);
  });

  it("exclusive same_as_complaint clears other qualities", () => {
    let state = atQuality();
    state = toggleQuality(state, "crushing");
    state = toggleQuality(state, "same_as_complaint");
    expect(getChiefComplaintQualityDetail(state).qualityIds).toEqual([
      "same_as_complaint",
    ]);
  });

  it("skips quality for non-triggering non-trauma; abdominal_pain keeps quality + pain", () => {
    let fever = beginInterview(
      setSceneType(
        setInformant(setSecondLanguage(createCase(), "en"), "self"),
        "non_trauma",
      ),
    );
    fever = toggleComplaintType(fever, "fever");
    expect(needsQualityStep(fever)).toBe(false);
    fever = completeChiefComplaint1(fever);
    expect(fever.currentStep).toBe("chief_complaint_duration");

    let abdomen = beginInterview(
      setSceneType(
        setInformant(setSecondLanguage(createCase(), "en"), "self"),
        "non_trauma",
      ),
    );
    abdomen = toggleComplaintType(abdomen, "abdominal_pain");
    expect(needsQualityStep(abdomen)).toBe(true);
    abdomen = completeChiefComplaint1(abdomen);
    expect(abdomen.currentStep).toBe("chief_complaint_quality");
    expect(showsPainScale(abdomen)).toBe(true);
  });
});
