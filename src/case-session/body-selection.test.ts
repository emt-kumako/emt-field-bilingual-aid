import { describe, expect, it } from "vitest";
import {
  clearDrilldown,
  toggleRegion,
  toggleSubregion,
  type BodySelection,
} from "./body-selection.js";

const empty: BodySelection = {
  bodyRegionIds: [],
  bodySubregionIds: [],
  drilldownRegionId: null,
};

describe("body selection", () => {
  it("selects a region and opens drilldown when subregions exist", () => {
    const next = toggleRegion(empty, "chest");
    expect(next).toEqual({
      bodyRegionIds: ["chest"],
      bodySubregionIds: [],
      drilldownRegionId: "chest",
    });
  });

  it("deselects a region and drops its subregions", () => {
    const withSubs: BodySelection = {
      bodyRegionIds: ["chest", "abdomen"],
      bodySubregionIds: ["chest_left", "abdomen_upper"],
      drilldownRegionId: "chest",
    };
    expect(toggleRegion(withSubs, "chest")).toEqual({
      bodyRegionIds: ["abdomen"],
      bodySubregionIds: ["abdomen_upper"],
      drilldownRegionId: null,
    });
  });

  it("toggles subregions and clears drilldown", () => {
    let sel = toggleRegion(empty, "chest")!;
    sel = toggleSubregion(sel, "chest_left");
    expect(sel.bodySubregionIds).toEqual(["chest_left"]);
    sel = toggleSubregion(sel, "chest_left");
    expect(sel.bodySubregionIds).toEqual([]);
    sel = clearDrilldown(sel);
    expect(sel.drilldownRegionId).toBeNull();
  });

  it("returns null for unknown region ids", () => {
    expect(toggleRegion(empty, "not_a_region")).toBeNull();
  });
});
