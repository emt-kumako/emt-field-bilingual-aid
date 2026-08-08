import {
  bilingualPair,
  type BilingualText,
} from "../catalog/labels.js";
import type { SecondLanguage } from "../case-session/types.js";

/** Which line leads in a bilingual pair. */
export type BilingualPrimacy = "second" | "chinese";

export type OrderedPair = {
  primary: string;
  secondary: string;
};

/** Reorder a zh/other pair for display. */
export function orderPair(
  pair: { zh: string; other: string },
  primacy: BilingualPrimacy,
): OrderedPair {
  if (primacy === "chinese") {
    return { primary: pair.zh, secondary: pair.other };
  }
  return { primary: pair.other, secondary: pair.zh };
}

function resolved(
  text: BilingualText,
  lang: SecondLanguage,
  primacy: BilingualPrimacy,
): OrderedPair {
  return orderPair(bilingualPair(text, lang), primacy);
}

/** Option / hotspot label: primary on `.zh`, secondary on `.sub`. */
export function bilingualButtonHtml(
  text: BilingualText,
  lang: SecondLanguage,
  primacy: BilingualPrimacy = "second",
): string {
  const { primary, secondary } = resolved(text, lang, primacy);
  return `<span class="zh">${primary}</span><span class="sub">${secondary}</span>`;
}

/** Step title + lead under it. */
export function bilingualHeadingParts(
  text: BilingualText,
  lang: SecondLanguage,
  primacy: BilingualPrimacy = "second",
): { title: string; lead: string } {
  const { primary, secondary } = resolved(text, lang, primacy);
  return { title: primary, lead: secondary };
}

/** Compact “primary · secondary” section title. */
export function bilingualSectionTitle(
  text: BilingualText,
  lang: SecondLanguage,
  primacy: BilingualPrimacy = "second",
): string {
  const { primary, secondary } = resolved(text, lang, primacy);
  return `${primary} · ${secondary}`;
}

/** Same ordering as section title, for ad-hoc inline pairs. */
export function bilingualInline(
  text: BilingualText,
  lang: SecondLanguage,
  primacy: BilingualPrimacy = "second",
): OrderedPair {
  return resolved(text, lang, primacy);
}
