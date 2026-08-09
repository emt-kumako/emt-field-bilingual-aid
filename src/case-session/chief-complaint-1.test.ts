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
  goBackFromChiefComplaint1,
  markChiefComplaint1Unknown,
  needsBodyLocation,
  setTraumaFallHeightMeters,
  setTraumaInjuryType,
  setTraumaTraffic,
  setTraumaVehicle,
  skipChiefComplaint1,
  toggleBodyRegion,
  toggleBodySubregion,
  toggleTraumaOhca,
} from "./chief-complaint-1.js";

function beginTrauma() {
  return beginInterview(
    setSceneType(
      setInformant(setSecondLanguage(createCase(), "en"), "self"),
      "trauma",
    ),
  );
}

describe("trauma primary mechanism → body", () => {
  it("requires traffic vehicle then body map (OHCA may stay on)", () => {
    let state = beginTrauma();
    expect(getChiefComplaint1Detail(state).traumaStage).toBe("mechanism");
    expect(canCompleteChiefComplaint1(state)).toBe(false);

    state = toggleTraumaOhca(state);
    expect(getChiefComplaint1Detail(state).traumaOhca).toBe(true);
    expect(canCompleteChiefComplaint1(state)).toBe(false);

    state = setTraumaTraffic(state, "traffic");
    expect(canCompleteChiefComplaint1(state)).toBe(false);

    state = setTraumaVehicle(state, "motorcycle");
    expect(canCompleteChiefComplaint1(state)).toBe(true);

    state = completeChiefComplaint1(state);
    expect(getChiefComplaint1Detail(state).traumaStage).toBe("body");
    expect(needsBodyLocation(state)).toBe(true);
    expect(canCompleteChiefComplaint1(state)).toBe(false);

    state = toggleBodyRegion(state, "chest");
    expect(canCompleteChiefComplaint1(state)).toBe(true);
    state = toggleBodySubregion(state, "chest_left");
    state = clearBodyDrilldown(state);
    state = completeChiefComplaint1(state);
    expect(state.currentStep).toBe("chief_complaint_quality");
    expect(getChiefComplaint1Detail(state).traumaVehicleId).toBe("motorcycle");
    expect(getChiefComplaint1Detail(state).traumaOhca).toBe(true);
  });

  it("non-traffic injury path with optional fall height", () => {
    let state = beginTrauma();
    state = setTraumaTraffic(state, "non_traffic");
    state = setTraumaInjuryType(state, "fall_from_height");
    expect(canCompleteChiefComplaint1(state)).toBe(true);

    state = setTraumaFallHeightMeters(state, "3.5");
    expect(getChiefComplaint1Detail(state).traumaFallHeightMeters).toBe(3.5);

    state = completeChiefComplaint1(state);
    expect(getChiefComplaint1Detail(state).traumaStage).toBe("body");
    state = toggleBodyRegion(state, "head");
    state = completeChiefComplaint1(state);
    expect(state.currentStep).toBe("chief_complaint_quality");
    expect(getChiefComplaint1Detail(state).traumaInjuryTypeId).toBe(
      "fall_from_height",
    );
  });

  it("backs from body to mechanism, then to start", () => {
    let state = beginTrauma();
    state = setTraumaTraffic(state, "traffic");
    state = setTraumaVehicle(state, "car");
    state = completeChiefComplaint1(state);
    expect(getChiefComplaint1Detail(state).traumaStage).toBe("body");

    state = goBackFromChiefComplaint1(state);
    expect(state.currentStep).toBe("chief_complaint_1");
    expect(getChiefComplaint1Detail(state).traumaStage).toBe("mechanism");

    state = goBackFromChiefComplaint1(state);
    expect(state.currentStep).toBe("start");
  });

  it("unknown and skip still complete the step", () => {
    let state = beginTrauma();
    state = markChiefComplaint1Unknown(state);
    expect(canCompleteChiefComplaint1(state)).toBe(true);
    state = completeChiefComplaint1(state);
    expect(state.currentStep).toBe("chief_complaint_quality");

    state = beginTrauma();
    state = skipChiefComplaint1(state);
    state = completeChiefComplaint1(state);
    expect(state.currentStep).toBe("chief_complaint_quality");
  });
});
