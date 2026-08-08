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
import {
  canCompleteChiefComplaint2,
  completeChiefComplaint2,
  getChiefComplaint2Detail,
  markChiefComplaint2Unknown,
  selectTimeBucket,
  setPainScore,
  setTimeRefine,
  showsPainScale,
  skipChiefComplaint2,
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

describe("chief complaint step 2", () => {
  it("records quality and duration time; EMT refine is optional", () => {
    let state = atStep2(["pain"], "chest");
    expect(showsPainScale(state)).toBe(true);

    state = toggleQuality(state, "crushing");
    expect(canCompleteChiefComplaint2(state)).toBe(false);

    state = selectTimeBucket(state, "about_20_min");
    expect(getChiefComplaint2Detail(state).timeMode).toBe("duration");
    expect(canCompleteChiefComplaint2(state)).toBe(true);

    state = setTimeRefine(state, "約 14:10 開始");
    state = setPainScore(state, 7);
    state = completeChiefComplaint2(state);

    expect(state.currentStep).toBe("before");
    const detail = getChiefComplaint2Detail(state);
    expect(detail.qualityIds).toEqual(["crushing"]);
    expect(detail.timeBucketId).toBe("about_20_min");
    expect(detail.timeRefine).toBe("約 14:10 開始");
    expect(detail.painScore).toBe(7);
  });

  it("supports period time buckets", () => {
    let state = atStep2(["pain"], "abdomen");
    state = selectTimeBucket(state, "yesterday");
    expect(getChiefComplaint2Detail(state).timeMode).toBe("period");
    expect(canCompleteChiefComplaint2(state)).toBe(true);
  });

  it("hides pain scale for non-pain complaints and ignores score attempts", () => {
    let state = atStep2(["weakness"]);
    expect(showsPainScale(state)).toBe(false);

    state = setPainScore(state, 8);
    expect(getChiefComplaint2Detail(state).painScore).toBeNull();

    state = selectTimeBucket(state, "few_hours");
    state = toggleQuality(state, "numb");
    state = completeChiefComplaint2(state);
    expect(state.currentStep).toBe("before");
    expect(getChiefComplaint2Detail(state).painScore).toBeNull();
  });

  it("marks unknown / skipped and can advance", () => {
    let unknown = markChiefComplaint2Unknown(atStep2(["dizziness"]));
    expect(unknown.answers.chief_complaint_2?.status).toBe("unknown");
    unknown = completeChiefComplaint2(unknown);
    expect(unknown.currentStep).toBe("before");

    let skipped = skipChiefComplaint2(atStep2(["pain"], "head"));
    expect(skipped.answers.chief_complaint_2?.status).toBe("skipped");
    skipped = completeChiefComplaint2(skipped);
    expect(skipped.currentStep).toBe("before");
  });
});
