# 08 — 十語型別／completeness 骨架

**What to build:** Expand the second-language model to include German, French, and Spanish (`de` / `fr` / `es`) so locale completeness requires all ten second languages. The language picker can list the new languages in the agreed order; missing catalog strings must fail loudly rather than silently fall back.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Second-language type/union includes `de`, `fr`, and `es` with the existing seven
- [x] Locale completeness (or equivalent) fails when any of the ten second languages is missing for catalog/UI strings
- [x] Language picker can present the ten languages in order: en, vi, id, fil, th, ja, ko, de, fr, es
- [x] No silent English (or other) fallback for missing de/fr/es strings

## Answer

- Expanded `SecondLanguage` + `SECOND_LANGUAGES` (order en, vi, id, fil, th, ja, ko, de, fr, es)
- Injected de/fr/es keys into all `L()` packs (temporary en copies pending ticket 09)
- Picker options + flags wired; completeness/tests green

