# 02 — Verify duration sole ownership (OPQRST T)

**What to build:** Confirm (and gap-fix if needed) that chief complaint duration is the sole owner of time pattern／amount／unit／unknown (and related duration fields): OPQRST T reads and writes that detail only, skips the shared duration step after OPQRST, and cannot diverge from a separate OPQRST-owned pattern field.

**Blocked by:** 01 — Verify Chief complaint path routing + soft gate

**Status:** resolved

- [x] OPQRST T pattern／approx duration／unknown update chief complaint duration detail
- [x] OPQRST detail does not keep its own `timePattern` (or equivalent dual-write)
- [x] Completing OPQRST skips the shared duration step and enters history via the path
- [x] Shared duration step and OPQRST T cannot disagree on the same Case’s duration facts
- [x] Coverage is through CaseSession `apply`／`viewFacts`（and existing step suites as needed）

## Answer

Product ownership already landed with `c5ed91a`. Added `apply`／`viewFacts` coverage asserting OPQRST detail has no T fields, ScreenFacts on OPQRST match duration detail (including 時間不詳), Next lands on `before`, and editing duration shows the same pattern／unknown. No product-code change required for 02.
