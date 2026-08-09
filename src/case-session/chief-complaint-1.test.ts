import { describe, expect, it } from "vitest";
import {
  beginInterview,
  createCase,
  setInformant,
  setSceneType,
  setSecondLanguage,
} from "./case-session.js";
import {
  canCompleteChiefComplaint1,
  clearBodyDrilldown,
  completeChiefComplaint1,
  getChiefComplaint1Detail,
  markChiefComplaint1Unknown,
  needsBodyLocation,
  skipChiefComplaint1,
  toggleBodyRegion,
  toggleBodySubregion,
  toggleComplaintType,
} from "./chief-complaint-1.js";

function started() {
  return beginInterview(
    setSceneType(
      setInformant(setSecondLanguage(createCase(), "en"), "self"),
      "trauma",
    ),
  );
}

describe("chief complaint step 1", () => {
  it("completes localized path with body region (+ optional drill-down)", () => {
    let state = started();
    state = toggleComplaintType(state, "pain");
    expect(needsBodyLocation(state)).toBe(true);
    expect(canCompleteChiefComplaint1(state)).toBe(false);

    state = toggleBodyRegion(state, "chest");
    expect(getChiefComplaint1Detail(state).drilldownRegionId).toBe("chest");
    expect(canCompleteChiefComplaint1(state)).toBe(true);

    state = toggleBodySubregion(state, "chest_left");
    state = clearBodyDrilldown(state);
    state = completeChiefComplaint1(state);

    expect(state.currentStep).toBe("chief_complaint_quality");
    expect(getChiefComplaint1Detail(state).complaintTypeIds).toEqual(["pain"]);
    expect(getChiefComplaint1Detail(state).bodyRegionIds).toEqual(["chest"]);
    expect(getChiefComplaint1Detail(state).bodySubregionIds).toEqual([
      "chest_left",
    ]);
    expect(getChiefComplaint1Detail(state).drilldownRegionId).toBeNull();
  });

  it("allows non-localized complaints without body, but body stays optional", () => {
    let state = started();
    state = toggleComplaintType(state, "breathing");
    expect(needsBodyLocation(state)).toBe(false);
    expect(canCompleteChiefComplaint1(state)).toBe(true);

    state = toggleBodyRegion(state, "chest");
    expect(getChiefComplaint1Detail(state).bodyRegionIds).toEqual(["chest"]);
    expect(canCompleteChiefComplaint1(state)).toBe(true);

    state = completeChiefComplaint1(state);
    expect(state.currentStep).toBe("chief_complaint_quality");
  });

  it("keeps optional body when switching from localized to only non-localized", () => {
    let state = started();
    state = toggleComplaintType(state, "pain");
    state = toggleBodyRegion(state, "abdomen");
    state = toggleComplaintType(state, "pain"); // deselect
    state = toggleComplaintType(state, "dizziness");

    const detail = getChiefComplaint1Detail(state);
    expect(detail.complaintTypeIds).toEqual(["dizziness"]);
    expect(detail.bodyRegionIds).toEqual(["abdomen"]);
    expect(needsBodyLocation(state)).toBe(false);
  });

  it("marks unknown / skipped as not obtained and can advance", () => {
    let unknown = markChiefComplaint1Unknown(started());
    expect(unknown.answers.chief_complaint_1?.status).toBe("unknown");
    expect(canCompleteChiefComplaint1(unknown)).toBe(true);
    unknown = completeChiefComplaint1(unknown);
    expect(unknown.currentStep).toBe("chief_complaint_quality");

    let skipped = skipChiefComplaint1(started());
    expect(skipped.answers.chief_complaint_1?.status).toBe("skipped");
    expect(canCompleteChiefComplaint1(skipped)).toBe(true);
    skipped = completeChiefComplaint1(skipped);
    expect(skipped.currentStep).toBe("chief_complaint_quality");
  });
});
