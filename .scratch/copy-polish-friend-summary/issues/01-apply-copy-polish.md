# 01 — Apply friend Informant + clipboard disclaimer polish

**What to build:** Match `.scratch/copy-polish-friend-summary/spec.md`: Informant `friend` labels as「朋友(友人)」/ Friend across locales; omit disclaimer from `formatSummaryText` / summary `plainText` while keeping the on-screen footer.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Friend Informant Chinese + second-language Friend wording
- [x] Clipboard summary omits disclaimer; keeps title + sections
- [x] Tests at Informant labels + `formatSummaryText` seams
- [x] Glossary Informant wording updated if needed
- [x] Typecheck + full test suite
- [x] Commit and push on current branch

## Answer

- `friend` →「朋友(友人)」/ Friend across locales; id unchanged.
- `formatSummaryText` drops disclaimer; footer still shows `DISCLAIMER_ZH`.
- Vitest: 44 passed; `tsc --noEmit` clean.
- Code review (Standards + Spec vs HEAD): pass / matches spec.
