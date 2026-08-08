import { describe, expect, it } from "vitest";
import { nextSelectedIds, type OptionMeta } from "./option-selection.js";

const MEDS: OptionMeta[] = [
  { id: "antihypertensive" },
  { id: "diabetes_meds" },
  { id: "none", exclusive: true },
  { id: "unknown_option", exclusive: true },
];

const HISTORY: OptionMeta[] = [
  { id: "diabetes" },
  { id: "dialysis_left", mutexGroup: "dialysis" },
  { id: "dialysis_right", mutexGroup: "dialysis" },
  { id: "mental_illness" },
];

const QUALITY: OptionMeta[] = [
  { id: "same_as_complaint", exclusive: true },
  { id: "crushing" },
  { id: "sharp" },
];

describe("option selection", () => {
  it("toggles multi-select and strips exclusives when picking a normal option", () => {
    expect(nextSelectedIds(["none"], MEDS, "antihypertensive")).toEqual([
      "antihypertensive",
    ]);
    expect(
      nextSelectedIds(["antihypertensive"], MEDS, "diabetes_meds"),
    ).toEqual(["antihypertensive", "diabetes_meds"]);
    expect(
      nextSelectedIds(
        ["antihypertensive", "diabetes_meds"],
        MEDS,
        "antihypertensive",
      ),
    ).toEqual(["diabetes_meds"]);
  });

  it("treats exclusive as single choice that clears others", () => {
    expect(
      nextSelectedIds(["antihypertensive", "diabetes_meds"], MEDS, "none"),
    ).toEqual(["none"]);
    expect(nextSelectedIds(["none"], MEDS, "none")).toEqual([]);
  });

  it("enforces mutex groups", () => {
    expect(
      nextSelectedIds(
        ["diabetes", "dialysis_left"],
        HISTORY,
        "dialysis_right",
      ),
    ).toEqual(["diabetes", "dialysis_right"]);
  });

  it("supports single-select meals", () => {
    const meals: OptionMeta[] = [
      { id: "today_breakfast" },
      { id: "yesterday_dinner" },
      { id: "unknown_option", exclusive: true },
    ];
    expect(nextSelectedIds(["today_breakfast"], meals, "yesterday_dinner", "single")).toEqual([
      "yesterday_dinner",
    ]);
    expect(
      nextSelectedIds(["yesterday_dinner"], meals, "yesterday_dinner", "single"),
    ).toEqual([]);
  });

  it("matches quality exclusive 同哪裡不舒服 behaviour", () => {
    expect(nextSelectedIds(["sharp"], QUALITY, "same_as_complaint")).toEqual([
      "same_as_complaint",
    ]);
    expect(
      nextSelectedIds(["same_as_complaint"], QUALITY, "crushing"),
    ).toEqual(["crushing"]);
  });
});
