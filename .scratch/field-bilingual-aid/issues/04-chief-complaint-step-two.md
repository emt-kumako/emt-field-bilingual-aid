# 04 — 主訴第二步（性質＋時間＋痛尺）

**What to build:** 主訴 step 2 end-to-end: symptom quality, time as duration or period (coarse patient choice + optional EMT refine), and a 1–10 pain scale only when the complaint is pain. Completing steps 1–2 yields a finished 主訴 in CaseSession and on screen (zh+en).

**Blocked by:** 03 — 主訴第一步（身體圖＋怎麼了）

**Status:** resolved

- [x] Quality + time answers can be recorded; time supports duration buckets and period buckets
- [x] EMT can optionally refine time without blocking the pointing flow
- [x] Pain scale 1–10 appears only for pain complaints; non-pain skips the pain scale
- [x] Skip/unknown works on this step
- [x] Tests cover pain vs non-pain gating and duration vs period time

## Answer

- Catalog: `src/catalog/chief-complaint-2.ts` (quality, duration/period buckets, zh+en)
- CaseSession: `toggleQuality` / `selectTimeBucket` / `setTimeRefine` / `setPainScore` / skip / unknown / `completeChiefComplaint2` → `before`
- Pain scale gated by step-1 complaint type `pain`
- UI: bilingual quality + time; EMT refine input; pain 1–10 when applicable
- 15 tests green
