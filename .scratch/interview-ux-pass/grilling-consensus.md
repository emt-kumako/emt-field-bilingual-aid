# Interview UX Pass — Grilling Consensus

Status: confirmed  
Date: 2026-08-08  
Source: layout / i18n / start-flow / de-fr-es expansion grilling

## Locked decisions

| # | Topic | Decision |
| --- | --- | --- |
| 1 | Scroll | Free full-page scroll on phone, tablet, and web |
| 2 | Bilingual text | Full display with wrap; no truncate; no hide second language |
| 3 | Body UI | &lt;768 list 2-col; ≥768 body map |
| 4 | Breakpoint | 768px |
| 5 | Chrome | Sticky action bar + transparent backgrounds |
| 6 | Density strategy | Layout-first; shorten copy only if still overflowing |
| 7 | Hide/clamp | Remove short-height `.sub` hide and summary line-clamp |
| 8 | Zoom | Keep zoom lock |
| 9 | Acceptance | 390 / 768 / 1180 × **10** langs on key screens |
| 10 | Language primacy | All bilingual UI: second language / native primary (top), Chinese secondary; summary Chinese-primary |
| 11 | Start split | Page 1 language → Page 2 informant「正在回答問題的是：」 |
| 12 | Informant options | 本人、家屬、有人、其他 |
| 13 | Language picker row | Top: flag(s) + native (e.g. 🇺🇸🇬🇧 English); bottom: Chinese |
| 14 | Language order | en, vi, id, fil, th, ja, ko, de, fr, es |
| 15 | Flags | en 🇺🇸🇬🇧; de 🇩🇪; fr 🇫🇷; es 🇪🇸🇲🇽; others one flag each; picker only |
| 16 | New locales | de / fr / es full catalog, same completeness as existing seven |
| 17 | Register | es neutral ES/LatAm; fr vous; de Sie; short field phrases |
| 18 | Body required | Required: pain, bleeding, trauma. Not required: breathing, weakness, dizziness, seizure, nausea/vomiting, other |
| 19 | 主訴 split | Where/what → how it feels → how long |
| 20 | Quality shortcut | 「同哪裡不舒服」 exclusive |
| 21 | Duration | Numeric + units + 剛才/period + EMT refine; last write wins |
| 22 | Intake | Yesterday/today B/L/D + other + don’t know; single-select |
| 23 | Past history | Title 過（過去病史）; dialysis L/R mutex; 精神疾病 |
| 24 | Summary | One 主訴 row; edit to sub-steps |
| 25 | Language QA | Separate ticket to review all 10 langs for grammar/correctness/field fit; fixes before pass complete |

## Test seam

- Primary: `CaseSession`
- Layout / flags / density: manual acceptance matrix
- Language QA: content review, not a code seam
