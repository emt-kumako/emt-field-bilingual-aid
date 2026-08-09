# 06 — 摘要主訴敘事＋次因欄

**What to build:** 摘要主訴併成一段敘事（明文含創傷／非創傷，並帶入主因／機轉／OPQRST／部位等要點）；次因獨立成「還有其他感覺不舒服的地方」欄。螢幕雙語（第二語為主）、複製中文且不含 footer 免責。經 `viewFacts`／`formatSummaryText` 可測。

**Blocked by:** 04 — 胸悶／胸痛 OPQRST；05 — 次要原因

**Status:** resolved

- [x] 主訴摘要為單一敘事區塊，含 Scene type 明文
- [x] 次因獨立成欄，標題對齊「還有其他感覺不舒服的地方」
- [x] 螢幕雙語 primacy 不變；複製中文、無免責段
- [x] 創傷與非創傷（含胸痛 OPQRST）路徑各有至少一條摘要測試

## Answer

- `formatChiefParts` 以 Scene type（創傷／非創傷）開頭，串主因／機轉／部位／OPQRST／時間成一段主訴敘事。
- 次因仍為獨立 `other_symptoms` 欄，標題「還有其他感覺不舒服的地方」。
- `formatSummaryText` 僅中文、無免責；創傷與胸痛 OPQRST 各有 summary 測試。Vitest 55 passed.
