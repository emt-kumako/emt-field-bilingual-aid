# 05 — 吃：餐次單選

**What to build:** 「吃（上一餐）」改為昨天早餐／午餐／晚餐、今天早餐／午餐／晚餐、其他、不知道；單選；「其他」可 EMT 備註；「不知道」互斥。取代既有小時區間選項；UI 可用昨天／今天分組呈現。

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Intake options are the meal-based set (yesterday/today × breakfast/lunch/dinner + other + don’t know)
- [x] Old hour-bucket intake options are removed from the patient-facing catalog
- [x] Selection is single-select; other opens note; don’t know is exclusive
- [x] All new strings exist for Chinese and all seven second languages
- [x] CaseSession / list-step behavior and summary reflect the new intake answer

## Answer

- Intake replaced with yesterday/today × breakfast/lunch/dinner + other + don’t know
- Single-select; grouped UI under 昨天／今天

