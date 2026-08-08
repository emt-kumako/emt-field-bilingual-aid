Status: ready-for-agent

# Copy polish: friend Informant + clipboard summary

## Problem Statement

On the Start-phase Informant picker, the `friend` option still reads as a vague「有人／Someone else」, which understates that the answerer is a friend. Separately, pasting the Chinese summary into handoff notes always includes the long footer disclaimer about the tool’s origin and “非評估或診斷”, which crews do not want in the clipboard payload.

## Solution

Label the `friend` Informant as「朋友(友人)」in Chinese and align every second-language string to a Friend meaning. Keep the on-screen footer disclaimer, but omit it entirely from Chinese clipboard summary text produced for copy/paste.

## User Stories

1. As a救護人員, I want the Informant option that means friend to say「朋友(友人)」, so that who is answering is clear on the Start phase.
2. As a傷病患或友人, I want that same option’s second-language line to mean Friend (not “someone else”), so that pointing matches the chosen language.
3. As a救護人員, I want bilingual Informant buttons to keep second-language primacy with Chinese secondary, so that Start phase presentation stays consistent.
4. As a救護人員, I want the friend label to appear in the on-screen bilingual summary when that Informant is selected, so that handoff viewing matches the picker.
5. As a救護人員, I want Chinese-only clipboard summary copy to use「朋友(友人)」for that Informant, so that pasted notes match the Chinese UI term.
6. As a救護人員, I want clipboard summary copy to exclude the tool-origin / non-assessment disclaimer paragraph, so that paste is only case content plus the short summary title.
7. As a救護人員, I want the disclaimer to remain visible in the app footer, so that the communication-aid boundary is still shown during use.
8. As a救護人員, I want clipboard copy to keep the Chinese summary title line「【救護現場雙語溝通輔助 · 本機摘要】」, so that pasted text is still identifiable as this tool’s output.
9. As a救護人員, I want clipboard copy to keep all structured summary sections (Informant, 主訴, mnemonic steps), so that clinical content is unchanged aside from dropping the disclaimer.
10. As a救護人員, I want mid-case Informant changes involving friend to still show history using the updated labels, so that audit trails stay readable.
11. As a救護人員, I want other Informant options (本人／家屬／其他) wording left unchanged, so that this polish stays narrow.
12. As a救護人員, I want the Informant id `friend` preserved, so that Case state and history do not need migration.
13. As a developer agent, I want locale completeness for Informant labels to remain satisfied across all second languages, so that no language falls back empty.
14. As a救護人員, I want `viewFacts` summary `plainText` to reflect the disclaimer-free copy, so that the UI copy action and orchestration facts stay aligned.

## Implementation Decisions

- Primary seams (existing — prefer these over new modules):
  1. **Informant start labels** — bilingual catalog entry for Informant id `friend` (Chinese + all second languages).
  2. **`formatSummaryText`** — Chinese clipboard / record plain text for the Case summary (also surfaced as summary `plainText` via CaseSession orchestration).
- Chinese label for `friend`: exactly `朋友(友人)`.
- Second-language strings for `friend` must mean Friend (not “someone else” / “someone present”).
- Do not change disclaimer module content; only stop including it in clipboard summary formatting.
- On-screen footer continues to render the existing Chinese disclaimer.
- Domain id remains `friend`; no Case schema / history migration.
- Glossary: Informant wording should describe patient, family, friend, or other (not “someone present”).

## Testing Decisions

- Good tests assert external wording and clipboard contents through public seams, not DOM markup or private helpers.
- Cover at the two seams above:
  - Informant labels: Chinese `朋友(友人)` and at least one second-language Friend literal for id `friend`; locale completeness still covers all langs.
  - `formatSummaryText`: still includes the Chinese title and case sections; must not contain the disclaimer’s distinctive phrases (e.g. tool-origin / 「非評估或診斷」).
- Prior art: `summary.test.ts` clipboard assertions; `locale-completeness.test.ts` for Informant catalogs; `disclaimer.test.ts` remains about footer copy existence, not paste.

## Out of Scope

- Rewording the disclaimer text itself.
- Removing the on-screen footer disclaimer.
- Changing Start-phase flow, gate reasons, or Informant ids.
- Redesigning summary section structure or bilingual on-screen primacy.
- New languages or Informant options.

## Further Notes

- Tracker: local markdown under `.scratch/` (`docs/agents/issue-tracker.md`). Triage: `ready-for-agent`.
- This supersedes the interview-UX-pass wording that mapped `friend` →「有人」.
- Clipboard copy remains Chinese-only; on-screen summary bilingual primacy is unchanged.
