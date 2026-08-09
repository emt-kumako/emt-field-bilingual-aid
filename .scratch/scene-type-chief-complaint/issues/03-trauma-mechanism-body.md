# 03 — 創傷機轉 → 身體圖

**What to build:** Scene type 為創傷時，主因先走機轉頁：OHCA 置頂可勾（仍繼續問機轉）→ 因／非因交通事故 → 因交通則四車種（汽車／機車／腳踏車／行人）後進身體圖；非交通則傷類清單（墜落可填公尺並顯示英制、燒燙傷只勾不填度／％）。高能量少數欄由救護員操作、畫面雙語確認。下一頁沿用既有身體圖。

**Blocked by:** 01 — Scene type 開場閘門

**Status:** resolved

- [x] 創傷 OHCA 置頂可勾，仍可走因／非因交通分支
- [x] 因交通：僅四車種單選後進入身體圖
- [x] 非交通：傷類清單；無四車種
- [x] 墜落高度以公尺為準並帶出英制對照；燒燙傷僅勾選
- [x] 機轉完成後身體圖步驟可用既有 Body selection
- [x] 軟 Gate：交通未選車種等不可 Next；Back／不知道／跳過仍可用
- [x] CaseSession 測試覆蓋兩條創傷分支

## Answer

- Trauma primary: mechanism stage (OHCA toggle → traffic/non-traffic → vehicle or injury+optional fall meters) then body stage (existing Body selection).
- Gate codes: `need_trauma_mechanism` / `need_trauma_vehicle` / `need_body_location`.
- Vitest 50 passed; typecheck clean.
