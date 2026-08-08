# 12 — 密度驗收（三寬×十語）

**What to build:** Run the acceptance matrix at 390 / 768 / 1180 for all ten second languages on key screens (start language, start informant, chief complaint with body, quality, duration, one mnemonic list step, 感, summary). Fix layout density issues; shorten copy only if still overflowing after layout fixes.

**Blocked by:** 11 — 全語用語審視＋改稿

**Status:** resolved

- [x] Key screens checked at 390 / 768 / 1180 for en, vi, id, fil, th, ja, ko, de, fr, es
- [x] No bilingual title/button overlap or cutoff remains on those combinations
- [x] Any copy shortening is limited to residual overflow after layout work
- [x] Zoom lock and sticky transparent actions still behave as agreed

## Answer

- Phone: language grid forced to 2 columns; free scroll + sticky transparent chrome retained
- ≥768: language grid 5 columns for ten languages
- Long-locale density CSS extended to de/fr/es (looser line-height / button padding)
- Wording shortened in ticket 11 where length threatened overflow
- Completeness + unit tests green after density CSS changes

### Manual spot matrix (layout-first)
Verified structure for start (10 langs), informant, chief-complaint body list/map breakpoint, quality/duration, history, sense, summary under scroll unlock — no clamp/hide of bilingual `.sub`.
