/**
 * Structured chief-complaint narrative facts for summary formatting.
 */
import {
  BODY_REGIONS,
  COMPLAINT_TYPES,
} from "../catalog/chief-complaint-1.js";
import { QUALITY_OPTIONS } from "../catalog/chief-complaint-quality.js";
import {
  formatApproxDuration,
  getTimeBucket,
} from "../catalog/chief-complaint-duration.js";
import {
  OPQRST_ONSET,
  OPQRST_PROVOCATION,
  OPQRST_QUALITY,
  OPQRST_RADIATION_SITES,
  OPQRST_RADIATION_TOGGLE_LABELS,
  OPQRST_REGIONS,
  OPQRST_TIME_PATTERN,
  OPQRST_TIME_UNKNOWN_LABELS,
} from "../catalog/chest-opqrst.js";
import { type BilingualText } from "../catalog/labels.js";
import { getNonTraumaPrimary } from "../catalog/non-trauma-primary.js";
import { SUMMARY_COPY } from "../catalog/summary-copy.js";
import {
  TRAUMA_OHCA_LABELS,
  TRAUMA_TRAFFIC_OPTIONS,
  TRAUMA_VEHICLE_OPTIONS,
  formatMetersWithImperial,
  getTraumaInjury,
} from "../catalog/trauma-primary.js";
import { SCENE_TYPE_OPTIONS } from "../content/start-labels.js";
import {
  getChiefComplaint1Detail,
  getPrimaryNote,
} from "./chief-complaint-1.js";
import {
  getChestOpqrstDetail,
  isChestOpqrstPath,
} from "./chest-opqrst.js";
import { chiefComplaintEditStep } from "./chief-complaint-path.js";
import { getChiefComplaintQualityDetail } from "./chief-complaint-quality.js";
import { getChiefComplaintDurationDetail } from "./chief-complaint-duration.js";
import {
  type CaseState,
  type InterviewStep,
  type SecondLanguage,
} from "./types.js";

type Lang = "zh" | SecondLanguage;

export type ChiefNarrativeFragment = { zh: string; other: string };

export type ChiefNarrativeFacts = {
  fragments: ChiefNarrativeFragment[];
  editStep: InterviewStep;
  obtained: boolean;
};

function pick(text: BilingualText, lang: Lang): string {
  return lang === "zh" ? text.zh : text[lang];
}

function joinIds(
  ids: string[],
  lang: Lang,
  lookup: (id: string) => string | undefined,
): string {
  const sep = lang === "zh" || lang === "ja" ? "、" : ", ";
  return ids
    .map((id) => lookup(id) ?? id)
    .filter(Boolean)
    .join(sep);
}

function lookupLabeled(
  options: { id: string; labels: BilingualText }[],
  id: string | null,
  lang: Lang,
): string | undefined {
  if (!id) return undefined;
  const opt = options.find((o) => o.id === id);
  return opt ? pick(opt.labels, lang) : undefined;
}

function pair(zh: string, other: string): ChiefNarrativeFragment {
  return { zh, other };
}

