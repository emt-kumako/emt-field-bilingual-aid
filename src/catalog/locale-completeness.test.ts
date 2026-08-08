import { describe, expect, it } from "vitest";
import {
  BODY_REGIONS,
  COMPLAINT_TYPES,
} from "./chief-complaint-1.js";
import { QUALITY_OPTIONS, TIME_BUCKETS } from "./chief-complaint-2.js";
import { HISTORY_BLOCK } from "./history-block.js";
import {
  MissingLocaleError,
  bilingualPair,
  type BilingualText,
} from "./labels.js";
import { ACCOMPANYING_SYMPTOMS } from "./other-symptoms.js";
import { UI_COPY } from "./ui-copy.js";

function assertComplete(text: BilingualText, path: string): void {
  for (const lang of ["zh", "en", "vi", "id"] as const) {
    expect(text[lang]?.trim().length, `${path}.${lang}`).toBeGreaterThan(0);
  }
  // Resolving vi/id must not throw or silently become English.
  expect(bilingualPair(text, "vi").other).toBe(text.vi);
  expect(bilingualPair(text, "id").other).toBe(text.id);
  expect(bilingualPair(text, "en").other).toBe(text.en);
}

describe("locale packs vi/id", () => {
  it("ships complete zh/en/vi/id for all patient-facing catalog strings", () => {
    for (const c of COMPLAINT_TYPES) {
      assertComplete(c.labels, `complaint:${c.id}`);
    }
    for (const r of BODY_REGIONS) {
      assertComplete(r.labels, `body:${r.id}`);
      for (const s of r.subregions) {
        assertComplete(s.labels, `body:${r.id}/${s.id}`);
      }
    }
    for (const q of QUALITY_OPTIONS) {
      assertComplete(q.labels, `quality:${q.id}`);
    }
    for (const t of TIME_BUCKETS) {
      assertComplete(t.labels, `time:${t.id}`);
    }
    for (const step of HISTORY_BLOCK) {
      assertComplete(step.title, `historyTitle:${step.id}`);
      for (const opt of step.options) {
        assertComplete(opt.labels, `history:${step.id}/${opt.id}`);
      }
    }
    for (const s of ACCOMPANYING_SYMPTOMS) {
      assertComplete(s.labels, `sense:${s.id}`);
    }
    for (const [key, text] of Object.entries(UI_COPY)) {
      assertComplete(text, `ui:${key}`);
    }
  });

  it("fails loudly when a second-language string is missing", () => {
    const incomplete = {
      zh: "測試",
      en: "Test",
      vi: "",
      id: "Tes",
    };
    expect(() => bilingualPair(incomplete, "vi")).toThrow(MissingLocaleError);
  });
});
