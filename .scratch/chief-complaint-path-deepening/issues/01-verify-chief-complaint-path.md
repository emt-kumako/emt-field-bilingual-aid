# 01 — Verify Chief complaint path routing + soft gate

**What to build:** Confirm (and gap-fix if needed) that after primary reason, Next／Back／summary-edit and soft gate follow Chief complaint path rules into quality, OPQRST, or duration, then into `before` — without hard-coded cross-step strings, without putting history or Secondary reason on this graph, and with trauma mechanism ↔ body staying inside the primary step.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Next after primary lands on OPQRST, quality, or duration per Scene type and primary reason (including unknown／skip → duration)
- [x] Back from OPQRST／quality／duration／`before` reverses the same path
- [x] Summary edit of the chief-complaint block opens the path-owned edit target
- [x] Soft gate for path steps is path-owned; Next may disable, while Back／unknown／skip stay available
- [x] History mnemonic and Secondary reason are outside the path; mechanism ↔ body stays inside primary
- [x] Behaviour is covered through CaseSession `apply`／`viewFacts` (no DOM-structure tests required)

## Answer

Product path already landed in `c5ed91a`. Gap-fix added CaseSession seam tests in `orchestrate.test.ts` for: quality-path reverse + soft exits; OPQRST→primary back; duration soft gate + unknown／skip → `before`; summary chief `editStep` via `apply` for quality／OPQRST／duration paths (history skipped through intents, not teleport). Full suite 60 green. No product-code change required.
