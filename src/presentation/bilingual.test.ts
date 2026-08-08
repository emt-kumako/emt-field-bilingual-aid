import { describe, expect, it } from "vitest";
import { L } from "../catalog/labels.js";
import {
  bilingualButtonHtml,
  bilingualHeadingParts,
  bilingualInline,
  bilingualSectionTitle,
  orderPair,
} from "./bilingual.js";

const sample = L("疼痛", {
  en: "Pain",
  vi: "Đau",
  id: "Nyeri",
  fil: "Sakit",
  th: "ปวด",
  ja: "痛み",
  ko: "통증",
  de: "Schmerz",
  fr: "Douleur",
  es: "Dolor",
});

describe("bilingual presentation", () => {
  it("orders second-language primary by default", () => {
    expect(orderPair({ zh: "疼痛", other: "Pain" }, "second")).toEqual({
      primary: "Pain",
      secondary: "疼痛",
    });
    expect(bilingualButtonHtml(sample, "en")).toBe(
      `<span class="zh">Pain</span><span class="sub">疼痛</span>`,
    );
    expect(bilingualHeadingParts(sample, "en")).toEqual({
      title: "Pain",
      lead: "疼痛",
    });
    expect(bilingualSectionTitle(sample, "en")).toBe("Pain · 疼痛");
  });

  it("supports chinese primacy when callers request it", () => {
    expect(orderPair({ zh: "疼痛", other: "Pain" }, "chinese")).toEqual({
      primary: "疼痛",
      secondary: "Pain",
    });
    expect(bilingualInline(sample, "en", "chinese")).toEqual({
      primary: "疼痛",
      secondary: "Pain",
    });
    expect(bilingualSectionTitle(sample, "en", "chinese")).toBe("疼痛 · Pain");
  });
});
