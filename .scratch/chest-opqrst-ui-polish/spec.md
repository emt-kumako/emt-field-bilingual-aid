Status: ready-for-agent

# Chest OPQRST UI polish + summary chrome

## Problem Statement

On the OPQRST chest page (non-trauma primary「胸痛／胸悶」), crews need the mnemonic letters, page title, pain faces, option catalogs, and time preview to follow Start-phase second-language choice with Chinese secondary — not hard-coded English. Medication catalog gaps and OPQRST P／Q／R option lists were incomplete for field use. On the final Case summary, Chinese operator chrome (subtitle and copy action) was cluttered with second-language lines that do not help paste-to-record.

## Solution

Polish the OPQRST chest page so letter glosses, page title, “約” prefix, and the completed time phrase render from the selected second language (Chinese remains secondary where bilingual pairs apply). Use cropped Pain Assessment Tool faces for severity bands. Expand P／Q／R option catalogs and medication history options as specified. On summary, show a single Chinese subtitle and a Chinese-only「複製摘要」control; clipboard content stays Chinese-only as today.

## User Stories

1. As a救護人員, I want OPQRST letter headings to show the mnemonic letter plus a gloss in brackets, so that O／P／Q／R／S／T meaning is visible without leaving the page.
2. As a傷病患／Informant, I want that gloss to be in the Start-phase second language, so that English (e.g. Onset) appears only when English was chosen.
3. As a救護人員, I want Chinese gloss meanings (發作狀況、誘發與緩解因子、性質、部位與放射痛、嚴重程度、時間軸) available in the catalog as the Chinese side of those bilingual strings, so that locale packs stay complete.
4. As a傷病患／Informant, I want the OPQRST page title to put the selected second language first and Chinese second, so that primacy matches other interview steps.
5. As a救護人員, I want the title meaning「胸痛／胸悶 · 怎麼發生的」to have a real string in every second language, so that non-English Start choices do not fall back to an English-only hard-coded lead.
6. As a傷病患／Informant, I want S to remain a 0–10 severity control with face assets aligned to bands 0、1–3、4–6、7–9、10, so that pointing at faces matches the numeric scale.
7. As a救護人員, I want those faces cropped from the Pain Assessment Tool chart (not emoji), so that the scale matches the referenced clinical visual.
8. As a救護人員, I want P to include「姿勢無法緩解」and「服藥無法緩解」alongside existing position／meds help options, so that negative palliation is capturable.
9. As a救護人員, I want Q to list「撕裂痛」first, then「壓痛／壓迫感」, then the remaining quality options, so that high-acuity descriptors are easy to tap.
10. As a救護人員, I want R to show only 下巴/脖子、左側胸、右側胸、上腹、肩膀、下背、無, so that radiation／region choices stay a short exclusive-capable list.
11. As a救護人員, I want「無」on R to behave as an exclusive option, so that “none” clears other region taps.
12. As a傷病患／Informant, I want the T “約” prefix to follow bilingual primacy for the selected second language, so that About／Khoảng／etc. is not hard-coded English.
13. As a救護人員, I want filling T pattern and／or numeric duration to show a complete preview sentence in the selected second language, so that I can confirm what will be understood before leaving the page.
14. As a救護人員, I want that preview to update live while typing the amount (without requiring Next), so that corrections are immediate.
15. As a救護人員, I want T unknown to participate in that preview sentence when selected, so that「時間不詳」／locale equivalent is visible.
16. As a救護人員, I want OPQRST T to keep writing chief complaint duration detail (sole duration owner) and skip the shared duration step, so that path ownership is unchanged.
17. As a救護人員, I want medication history to add 氣喘藥、精神疾病相關藥物、抗癲癇, so that common chronic meds are tappable.
18. As a救護人員, I want 降血糖藥 and 胰島素 as separate medication options, so that they are not collapsed into one choice.
19. As a救護人員, I want the Case summary subtitle to be exactly「現場資訊彙整，可複製後貼到紀錄；結束即清除。」with no second-language line, so that operator chrome stays Chinese-only.
20. As a救護人員, I want the copy control to show only「複製摘要」, so that the action is not bilingual.
21. As a救護人員, I want clipboard paste to remain Chinese summary text for the record, so that bilingual primacy on interview screens does not change the paste language.
22. As a救護人員, I want on-screen summary section rows to keep second-language primacy, so that Informant reconfirmation is still possible while chrome is Chinese-only.
23. As a developer agent, I want every new bilingual catalog string to satisfy locale completeness across all second languages, so that missing packs fail loudly.
24. As a developer agent, I want CaseSession apply／viewFacts ownership of OPQRST／duration／summary facts left intact, so that this polish stays in catalog + presentation chrome.
25. As a救護人員, I want Gate reasons and soft Next rules for OPQRST (O／Q／S／T required; P／R optional; unknown／skip available) unchanged, so that clinical flow is not redesigned.
26. As a救護人員, I want pain-face assets to load from the offline app shell, so that the scale works without network.
27. As a救護人員, I want letter gloss English forms Onset、Provocation/Palliation、Quality、Region/Radiation、Severity、Time when English is the second language, so that mnemonic teaching matches common EMS usage.
28. As a救護人員, I want choosing Vietnamese／Indonesian／etc. on Start to drive OPQRST title, glosses, about-prefix, and time sentence into that language, so that one Start choice governs the whole page.

