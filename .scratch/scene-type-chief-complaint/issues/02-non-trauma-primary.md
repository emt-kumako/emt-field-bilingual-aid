# 02 — 非創傷主要原因（扁平目錄）

**What to build:** Scene type 為非創傷時，「哪裡不舒服」改為扁平雙語主要原因單選清單（不分急病／一般疾病大標）：OHCA 置頂且允許只選 OHCA、其餘對齊現場狀況精簡項、含其他短註。單選必選才可下一步。十語字串齊全。

**Blocked by:** 01 — Scene type 開場閘門

**Status:** resolved

- [x] 非創傷路徑主因步驟出扁平目錄（無大項分區標題）
- [x] OHCA 置頂；可只選 OHCA
- [x] 主因單選；未選時軟 Gate，Back／不知道／跳過仍可用
- [x] 含「其他」短註路徑
- [x] locale completeness 通過
- [x] CaseSession 測試覆蓋非創傷主因選取與閘門

## Answer

- Catalog `NON_TRAUMA_PRIMARY_REASONS` (OHCA first, flat, +其他 note).
- `sceneType === non_trauma` → single-select via Option selection; no body map on this step.
- Trauma path still uses legacy COMPLAINT_TYPES until ticket 03.
- Vitest 48 passed; typecheck clean.
