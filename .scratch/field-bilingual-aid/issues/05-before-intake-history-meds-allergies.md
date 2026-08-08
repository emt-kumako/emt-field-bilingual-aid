# 05 — 之前→吃→過→藥→敏

**What to build:** The middle mnemonic block end-to-end: 之前, 吃, 過, 藥, 敏 with short multi-select lists, 其他 (EMT local note), and 不知道／跳過. EMT can freely navigate back to edit. Chinese + English catalog for these steps.

**Blocked by:** 04 — 主訴第二步（性質＋時間＋痛尺）

**Status:** resolved

- [x] CaseSession supports answering 之前／吃／過／藥／敏 in order with multi-select where appropriate
- [x] 其他 captures an EMT-only short note; patient is not asked to type
- [x] Skip/unknown is available on each step and marked in state
- [x] EMT can navigate back/forward and change prior answers
- [x] Tests cover multi-select, 其他 note, and skip/unknown for this block

## Answer

- Catalog: `src/catalog/history-block.ts` (zh+en short lists)
- CaseSession: `src/case-session/list-step.ts` — toggle / note / skip / unknown / complete / `goToStep`
- 吃 = single-select; others multi; exclusive 無／不知道 clears peers
- UI: bilingual options + step chips for free jump; EMT note when 其他
- Completing 敏 → `other_symptoms` (ticket 06)
- 18 tests green
