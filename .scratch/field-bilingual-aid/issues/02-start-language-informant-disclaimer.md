# 02 — Start: second language + informant + disclaimer

**What to build:** From a start screen, an EMT can choose a second language (English / Vietnamese / Indonesian), choose who is answering (本人／家屬／友人／其他), and see the communication-aid disclaimer without a mandatory confirm gate. CaseSession stores these choices and can proceed into the interview.

**Blocked by:** 01 — Harness + CaseSession skeleton

**Status:** resolved

- [x] Second language selection is stored on the case (MVP: en / vi / id) with Chinese as anchor
- [x] Informant selection is stored and can be changed later without wiping the whole case
- [x] Disclaimer is visible at start and does not require a per-case acknowledge tap
- [x] Tests cover language + informant being set on CaseSession

## Answer

- CaseSession: `setSecondLanguage`, `setInformant` (history on change, answers kept), `canBeginInterview`, `beginInterview`
- Disclaimer copy in `src/content/disclaimer.ts` — shown on start UI, no acknowledge state
- Thin Vite start screen in `src/main.ts`; `npm run dev` to try
- 7 tests green
