# 04 — 胸悶／胸痛 OPQRST（T 帶入多久）

**What to build:** 非創傷主因選胸悶／胸痛後進入 OPQRST 頁。O／Q／S／T 軟必填，P／R 可空；欄位皆指選（除 T 的約略數字）。S 為 0–10＋色尺／表情對照（表情非第二套選取），小字註明出處。T：一陣一陣／一直持續、約 __ 分鐘／小時／天、或時間不詳——寫入與「多久了」同一 duration 答案並跳過共用多久頁。

**Blocked by:** 02 — 非創傷主要原因（扁平目錄）

**Status:** resolved

- [x] 選胸悶／胸痛後進入 OPQRST 步驟（glossary 可記 OPQRST chest page）
- [x] O／P／Q／R／S／T 行為符合共識；P／R 可空
- [x] S：整數 0–10；UI 事實含色尺／表情對照與出處註記
- [x] T 滿足時 duration 答案已寫入；導覽跳過 `chief_complaint_duration`
- [x] 軟 Gate：缺 O／Q／S／T 時 Next 關閉；unknown／skip／back 仍可用
- [x] CaseSession 測試覆蓋閘門、duration 帶入、跳過多久頁

## Answer

- Step `chest_opqrst` after non-trauma `chest_pain`; catalog `src/catalog/chest-opqrst.ts`; module `src/case-session/chest-opqrst.ts`.
- Soft gate `need_opqrst` (O／Q／S／T); P／R optional. T syncs into `chief_complaint_duration`; complete → `before` (skips quality + duration).
- UI: color bar + face reference on 0–10, source note/URL; Vitest 52 passed.
