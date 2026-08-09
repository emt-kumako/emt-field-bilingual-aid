# 03 — Verify chief narrative facts in summary

**What to build:** Confirm (and gap-fix if needed) that the summary chief-complaint block is built from ordered bilingual Chief narrative facts (`fragments` + `editStep` + `obtained`), and that summary only joins／wraps those facts into sections without re-deriving trauma／OPQRST／quality／duration path branching.

**Blocked by:** 01 — Verify Chief complaint path routing + soft gate

**Status:** ready-for-agent

- [ ] Chief narrative facts expose ordered `{ zh, other }` fragments plus `editStep` and `obtained`
- [ ] On-screen summary chief block reflects those fragments under existing bilingual primacy rules
- [ ] Chinese-only summary copy remains complete from the Chinese sides of the fragments
- [ ] Summary does not re-implement Scene type／mechanism／OPQRST／quality／duration branching
- [ ] Skipped／unknown chief paths surface honest `obtained`／status behaviour
- [ ] Coverage is through CaseSession summary／`viewFacts` behaviour
