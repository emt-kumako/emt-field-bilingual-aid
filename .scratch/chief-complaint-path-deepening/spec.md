Status: ready-for-agent
Type: spec
Feature: chief-complaint-path-deepening

# Chief complaint path deepening — Spec

## Problem Statement

Scene type／主因／OPQRST／性質／時程落地後，主訴區段的 next／back／summary-edit 與 soft gate 仍散落在 orchestrate 與各 step 的硬編碼字串與重複路徑謂詞裡。OPQRST 與共用時程雙寫 `timePattern`；摘要重推整段面談；DOM adapter 仍穿縫讀 step getter／`state.answers`。現場行為難測，後續改分支易漏改。

## Solution

加深 **Chief complaint path** 為主訴區段路由與 soft gate 的單一所有權：primary →（quality｜OPQRST｜duration）→ 進入 `before`。**Chief complaint duration** 為時程／pattern 唯一擁有者；OPQRST T 只讀寫該 detail。CaseSession 產出 **Chief narrative facts**（有序雙語片段＋`editStep`＋`obtained`），summary 只接合。`viewFacts` 的 **ScreenFacts** 補完，使 DOM 只 paint 編排事實與 catalog／UI copy。行為仍經既有 CaseSession 縫線 `apply`／`viewFacts` 可測。

## User Stories

1. As a 救護人員, I want Next after primary to land on OPQRST, quality, or duration according to Scene type and primary reason, so that I do not see irrelevant chief-complaint steps.
2. As a 救護人員, I want Back from duration／before／OPQRST／quality to reverse the same path, so that corrections feel consistent with how I advanced.
3. As a 救護人員, I want summary edit of the chief-complaint block to open the most relevant path step, so that refine does not always force me through「哪裡不舒服」.
4. As a 救護人員, I want soft gates on path steps to share one path-owned reason surface, so that Next disablement matches product rules without hard blocks.
5. As a 救護人員, I want unknown／skip／back to stay available under those soft gates, so that field recovery stays possible.
6. As a 救護人員, I want trauma mechanism ↔ body map to stay inside the primary step, so that path routing does not invent a fake extra step for that toggle.
7. As a 救護人員, I want history mnemonic steps and Secondary reason outside the chief complaint path graph, so that path changes do not rewrite the whole interview map.
8. As a 傷病患, I want OPQRST T pattern／approx duration／unknown to update the same duration answer the shared「多久了」step uses, so that time never diverges between screens.
9. As a 救護人員, I want OPQRST to skip the shared duration step after writing duration, so that time is not asked twice.
10. As a 救護人員, I want OPQRST detail not to keep its own `timePattern` field, so that there is one owner for pattern state.
11. As a 救護人員, I want the on-screen summary chief block assembled from ordered bilingual fragments, so that Scene type／mechanism／OPQRST／quality／duration read as one narrative without formatter re-branching.
12. As a 救護人員, I want each narrative fragment to carry Chinese and second-language text, so that second-primary display and Chinese-only copy stay complete.
13. As a 救護人員, I want summary to mark whether chief facts were obtained, so that skipped／unknown chief paths stay honest.
14. As a 開發者／agent, I want path next／back／edit／gate decisions concentrated behind CaseSession, so that adding a branch does not require hunting hard-coded step strings.
15. As a 開發者／agent, I want the DOM adapter to paint only from `viewFacts` ScreenFacts for answer fields and flags, so that UI cannot bypass orchestration.
16. As a 開發者／agent, I want catalogs and UI copy to remain importable by the adapter, so that CaseSession does not swallow bilingual option lists.
17. As a 開發者／agent, I want ScreenFacts to expose answer status and path flags (for example trauma stage, pain scale, fall height), so that status notes and conditional chrome need no getter calls.
18. As a 開發者／agent, I want glossary terms Chief complaint path, Chief narrative facts, and duration sole ownership recorded, so that later work reuses the same names.
19. As a 開發者／agent, I want path soft-gate helpers not to create import cycles with step `canComplete*`, so that the module graph stays buildable.
20. As a 救護人員, I want non-trauma chest primary to enter OPQRST then `before` without visiting quality or shared duration, so that the chest path stays short.
21. As a 救護人員, I want trauma and abdominal／legacy pain primaries to visit quality before duration when answered, so that quality is asked only when relevant.
22. As a 救護人員, I want other non-OPQRST primaries to skip quality and go to duration, so that the path stays minimal.
23. As a 救護人員, I want primary unknown／skip to still reach duration (then history), so that soft exits do not trap the Case.
24. As a 開發者／agent, I want regression coverage through `apply`／`viewFacts` for path routing, duration ownership, narrative fragments, and ScreenFacts completeness, so that deepening does not rely on DOM tests.
25. As a 開發者／agent, I want orchestrate switch collapse and CaseSession barrel shrink deferred, so that this pass does not widen into unrelated structure churn.
26. As a 救護人員, I want existing Scene type／primary／secondary／OPQRST product behaviour preserved while internals deepen, so that field flow does not change under me.
27. As a 救護人員, I want bilingual primacy rules unchanged (interview and summary screen second-primary; copy Chinese), so that deepening stays architectural.
28. As a 開發者／agent, I want this pass verifiable against the committed landing when the tree already contains the deepening, so that tickets can close as verify／gap-fix rather than rewrite.

