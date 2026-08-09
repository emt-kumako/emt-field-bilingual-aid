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
import type { BilingualText } from "./labels.js";

export type SecondaryReasonOption = {
  id: string;
  labels: BilingualText;
};

/** Non-trauma secondary = primary flat catalog minus OHCA. */
export const NON_TRAUMA_SECONDARY_REASONS: SecondaryReasonOption[] =
  NON_TRAUMA_PRIMARY_REASONS.filter((o) => o.id !== "ohca").map((o) => ({
    id: o.id,
    labels: o.labels,
  }));

export function secondaryReasonsForScene(
  sceneType: "trauma" | "non_trauma" | null,
): SecondaryReasonOption[] {
  if (sceneType === "trauma") return TRAUMA_SECONDARY_SENSATIONS;
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
  if (sceneType === "trauma") return getTraumaSecondary(id);
  if (sceneType === "non_trauma") {
    if (id === "ohca") return undefined;
    return getNonTraumaPrimary(id);
  }
  return undefined;
}
