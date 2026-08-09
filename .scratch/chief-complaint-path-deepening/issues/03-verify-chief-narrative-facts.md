# 03 — Verify chief narrative facts in summary

**What to build:** Confirm (and gap-fix if needed) that the summary chief-complaint block is built from ordered bilingual Chief narrative facts (`fragments` + `editStep` + `obtained`), and that summary only joins／wraps those facts into sections without re-deriving trauma／OPQRST／quality／duration path branching.

**Blocked by:** 01 — Verify Chief complaint path routing + soft gate

**Status:** resolved

- [x] Chief narrative facts expose ordered `{ zh, other }` fragments plus `editStep` and `obtained`
- [x] On-screen summary chief block reflects those fragments under existing bilingual primacy rules
- [x] Chinese-only summary copy remains complete from the Chinese sides of the fragments
- [x] Summary does not re-implement Scene type／mechanism／OPQRST／quality／duration branching
- [x] Skipped／unknown chief paths surface honest `obtained`／status behaviour
- [x] Coverage is through CaseSession summary／`viewFacts` behaviour

## Answer

Gap-fix: `buildChiefNarrativeFacts` now returns `obtained: false` when primary is unknown／skipped and no answered chief-complaint-path step remains; `formatChiefComplaint` only joins／wraps facts (removed path-branch early return). Tests assert fragment join equals summary chief value, Chinese clipboard uses zh join, and unknown／skip path is not obtained. Suite 63 green.
