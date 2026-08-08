# 03 — 主訴第一步（身體圖＋怎麼了）

**What to build:** 主訴 step 1 end-to-end: same-screen bilingual UI where the patient/family points at a body map and “what is wrong” categories while the EMT operates. CaseSession records answers, allows skip/unknown, supports coarse→optional drill-down, and skips body drill-down for non-localized complaints. Ship Chinese + English catalog for this step.

**Blocked by:** 02 — Start: second language + informant + disclaimer

**Status:** resolved

- [x] EMT can complete 主訴 step 1 via CaseSession with body region + complaint-type answers
- [x] Skip/unknown is available and marked as not obtained
- [x] Non-localized complaint types do not require body drill-down
- [x] UI shows Chinese + selected second language on the same screen with large tap targets
- [x] Tests cover localized vs non-localized paths and skip behavior

## Answer

- Catalog: `src/catalog/chief-complaint-1.ts` (zh+en complaint types + body regions/subregions)
- CaseSession: `toggleComplaintType` / `toggleBodyRegion` / drill-down / skip / unknown / `completeChiefComplaint1`
- Non-localized (無力、暈眩、抽搐、噁心) skips body requirement; localized needs ≥1 region
- UI: same-screen bilingual body map + categories; optional fine-location screen
- 11 tests green
