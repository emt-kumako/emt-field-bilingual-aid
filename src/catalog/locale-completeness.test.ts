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
import { NON_TRAUMA_PRIMARY_REASONS } from "./non-trauma-primary.js";
import {
  TRAUMA_INJURY_OPTIONS,
  TRAUMA_OHCA_LABELS,
  TRAUMA_TRAFFIC_OPTIONS,
  TRAUMA_VEHICLE_OPTIONS,
} from "./trauma-primary.js";
import {
  OPQRST_ONSET,
  OPQRST_PROVOCATION,
  OPQRST_QUALITY,
  OPQRST_RADIATION_SITES,
  OPQRST_RADIATION_TOGGLE_LABELS,
  OPQRST_REGIONS,
  OPQRST_TIME_PATTERN,
  OPQRST_TIME_UNKNOWN_LABELS,
  PAIN_SCALE_SOURCE_NOTE,
} from "./chest-opqrst.js";
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
    for (const opt of NON_TRAUMA_PRIMARY_REASONS) {
      assertComplete(opt.labels, `nonTraumaPrimary:${opt.id}`);
    }
    assertComplete(TRAUMA_OHCA_LABELS, "trauma:ohca");
    for (const opt of TRAUMA_TRAFFIC_OPTIONS) {
      assertComplete(opt.labels, `traumaTraffic:${opt.id}`);
    }
    for (const opt of TRAUMA_VEHICLE_OPTIONS) {
      assertComplete(opt.labels, `traumaVehicle:${opt.id}`);
    }
    for (const opt of TRAUMA_INJURY_OPTIONS) {
      assertComplete(opt.labels, `traumaInjury:${opt.id}`);
    }
    for (const opt of OPQRST_ONSET) {
      assertComplete(opt.labels, `opqrstOnset:${opt.id}`);
    }
    for (const opt of OPQRST_PROVOCATION) {
      assertComplete(opt.labels, `opqrstProvocation:${opt.id}`);
    }
    for (const opt of OPQRST_QUALITY) {
      assertComplete(opt.labels, `opqrstQuality:${opt.id}`);
    }
    for (const opt of OPQRST_REGIONS) {
      assertComplete(opt.labels, `opqrstRegion:${opt.id}`);
    }
    for (const opt of OPQRST_RADIATION_SITES) {
      assertComplete(opt.labels, `opqrstRadiation:${opt.id}`);
    }
    for (const opt of OPQRST_TIME_PATTERN) {
      assertComplete(opt.labels, `opqrstTimePattern:${opt.id}`);
    }
    assertComplete(OPQRST_TIME_UNKNOWN_LABELS, "opqrst:timeUnknown");
    assertComplete(OPQRST_RADIATION_TOGGLE_LABELS, "opqrst:radiationToggle");
    assertComplete(PAIN_SCALE_SOURCE_NOTE, "opqrst:painScaleSource");
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