## Implementation Decisions

- Primary seams (existing — prefer these; do not invent a new orchestration module):
  1. **Bilingual catalogs** for OPQRST letter glosses, OPQRST page title, P／Q／R／T options, medications, and related UI copy — completeness asserted with other locale packs.
  2. **Presentation paint for the OPQRST chest page and summary chrome** — letter headings, time preview sentence, summary subtitle／copy button; still fed by `viewFacts`／`ScreenFacts`, not by reading `state.answers` in new places.
- Interview bilingual primacy remains `second` (second language primary, Chinese secondary) for OPQRST title, option buttons, about-prefix, and letter gloss selection.
- Letter heading shape: `O [gloss]` where gloss is the selected second-language string only (not a bilingual pair inside the brackets).
- Time preview: compose pattern label + duration（or unknown）into one sentence in the selected second language; live-refresh on amount input alongside existing duration preview refresh behavior.
- Pain faces: five static assets for bands 0、1–3、4–6、7–9、10; band 4–6 uses the yellow／neutral face from the source chart.
- R catalog is the short region list only; legacy radiation-site catalog may remain empty for old answer ids.
- Summary chrome exception: subtitle and copy button are Chinese-only operator chrome; this does not change clipboard language policy or section-row bilingual primacy.
- Summary subtitle string is exactly: `現場資訊彙整，可複製後貼到紀錄；結束即清除。`
- Copy button label is exactly: `複製摘要`.
- Do not dual-write OPQRST-owned time fields; T continues to use chief complaint duration ownership.

## Testing Decisions

- Good tests assert external catalog wording, locale completeness, and CaseSession／summary facts — not private DOM helper names or pixel layout.
- Prefer these seams:
  - **Locale completeness** for new／changed bilingual strings (letter glosses, OPQRST title, medications, P／Q／R options).
  - **Existing OPQRST／duration／chief-narrative／summary tests** for path ownership, duration sole ownership, and Chinese clipboard behavior — extend only if a catalog id or narrative fragment changes break them.
- Presentation-only chrome (Chinese summary subtitle,「複製摘要」, live time preview sentence) may be verified manually or with the thinnest possible assertion if a presentation test harness already exists; do not invent a second CaseSession API just to test labels.
- Prior art: `locale-completeness.test.ts`; `summary.test.ts` for clipboard／narrative; `orchestrate.test.ts` for OPQRST duration ownership; bilingual presentation tests if present.

## Out of Scope

- Redesigning Chief complaint path routing, soft gates, or Scene type branching.
- Full OPQRST for non-chest primaries.
- Changing clipboard summary to bilingual or non-Chinese.
- Reworking summary section structure, edit navigation, or finish／clear Case behavior.
- New second languages beyond the existing ten-locale set.
- Replacing CaseSession with a new state module.
- Medical protocol changes beyond the listed option／medication labels.

## Further Notes

- Tracker: local markdown under `.scratch/` (`docs/agents/issue-tracker.md`). Triage: `ready-for-agent`.
- Glossary terms used: Case, Start phase, Informant, CaseSession, Chief complaint path, OPQRST chest page, Chief complaint duration, Bilingual primacy, Chief narrative facts, Gate reason, Primary reason.
- Much of this polish may already be present in the working tree; agents should verify against this spec and add gaps／tests rather than re-implement blindly.
- Seams called out above are the intended test／change boundaries — confirm with the human if a deeper CaseSession seam seems necessary (it should not for chrome-only work).
