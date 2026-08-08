import type { SecondLanguage } from "../case-session/types.js";

export const SECOND_LANGUAGES = [
  "en",
  "vi",
  "id",
  "fil",
  "th",
  "ja",
  "ko",
  "de",
  "fr",
  "es",
] as const satisfies readonly SecondLanguage[];

/** Chinese anchor + every selectable second language (no silent gaps). */
export type BilingualText = { zh: string } & Record<SecondLanguage, string>;

export type LocalePack = Record<SecondLanguage, string>;

export function L(zh: string, pack: LocalePack): BilingualText {
  return { zh, ...pack };
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
 * Strategy: no silent English fallback — missing strings throw.
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
