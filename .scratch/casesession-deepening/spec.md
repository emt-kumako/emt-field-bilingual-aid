Status: ready-for-agent
Type: spec
Feature: casesession-deepening

# CaseSession Deepening + Summary Bilingual Display — Spec

## Problem Statement

訪談流程的編排、擋關、開場兩頁與摘要顯示邏輯散落在 DOM adapter 與多個命名混亂的步驟模組裡，使現場行為難測、難改。主訴「怎麼不舒服」與「多久了」仍帶歷史命名債；互斥選取與身體部位規則各寫一份；雙語 markup 重造多次。摘要無法用第二語言給傷病患／他人對看再確認，複製又必須維持中文紀錄。

## Solution

加深 **CaseSession** 為訪談編排主縫線：Start phase、soft Gate reason、click／input 一律經 `apply`，畫面編排事實經 `viewFacts`；DOM 只做 adapter。名實拆開 chief complaint quality／duration；抽出 Option selection 與 Body selection；雙語呈現統一 primacy。摘要**畫面**第二語言為主、中文為副；**複製**固定中文。

## User Stories

1. As a 救護人員, I want language then informant as Start phase inside the Case, so that opening prelude is not a parallel UI flag.
2. As a 救護人員, I want Next soft-gated with a stable Gate reason, so that empty steps do not advance while Back／不知道／跳過 stay available.
3. As a 救護人員, I want every tap and text input to go through one CaseSession write path, so that behaviour is testable in one place.
4. As a 救護人員, I want the DOM only to paint facts and dispatch intents, so that interview rules do not live in markup handlers.
5. As a 救護人員, I want to go back from chief complaint step 1 to the informant Start phase when a language is already chosen, so that corrections stay natural.
6. As a 救護人員, I want finish／新案件 to reset Start phase to language, so that the next Case starts clean.
7. As a 救護人員, I want the quality step named and stored as chief complaint quality, so that “step 2” no longer means duration as well.
8. As a 救護人員, I want duration as its own step and module, so that time rules and quality rules do not share a combined detail bag.
9. As a 救護人員, I want summary edit of 主訴 to land on the relevant quality or duration sub-step, so that refine is not always forced through where／what.
10. As a 傷病患或家屬, I want exclusive options (例如同哪裡不舒服、無、不知道) to clear other picks consistently across history, quality, and accompanying symptoms, so that pointing rules feel the same.
11. As a 救護人員, I want meal intake single-select and dialysis left／right mutex to share the same Option selection rules, so that exclusive bugs fix once.
12. As a 傷病患, I want exclusive accompanying symptoms to lock and clear the body map, so that “none／unknown” cannot mix with locations.
13. As a 傷病患, I want coarse body region and optional subregion drilldown to behave the same on 主訴 and 感, so that pointing is predictable.
14. As a 救護人員, I want bilingual interview controls second-language-primary with Chinese secondary, so that the pointing language leads.
15. As a 傷病患或他人, I want the on-screen summary second-language-primary with Chinese secondary, so that I can reconfirm what was recorded.
16. As a 救護人員, I want summary copy always Chinese, so that the pasted record matches local documentation.
17. As a 救護人員, I want the copy control labeled to make Chinese copy obvious, so that I do not expect the clipboard to match the on-screen second language.
18. As a 救護人員, I want Start-phase language picker flags／native names to stay a dedicated start layout, so that flag chrome is not forced into generic bilingual pairs.
19. As a 開發者／agent, I want CaseSession as the primary test seam, so that interview regressions are caught without DOM tests.
20. As a 開發者／agent, I want Option selection, Body selection, and bilingual primacy as small pure seams for unit rules, so that exclusive／mutex／order bugs stay local.
21. As a 開發者／agent, I want domain terms (Case, Start phase, Gate reason, CaseSession, chief complaint quality／duration, Option selection, Body selection, Bilingual primacy) in the glossary, so that later work does not re-invent names.
22. As a 救護人員, I want chief_complaint_1 naming left alone in this pass, so that scope does not expand into a full mnemonic rename.
23. As a 救護人員, I want unknown／skip／back never hard-blocked by soft gates, so that field flow stays recoverable under stress.
24. As a 救護人員, I want summary sections (答題者、主訴、口訣、感) bilingual in display while Chinese values remain complete for copy, so that both audiences are served.
25. As a 救護人員, I want EMT-only notes (備註／細調) to appear in both display lines when present, so that refine text is not dropped from either language view.
26. As a 救護人員, I want mid-case informant changes reflected in bilingual summary history, so that who answered stays auditable on screen and in Chinese copy.
27. As a 開發者／agent, I want locale completeness to cover summary chrome strings, so that second-language summary never blanks.
28. As a 救護人員, I want finishing a Case to clear answers and return to language Start phase, so that PHI does not linger on shared tablets.

