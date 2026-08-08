# 08 — 越／印尼語言包接上同一 UI

**What to build:** Wire Vietnamese and Indonesian as selectable second languages through the same screens and CaseSession flow already used for English — same-screen bilingual pointing works without changing interview logic.

**Blocked by:** 06 — 感＋本機摘要＋複製＋結束清除

**Status:** resolved

- [x] Selecting Vietnamese shows zh+vi on patient-facing option screens for the full mnemonic path
- [x] Selecting Indonesian shows zh+id on patient-facing option screens for the full mnemonic path
- [x] Missing strings fail loudly in development/tests rather than silently falling back in a misleading way (strategy documented if any fallback exists)
- [x] CaseSession language switching does not require flow changes
- [x] Tests or catalog checks cover presence of vi/id strings for shipped steps

## Answer

- All catalogs + UI copy require `zh/en/vi/id` via `BilingualText` / `L()`
- `bilingualPair`: **no silent EN fallback** — empty/missing throws `MissingLocaleError`
- Coverage test: `src/catalog/locale-completeness.test.ts`
- CaseSession unchanged; only presentation resolves the selected second language