## Implementation Decisions

- **Primary seam:** CaseSession — callers continue to use `createCase`／`startNewCase`, `apply(state, intent)`, `viewFacts(state)`. No new external write／read seam.
- **Chief complaint path (internal):** Owns next／back／summary-edit routing and soft gate for primary →（quality｜OPQRST｜duration）→ entry into `before`. History mnemonic and Secondary reason stay outside. Trauma mechanism ↔ body remains inside the primary step.
- **Callers of the path:** Orchestration and step `complete*`／`goBack*` obtain `currentStep` from the path; they do not hard-code cross-step destination strings for those moves.
- **Soft gate:** Path-owned gate helper lives beside the path core so step `canComplete*` can be consulted without import cycles.
- **Duration sole ownership:** `chief_complaint_duration` detail holds pattern, amount, unit, unknown, buckets, refine. OPQRST detail drops `timePattern`. OPQRST T UI reads／writes duration detail; completing OPQRST skips the shared duration step.
- **Chief narrative facts:** CaseSession builds ordered `{ zh, other }` fragments plus `editStep` and `obtained`. Summary joins／wraps into the existing summary section shape; it does not re-derive trauma／OPQRST／duration branching.
- **ScreenFacts completeness:** Discriminated `screen` bodies include paint fields and flags the adapter needs (`answerStatus`, trauma stage／fall height flags, pain-scale flag, duration fields on OPQRST screen from duration detail, history option ids／notes, etc.). Adapter must not call step getters or read `state.answers`. Catalogs and UI copy may stay in the adapter.
- **Glossary:** Record **Chief complaint path**, **Chief narrative facts**, and clarify duration／OPQRST ownership in the project glossary.
- **Out of this sequenced path:** Collapsing orchestrate’s parallel switches into per-step handlers; shrinking the CaseSession barrel to only the seam exports.
- **Prototype-shaped facts** (decision-rich, from the landed design):

```ts
type ChiefNarrativeFacts = {
  fragments: { zh: string; other: string }[];
  editStep: InterviewStep;
  obtained: boolean;
};

// Path extent: currentStep moves among
// chief_complaint_1 | chest_opqrst | chief_complaint_quality |
// chief_complaint_duration | (entry) before
// Soft gate for those steps is path-owned.
```

## Testing Decisions

- Good tests assert external behaviour through CaseSession: after intents, `viewFacts` shows the expected `currentStep`, gate enablement／reason, ScreenFacts fields／flags, and summary plain／section content derived from narrative fragments — not private path helper names or DOM HTML.
- **Primary module under test:** CaseSession (`apply` + `viewFacts`), including path routing, OPQRST→duration ownership, summary chief block, and adapter-facing ScreenFacts.
- **Prior art:** existing orchestrate／chief-complaint／summary／chest-opqrst Vitest suites; extend rather than invent a second harness.
- Do not add DOM／Playwright coverage for this deepening; locale completeness stays on catalogs／copy as today.
- Prefer replace-don’t-layer: once seam tests cover a path branch, drop duplicate tests that only restate internal wiring.

## Out of Scope

- Collapsing orchestrate parallel switches (#5 from the architecture review).
- Shrinking the CaseSession public barrel to seam-only exports (#6).
- Renaming `chief_complaint_1`／`other_symptoms` step ids.
- Product changes to Scene type catalogs, Secondary reason lists, or bilingual primacy.
- Push／deploy to GitHub Pages unless separately requested.
- Full native-speaker QA of all locales.

## Further Notes

- **Consensus source:** `.scratch/chief-complaint-path-deepening/grilling-consensus.md` (confirmed 2026-08-09).
- **Landing status:** Deepening for 1–4 already committed (`c5ed91a`). This spec is the decision／acceptance surface; tickets may be verify＋gap-fix rather than greenfield build.
- Tracker: local markdown under `.scratch/` (`docs/agents/issue-tracker.md`). Triage: `ready-for-agent`.
- Feature slug directory: `.scratch/chief-complaint-path-deepening/`.
- Seams confirmed with maintainer: CaseSession primary; path／narrative internal; DOM adapter not a behaviour test seam.
