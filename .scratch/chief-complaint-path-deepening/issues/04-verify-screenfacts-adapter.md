# 04 — Verify ScreenFacts-only DOM adapter

**What to build:** Confirm (and gap-fix if needed) that the DOM adapter paints answer fields and flags only from `viewFacts` ScreenFacts — no step getters and no direct `state.answers` reads — while catalogs and UI copy may remain in the adapter.

**Blocked by:** 01 — Verify Chief complaint path routing + soft gate; 02 — Verify duration sole ownership (OPQRST T); 03 — Verify chief narrative facts in summary

**Status:** resolved

- [x] ScreenFacts expose the paint fields／flags needed for path steps (including answer status, trauma／pain／duration-related flags, and history option／note fields)
- [x] Adapter does not call step getters or read `state.answers` for painting
- [x] Catalogs and UI copy may still be imported by the adapter
- [x] OPQRST screen time fields shown to the user come from duration-backed ScreenFacts
- [x] Full test suite stays green after any gap-fix; no product flow change beyond adapter hygiene

## Answer

Adapter already painted from ScreenFacts (landed earlier). Gap-fix: OPQRST now paints `answerStatus` like other path steps. Added `screenfacts-adapter.test.ts` — source hygiene (no getters／`state.answers`; catalogs allowed) plus `viewFacts` paint-field contract for trauma／quality／duration／history／OPQRST T／secondary. Suite 65 green.