function partsForLang(state: CaseState, lang: Lang): string[] {
  const aQuality = state.answers.chief_complaint_quality;
  const aDur = state.answers.chief_complaint_duration;
  const d1 = getChiefComplaint1Detail(state);
  const dq = getChiefComplaintQualityDetail(state);
  const dDur = getChiefComplaintDurationDetail(state);
  const parts: string[] = [];
  const chestPath = isChestOpqrstPath(state);

  if (state.sceneType) {
    const scene = SCENE_TYPE_OPTIONS.find((o) => o.id === state.sceneType);
    if (scene) parts.push(pick(scene.labels, lang));
  }

  if (state.sceneType === "trauma") {
    if (d1.traumaOhca) parts.push(pick(TRAUMA_OHCA_LABELS, lang));
    if (d1.traumaTraffic) {
      const traffic = TRAUMA_TRAFFIC_OPTIONS.find(
        (o) => o.id === d1.traumaTraffic,
      );
      if (traffic) parts.push(pick(traffic.labels, lang));
    }
    if (d1.traumaVehicleId) {
      const vehicle = TRAUMA_VEHICLE_OPTIONS.find(
        (o) => o.id === d1.traumaVehicleId,
      );
      if (vehicle) parts.push(pick(vehicle.labels, lang));
    }
    if (d1.traumaInjuryTypeId) {
      const injury = getTraumaInjury(d1.traumaInjuryTypeId);
      if (injury) {
        let text = pick(injury.labels, lang);
        if (injury.asksFallHeight && d1.traumaFallHeightMeters !== null) {
          text += ` ${formatMetersWithImperial(
            d1.traumaFallHeightMeters,
            lang === "zh" ? "zh" : "en",
          )}`;
        }
        parts.push(text);
      }
    }
  } else if (d1.complaintTypeIds.length) {
    parts.push(
      joinIds(d1.complaintTypeIds, lang, (id) => {
        const nonTrauma = getNonTraumaPrimary(id)?.labels;
        if (nonTrauma) return pick(nonTrauma, lang);
        const labels = COMPLAINT_TYPES.find((c) => c.id === id)?.labels;
        return labels ? pick(labels, lang) : undefined;
      }),
    );
  }

  const primaryNote = getPrimaryNote(state).trim();
  if (primaryNote) {
    parts.push(`${pick(SUMMARY_COPY.note, lang)}：${primaryNote}`);
  }

  if (d1.bodyRegionIds.length) {
    const regions = joinIds(d1.bodyRegionIds, lang, (id) => {
      const labels = BODY_REGIONS.find((r) => r.id === id)?.labels;
      return labels ? pick(labels, lang) : undefined;
    });
    const subs = d1.bodySubregionIds.length
      ? `（${joinIds(d1.bodySubregionIds, lang, (id) => {
          for (const r of BODY_REGIONS) {
            const sub = r.subregions.find((s) => s.id === id);
            if (sub) return pick(sub.labels, lang);
          }
          return undefined;
        })}）`
      : "";
    parts.push(`${pick(SUMMARY_COPY.body, lang)}：${regions}${subs}`);
  }

  const aOpqrst = state.answers.chest_opqrst;
  if (aOpqrst?.status === "unknown" || aOpqrst?.status === "skipped") {
    const st =
      aOpqrst.status === "unknown"
        ? pick(SUMMARY_COPY.notObtainedUnknown, lang)
        : pick(SUMMARY_COPY.notObtainedSkipped, lang);
    parts.push(`OPQRST：${st}`);
  } else if (aOpqrst?.status === "answered") {
    const d = getChestOpqrstDetail(state);
    const onset = lookupLabeled(OPQRST_ONSET, d.onsetId, lang);
    if (onset) parts.push(onset);
    if (d.provocationIds.length) {
      parts.push(
        joinIds(d.provocationIds, lang, (id) =>
          lookupLabeled(OPQRST_PROVOCATION, id, lang),
        ),
      );
    }
    const quality = lookupLabeled(OPQRST_QUALITY, d.qualityId, lang);
    if (quality) parts.push(quality);
    if (d.regionIds.length) {
      parts.push(
        `${pick(SUMMARY_COPY.body, lang)}：${joinIds(d.regionIds, lang, (id) =>
          lookupLabeled(OPQRST_REGIONS, id, lang),
        )}`,
      );
    }
    if (d.radiation) {
      const sites = d.radiationSiteIds.length
        ? joinIds(d.radiationSiteIds, lang, (id) =>
            lookupLabeled(OPQRST_RADIATION_SITES, id, lang),
          )
        : "";
      parts.push(
        sites
          ? `${pick(OPQRST_RADIATION_TOGGLE_LABELS, lang)}：${sites}`
          : pick(OPQRST_RADIATION_TOGGLE_LABELS, lang),
      );
    }
    if (d.severity !== null) {
      parts.push(`${pick(SUMMARY_COPY.pain, lang)}：${d.severity}/10`);
    }
    const pattern = lookupLabeled(OPQRST_TIME_PATTERN, dDur.timePattern, lang);
    if (pattern) parts.push(pattern);
  }

  if (!chestPath) {
    if (dq.qualityIds.length) {
      parts.push(
        `${pick(SUMMARY_COPY.quality, lang)}：${joinIds(
          dq.qualityIds,
          lang,
          (id) => {
            const labels = QUALITY_OPTIONS.find((q) => q.id === id)?.labels;
            return labels ? pick(labels, lang) : undefined;
          },
        )}`,
      );
    } else if (aQuality?.status === "unknown" || aQuality?.status === "skipped") {
      const st =
        aQuality.status === "unknown"
          ? pick(SUMMARY_COPY.notObtainedUnknown, lang)
          : pick(SUMMARY_COPY.notObtainedSkipped, lang);
      parts.push(`${pick(SUMMARY_COPY.quality, lang)}：${st}`);
    }
    if (dq.painScore !== null) {
      parts.push(`${pick(SUMMARY_COPY.pain, lang)}：${dq.painScore}/10`);
    }
  }

  const durationText =
    dDur.timeAmount !== null &&
    dDur.timeAmount > 0 &&
    dDur.timeUnit !== null
      ? formatApproxDuration(dDur.timeAmount, dDur.timeUnit, lang)
      : dDur.timeBucketId
        ? (() => {
            const labels = getTimeBucket(dDur.timeBucketId)?.labels;
            return labels ? pick(labels, lang) : dDur.timeBucketId;
          })()
        : dDur.timeUnknown
          ? pick(OPQRST_TIME_UNKNOWN_LABELS, lang)
          : "";
  if (durationText) {
    const refine = dDur.timeRefine.trim()
      ? `；${pick(SUMMARY_COPY.refine, lang)}：${dDur.timeRefine.trim()}`
      : "";
    parts.push(`${pick(SUMMARY_COPY.time, lang)}：${durationText}${refine}`);
  } else if (
    !chestPath &&
    (aDur?.status === "unknown" || aDur?.status === "skipped")
  ) {
    const st =
      aDur.status === "unknown"
        ? pick(SUMMARY_COPY.notObtainedUnknown, lang)
        : pick(SUMMARY_COPY.notObtainedSkipped, lang);
    parts.push(`${pick(SUMMARY_COPY.time, lang)}：${st}`);
  } else if (dDur.timeRefine.trim()) {
    parts.push(
      `${pick(SUMMARY_COPY.time, lang)}：${pick(SUMMARY_COPY.refine, lang)}：${dDur.timeRefine.trim()}`,
    );
  }

  return parts;
}

/** Ordered bilingual fragments + edit/obtained for summary. */
export function buildChiefNarrativeFacts(
  state: CaseState,
): ChiefNarrativeFacts {
  const lang = state.secondLanguage ?? "en";
  const zhParts = partsForLang(state, "zh");
  const otherParts = partsForLang(state, lang);
  const editStep = chiefComplaintEditStep(state);

  const contentBeyondScene = zhParts.filter((p, i) => {
    if (i !== 0 || !state.sceneType) return true;
    const scene = SCENE_TYPE_OPTIONS.find((o) => o.id === state.sceneType);
    return !scene || p !== scene.labels.zh;
  });

  if (contentBeyondScene.length === 0) {
    return { fragments: [], editStep, obtained: false };
  }

  const len = Math.max(zhParts.length, otherParts.length);
  const fragments: ChiefNarrativeFragment[] = [];
  for (let i = 0; i < len; i++) {
    fragments.push(pair(zhParts[i] ?? "", otherParts[i] ?? ""));
  }
  return { fragments, editStep, obtained: true };
}
