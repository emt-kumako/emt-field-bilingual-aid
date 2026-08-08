# 01 — 依 spec 驗收並提交 casesession-deepening

**What to build:** Confirm the working tree matches `.scratch/casesession-deepening/spec.md` (CaseSession seam, quality／duration split, Option／Body selection, bilingual presentation, summary second-primary display with Chinese-only copy), then commit the landing change set.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Automated tests and typecheck pass
- [x] Spec primary seam behaviours covered (apply／viewFacts, soft gate, Start phase)
- [x] Summary display bilingual + copy Chinese verified by tests
- [x] Changes committed on the current branch

## Answer

- Vitest: 42 passed; `tsc --noEmit` clean.
- Re-ran session／summary／bilingual suites for seam spot-check.
- Spec supersedes prior UX-pass “summary Chinese-primary on screen”; copy remains Chinese.
