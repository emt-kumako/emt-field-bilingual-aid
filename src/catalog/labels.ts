import type { SecondLanguage } from "../case-session/types.js";

/** Chinese anchor + all MVP second languages required (no silent gaps). */
export type BilingualText = {
  zh: string;
  en: string;
  vi: string;
  id: string;
};

export function L(
  zh: string,
  en: string,
  vi: string,
  id: string,
): BilingualText {
  return { zh, en, vi, id };
}

export class MissingLocaleError extends Error {
  readonly language: SecondLanguage;
  readonly sourceZh: string;

  constructor(language: SecondLanguage, sourceZh: string) {
    super(`Missing ${language} catalog string for: ${sourceZh}`);
    this.name = "MissingLocaleError";
    this.language = language;
    this.sourceZh = sourceZh;
  }
}

/**
 * Chinese + selected second language.
 * Strategy: no silent English fallback for vi/id — missing strings throw.
 */
export function bilingualPair(
  text: BilingualText,
  second: SecondLanguage,
): { zh: string; other: string } {
  const other = text[second];
  if (!other || !other.trim()) {
    throw new MissingLocaleError(second, text.zh);
  }
  return { zh: text.zh, other };
}
