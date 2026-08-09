import {
  NON_TRAUMA_PRIMARY_REASONS,
  getNonTraumaPrimary,
  type NonTraumaPrimaryOption,
} from "./non-trauma-primary.js";
import {
  TRAUMA_SECONDARY_SENSATIONS,
  getTraumaSecondary,
  type TraumaSecondaryOption,
} from "./trauma-secondary.js";
import { L, type BilingualText } from "./labels.js";

export type SecondaryReasonOption = {
  id: string;
  labels: BilingualText;
  /** Exclusive choice (e.g. 無) clears other secondary picks. */
  exclusive?: boolean;
};

/** Shared「無」for secondary reason — exclusive of other sensations. */
export const SECONDARY_NONE: SecondaryReasonOption = {
  id: "none",
  exclusive: true,
  labels: L("無", {
    en: "None",
    vi: "Không",
    id: "Tidak ada",
    ja: "なし",
    ko: "없음",
    fil: "Wala",
    th: "ไม่มี",
    de: "Keine",
    fr: "Aucun",
    es: "Ninguno",
  }),
};

/** Non-trauma secondary =「無」+ primary flat catalog minus OHCA. */
export const NON_TRAUMA_SECONDARY_REASONS: SecondaryReasonOption[] = [
  SECONDARY_NONE,
  ...NON_TRAUMA_PRIMARY_REASONS.filter((o) => o.id !== "ohca").map((o) => ({
    id: o.id,
    labels: o.labels,
  })),
];

/** Trauma secondary =「無」+ short sensation list. */
export const TRAUMA_SECONDARY_REASONS: SecondaryReasonOption[] = [
  SECONDARY_NONE,
  ...TRAUMA_SECONDARY_SENSATIONS.map((o) => ({
    id: o.id,
    labels: o.labels,
  })),
];

export function secondaryReasonsForScene(
  sceneType: "trauma" | "non_trauma" | null,
): SecondaryReasonOption[] {
  if (sceneType === "trauma") return TRAUMA_SECONDARY_REASONS;
  if (sceneType === "non_trauma") return NON_TRAUMA_SECONDARY_REASONS;
  return [];
}

export function getSecondaryReason(
  sceneType: "trauma" | "non_trauma" | null,
  id: string,
):
  | SecondaryReasonOption
  | NonTraumaPrimaryOption
  | TraumaSecondaryOption
  | undefined {
  if (id === "none") return SECONDARY_NONE;
  if (sceneType === "trauma") return getTraumaSecondary(id);
  if (sceneType === "non_trauma") {
    if (id === "ohca") return undefined;
    return getNonTraumaPrimary(id);
  }
  return undefined;
}
