# 05 — 次要原因（分支目錄）

**What to build:** 流程末端「還有其他感覺不舒服的地方」改為次要原因：多選、可跳過。非創傷＝非創傷主因清單扣除 OHCA；創傷＝精簡「創傷感受」清單（疼痛、麻木、無力等），不再跑機轉／身體圖。

**Blocked by:** 02 — 非創傷主要原因；03 — 創傷機轉 → 身體圖

**Status:** resolved

- [x] 次要步驟文案為「還有其他感覺不舒服的地方」（或共識等同用语）
- [x] 非創傷次要目錄＝主因扁平清單扣 OHCA；多選可跳過
- [x] 創傷次要＝創傷感受精簡清單；無身體圖／交通／傷類重跑
- [x] locale completeness 通過
- [x] CaseSession 測試覆蓋兩條 Scene type 的次要行為

## Answer

- Step id 仍為 `other_symptoms`；文案改為「還有其他感覺不舒服的地方」；detail 改存 `reasonIds`。
- 非創傷：`NON_TRAUMA_SECONDARY_REASONS`（主因扣 OHCA）；創傷：`TRAUMA_SECONDARY_SENSATIONS`；slot `secondaryReason`；gate `need_secondary_reason`。
- 移除次要步驟身體圖；Vitest 54 passed。