## Implementation Decisions

- **Primary seam:** CaseSession. Callers learn `createCase`／`startNewCase`, `apply(state, intent)`, `viewFacts(state)`. Existing step modules remain internal implementation behind that seam for migration.
- **Intent shape (from design-it-twice hybrid):** write path is intent-tagged `edit` (slot + optional value) or `nav` (next／back／unknown／skip／finish／return_to_summary／goto／edit-from-summary). Soft-gated `next` is a no-op; back／unknown／skip are never blocked by gate.
- **View facts:** orchestration only — Start phase, current step, gate `{ reason, nextEnabled }`, and a step-discriminated screen body (ids／flags／summary sections). Not full HTML.
- **Start phase** lives on the Case (`language` | `informant`). Landing back on start with a language set prefers informant.
- **Gate reason** is a stable code; UI maps to Chinese (or bilingual) copy. Soft only.
- **Chief complaint quality** step id `chief_complaint_quality`; **chief complaint duration** stays `chief_complaint_duration`. Remove combined quality+duration detail; summary joins lines itself.
- **Option selection:** pure `nextSelectedIds(selected, optionMeta, clickedId, mode?)` with `single` | `multi`, exclusive, and mutexGroup. Body-lock policy stays in the accompanying-symptoms step.
- **Body selection:** pure `toggleRegion`／`toggleSubregion`／`clearDrilldown` over a body-selection record; steps persist into their own answer detail.
- **Bilingual primacy:** `second` | `chinese`. Interview and on-screen summary use `second`. Clipboard summary uses Chinese only via the Chinese fields of summary lines.
- **Summary sections** carry bilingual `{ zh, other }` label and value lines; `formatSummaryText` concatenates Chinese only.
- **DOM adapter** keeps catalogs for option lists／maps, maps Gate reasons to copy, owns clipboard side effects, and keeps the start language picker (flags／native) outside the generic bilingual presentation module.
- **Glossary** terms recorded for Case, Start phase, Informant, Gate reason, CaseSession, chief complaint quality／duration, Option selection, Body selection, Bilingual primacy.
- **Out of this rename pass:** renaming `chief_complaint_1` to a location-style id.
- **Prototype intent／facts sketch** (decision-rich, from design-it-twice):

```ts
type Intent =
  | { type: "edit"; slot: Slot; value?: string }
  | { type: "nav"; move: "next" | "back" | "unknown" | "skip" | "finish" | "return_to_summary" }
  | { type: "nav"; move: "goto" | "edit"; step: InterviewStep };

type ViewFacts = {
  startPhase: StartPhase;
  currentStep: InterviewStep;
  gate: { reason: GateReason | null; nextEnabled: boolean };
  screen: /* step-discriminated orchestration facts */;
};
```

## Testing Decisions

- Good tests assert observable behaviour through seams: Case transitions, gate enablement／reason codes, selected ids, summary line zh／other, Chinese-only copy text — not DOM HTML structure or private helpers.
- **Primary module under test:** CaseSession via `apply` + `viewFacts` (Start phase, soft gate, nav, edits, finish).
- **Supporting pure modules:** Option selection, Body selection, bilingual primacy ordering, summary bilingual builders／Chinese copy formatter.
- **Prior art:** existing CaseSession／list-step／chief-complaint／summary／locale-completeness Vitest suites; extend rather than invent a second harness.
- Layout density, flag art, and visual stacking remain manual acceptance (same stance as interview UX pass) — not CaseSession unit tests.
- Prefer replace-don’t-layer: once CaseSession seam tests cover a flow, avoid keeping duplicate shallow tests that only restate internal wiring.

## Out of Scope

- Pushing／deploying to GitHub Pages (unless separately requested).
- Renaming chief complaint step 1 id.
- Runtime toggle control to flip summary primacy after load (current product choice is fixed: screen second-primary; copy always Chinese).
- Full native-speaker QA of all ten locales (covered by prior UX-pass wording tickets if still open).
- Ports／adapters for remote I/O (domain remains in-process).
- Rewriting the start language picker into the generic bilingual presentation module.
- Ending／new-case button bilingualization (optional follow-up only).

## Further Notes

- Much of this pass is already implemented in the working tree and awaiting commit; this spec is the decision record and acceptance surface for landing／verification.
- Earlier interview UX pass assumed summary Chinese-primary; this spec **supersedes that display rule**: on-screen summary is second-language-primary; copy remains Chinese.
- Tracker: local markdown under `.scratch/` (`docs/agents/issue-tracker.md`). Triage: `ready-for-agent`.
- Recommended feature slug directory: `.scratch/casesession-deepening/`.
