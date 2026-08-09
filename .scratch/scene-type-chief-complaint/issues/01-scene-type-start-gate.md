# 01 — Scene type 開場閘門

**What to build:** 答題者 Start 頁同頁必選創傷／非創傷；Informant 與 Scene type 都選了才能進面談。中途改 Scene type 會清掉主／次因相關答案，之前／吃／過／藥／敏可保留。Case 結束／新案件一併清掉 Scene type。領域 glossary 補上 Scene type。

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Case 上有 Scene type（創傷／非創傷／未選），經 `apply` 寫入、`viewFacts` 可讀
- [x] 答題者頁可雙語選 Scene type；與 Informant 皆必選才 `nextEnabled`
- [x] 改 Scene type 清主／次因相關、保留病史區塊（若已填）
- [x] finish／新案件後 Scene type 為空
- [x] `CONTEXT.md` 有 Scene type 詞條
- [x] CaseSession 測試覆蓋閘門與清除行為

## Answer

- `SceneType` on Case; slot `sceneType`; gate `need_scene_type` after Informant.
- Informant page shows bilingual Scene type; both required to begin interview.
- `setSceneType` clears `SCENE_TYPE_DEPENDENT_STEPS`, keeps history answers.
- Vitest 47 passed; `tsc --noEmit` clean.
