# 06 — 感＋本機摘要＋複製＋結束清除

**What to build:** Finish the MVP path: 感 as one accompanying-symptom / optional second body-map pass (with 沒有其他／不知道), then a Chinese-primary structured local summary of the whole case. From summary, EMT can jump back to edit a field, copy to clipboard, and finish/new-case to clear everything. Chinese + English main path is demoable end-to-end.

**Blocked by:** 05 — 之前→吃→過→藥→敏

**Status:** resolved

- [x] 感 is a single extra pass (not an infinite 主訴 restart) and records accompanying findings or none/unknown
- [x] Summary shows informant, 主訴, 之前, 吃, 過, 藥, 敏, 感 with confirmed vs not-obtained distinction
- [x] Summary indicates informant in a simple way if changed mid-case
- [x] EMT can jump from a summary field back to edit, then return
- [x] Copy places summary text on the clipboard
- [x] Finish / new case clears all case data
- [x] Disclaimer remains visible on the summary
- [x] Tests cover 感 single-pass, summary contents, and clear behavior

## Answer

- 感: `other-symptoms` catalog + CaseSession single pass → summary
- Summary: `buildSummarySections` / `formatSummaryText` (Chinese-primary, obtained vs 未取得)
- Edit-from-summary via `returnToSummary`; copy clipboard; `finishCase` clears
- End-to-end zh+en path demoable with `npm run dev`
- 22 tests green
