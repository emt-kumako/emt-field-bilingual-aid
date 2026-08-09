# 02 — Verify duration sole ownership (OPQRST T)

**What to build:** Confirm (and gap-fix if needed) that chief complaint duration is the sole owner of time pattern／amount／unit／unknown (and related duration fields): OPQRST T reads and writes that detail only, skips the shared duration step after OPQRST, and cannot diverge from a separate OPQRST-owned pattern field.

**Blocked by:** 01 — Verify Chief complaint path routing + soft gate

**Status:** ready-for-agent

- [ ] OPQRST T pattern／approx duration／unknown update chief complaint duration detail
- [ ] OPQRST detail does not keep its own `timePattern` (or equivalent dual-write)
- [ ] Completing OPQRST skips the shared duration step and enters history via the path
- [ ] Shared duration step and OPQRST T cannot disagree on the same Case’s duration facts
- [ ] Coverage is through CaseSession `apply`／`viewFacts`（and existing step suites as needed）
