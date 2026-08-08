# 01 — Harness + CaseSession skeleton

**What to build:** A runnable project test harness and a `CaseSession` engine that can create a new case and clear it. No full interview UI yet — just the seam and proof that case state can be started and wiped.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Test runner is wired and at least one CaseSession test passes
- [x] `CaseSession` can create a fresh case and clear/reset it so no prior answers remain
- [x] Domain rules live in CaseSession (or pure helpers it owns), not in UI code

## Answer

- Vitest + TypeScript harness (`npm test`)
- Seam: `src/case-session/` — `createCase` / `startNewCase` (+ types for later steps)
- 2 tests green: fresh case empty; `startNewCase` wipes answers and identity fields
