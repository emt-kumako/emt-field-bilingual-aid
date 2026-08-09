import { describe, expect, it } from "vitest";
import {
  BODY_REGIONS,
  COMPLAINT_TYPES,
} from "./chief-complaint-1.js";
import { QUALITY_OPTIONS } from "./chief-complaint-quality.js";
import { TIME_BUCKETS, TIME_UNITS } from "./chief-complaint-duration.js";
import { HISTORY_BLOCK } from "./history-block.js";
import {
  MissingLocaleError,
  SECOND_LANGUAGES,
  bilingualPair,
  type BilingualText,
} from "./labels.js";
import { ACCOMPANYING_SYMPTOMS } from "./other-symptoms.js";
import { SUMMARY_COPY } from "./summary-copy.js";
import { UI_COPY } from "./ui-copy.js";
import {
  INFORMANT_OPTIONS,
  SCENE_TYPE_OPTIONS,
} from "../content/start-labels.js";

function assertComplete(text: BilingualText, path: string): void {
  expect(text.zh.trim().length, `${path}.zh`).toBeGreaterThan(0);
  for (const lang of SECOND_LANGUAGES) {
    expect(text[lang]?.trim().length, `${path}.${lang}`).toBeGreaterThan(0);
    expect(bilingualPair(text, lang).other).toBe(text[lang]);
  }
}

describe("locale packs", () => {
  it("ships complete zh + all second languages for patient-facing strings", () => {
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
    for (const u of TIME_UNITS) {
      assertComplete(u.labels, `timeUnit:${u.id}`);
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
    for (const [key, text] of Object.entries(SUMMARY_COPY)) {
      assertComplete(text, `summary:${key}`);
    }
    for (const opt of INFORMANT_OPTIONS) {
      assertComplete(opt.labels, `informant:${opt.id}`);
    }
    for (const opt of SCENE_TYPE_OPTIONS) {
      assertComplete(opt.labels, `sceneType:${opt.id}`);
    }
  });

  it("fails loudly when a second-language string is missing", () => {
    const incomplete: BilingualText = {
      zh: "測試",
      en: "Test",
      vi: "",
      id: "Tes",
      fil: "Test",
      th: "ทดสอบ",
      ja: "テスト",
      ko: "테스트",
      de: "Test",
      fr: "Test",
      es: "Prueba",
    };
    expect(() => bilingualPair(incomplete, "vi")).toThrow(MissingLocaleError);
  });
});
