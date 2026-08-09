import { describe, expect, it } from "vitest";
import {
  formatMetersWithImperial,
  metersToImperial,
} from "./trauma-primary.js";

describe("trauma fall height conversion", () => {
  it("converts meters to feet and inches", () => {
    expect(metersToImperial(1)).toEqual({ feet: 3, inches: 3 });
    expect(formatMetersWithImperial(2, "zh")).toContain("2");
    expect(formatMetersWithImperial(2, "zh")).toContain("英尺");
    expect(formatMetersWithImperial(2, "en")).toContain("ft");
  });
});
