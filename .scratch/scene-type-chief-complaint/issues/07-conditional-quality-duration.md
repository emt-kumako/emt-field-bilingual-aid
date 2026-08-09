# 07 — 非 OPQRST 路徑的條件性質／多久收尾

**What to build:** 非胸痛 OPQRST 的路徑仍多走共用「多久了」；「怎麼不舒服／疼痛指數」改為條件出現（本票只做最小可用集合，完整矩陣可後續）。不得讓已走 OPQRST 的胸痛路徑再出現共用多久頁。

**Blocked by:** 02 — 非創傷主要原因；03 — 創傷機轉 → 身體圖；04 — 胸悶／胸痛 OPQRST

**Status:** resolved

- [x] 非 OPQRST 路徑可進入共用 duration（與既有行為對齊或精簡後仍可取得時間）
- [x] 至少一組條件會觸發 quality／疼痛；非觸發項可跳過 quality
- [x] 胸痛 OPQRST 路徑回歸：仍跳過共用多久
- [x] CaseSession 測試覆蓋「有／無 quality」與「有／無跳過 duration」對照

## Answer

- `needsQualityStep`：創傷（身體圖後）與非創傷 `abdominal_pain`／legacy `pain` 進 quality；其餘非 OPQRST 直達 duration；unknown／skip 主因亦直達 duration。
- `abdominal_pain` 顯示疼痛指數；胸痛 OPQRST 仍跳過 quality＋共用多久。
- Vitest 57 passed。
