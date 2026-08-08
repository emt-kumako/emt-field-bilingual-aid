# 04 — 主訴拆步＋「同哪裡不舒服」

**What to build:** 主訴改為三步：哪裡／怎麼了 → 怎麼不舒服 → 多久了。「怎麼不舒服」新增互斥選項「同哪裡不舒服」，選了即可完成該步。「多久了」保留約 N＋單位、剛才／時段快捷、EMT 細調，且最後一次操作為準。摘要仍只有一欄「主訴」，從摘要編輯可跳到對應子步。若需新 step id，在本票內用 expand–contract，保持測試可綠。

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Interview navigates chief complaint as where/what → quality → duration
- [x] 「同哪裡不舒服」 is exclusive and alone completes the quality step
- [x] Duration page supports numeric amount+unit, period/剛才 shortcuts, and optional EMT refine
- [x] Latest numeric vs period action wins in stored state/summary
- [x] Summary still shows one 主訴 row and edit jumps to the relevant sub-step
- [x] CaseSession tests cover the split flow and new quality option

## Answer

- Added `chief_complaint_duration` step; quality then duration
- Exclusive 「同哪裡不舒服」 quality option
- Duration keeps numeric/units/period/EMT refine; summary still one 主訴 row

