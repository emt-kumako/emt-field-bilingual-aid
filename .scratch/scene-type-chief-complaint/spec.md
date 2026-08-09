Status: ready-for-agent
Type: spec
Feature: scene-type-chief-complaint

# Scene type + chief complaint redesign — Spec

## Problem Statement

紙本「現場狀況」把求救分成創傷／非創傷與主／次要原因，但 App 仍用通用主訴類型＋伴隨「感」，無法對齊後續登打，也無法在開場就分支現場大類。胸悶／胸痛缺少可指選的 OPQRST 現病史；創傷機轉與高能量少數欄位也沒有對應的雙語確認流程。

## Solution

在答題者 Start 頁同頁必選 **Scene type**（創傷／非創傷），其後「哪裡不舒服」走分支精簡雙語目錄作為**主要原因**；流程末端「還有其他感覺不舒服的地方」收**次要原因**（非創傷與創傷次要清單不同）。非創傷胸悶／胸痛進入 OPQRST 額外頁，其 T 直接寫入 chief complaint duration 並跳過共用「多久了」。創傷走 OHCA／因非因交通／車種或傷類→身體圖。摘要主訴併成一段敘事（明文含 Scene type）；次因獨立成欄。行為一律經 CaseSession `apply`／`viewFacts` 可測。

## User Stories

1. As a 救護人員, I want to choose 創傷 or 非創傷 on the same page as the Informant, so that the interview catalog branches before pointing begins.
2. As a 救護人員, I want Next disabled until both Informant and Scene type are chosen, so that the Case never enters interview without a branch.
3. As a 傷病患或旁人, I want Scene type options bilingual with second-language primacy, so that I can confirm the scene branch.
4. As a 救護人員, I want to change Scene type mid-case, so that a wrong first tap is recoverable.
5. As a 救護人員, I want changing Scene type to clear primary／secondary-related answers while keeping 之前／吃／過／藥／敏 when already filled, so that I do not re-ask the whole history block.
6. As a 救護人員, I want「哪裡不舒服」to capture the PCR primary reason for the chosen Scene type, so that later charting matches the field form.
7. As a 傷病患, I want a flat non-trauma primary list without 急病／一般疾病 section headers, so that pointing stays one scannable layer.
8. As a 救護人員, I want non-trauma primary to include 其他 with a short note, so that uncommon presentations are not forced into a wrong code.
9. As a 救護人員, I want OHCA pinned at the top of non-trauma primary and allowable alone, so that arrest is not buried and need not pair with another reason.
10. As a 救護人員, I want primary reason single-select and required before Next, so that the Case has one chief-complaint anchor.
11. As a 救護人員, I want selecting non-trauma 胸悶／胸痛 to open an OPQRST page, so that chest presentations get a structured history.
12. As a 傷病患, I want OPQRST O as sudden vs gradual taps, so that onset is pointed not typed.
13. As a 傷病患, I want OPQRST P as whether position change or medication relieves symptoms, so that provocation／palliation can be confirmed when known.
14. As a 傷病患, I want OPQRST Q as stabbing／pressure／colicky taps, so that quality is bilingual-pointable.
15. As a 傷病患, I want OPQRST R as coarse chest-related locations, an optional radiation toggle, and common radiation sites, so that radiation is captured without a full body map.
16. As a 傷病患, I want OPQRST S as a single 0–10 control with color bar and face emojis as reference only, so that severity is an integer score patients understand.
17. As a 救護人員, I want the pain-scale UI to omit Mild／Severe-style captions and large English tool titles, so that the screen stays dense and bilingual-clean.
18. As a 救護人員, I want a small on-screen citation to the emoji pain-scale source article, so that the reference is auditable.
19. As a 傷病患, I want OPQRST T pattern taps for intermittent vs continuous, so that time character is pointed.
20. As a 救護人員, I want OPQRST T approx duration as 約 __ with 分鐘／小時／天 like the duration step, so that numeric time matches existing duration UX.
21. As a 救護人員, I want OPQRST T to offer 時間不詳, so that unknown time does not block the page.
22. As a 救護人員, I want OPQRST T to write the chief complaint duration answer directly and skip the shared duration step, so that time is not asked twice and results do not diverge.
23. As a 救護人員, I want OPQRST Next soft-gated on O／Q／S／T while P／R may stay empty, so that essential chest history is present without over-blocking.
24. As a 救護人員, I want unknown／skip／back to remain available under soft gates on OPQRST, so that field recovery stays possible.
25. As a 救護人員, I want non-chest paths to keep shared duration in most cases, so that time is still collected when OPQRST did not run.
26. As a 救護人員, I want quality／pain score to appear only when conditional for non-OPQRST paths, so that redundant quality pages are avoided where the primary code already speaks.
27. As a 救護人員, I want trauma primary to pin OHCA at top while still collecting mechanism afterwards, so that arrest is the anchor and mechanism remains context.
28. As a 救護人員, I want trauma mechanism to start with 因／非因交通事故, so that the traffic branch matches the PCR form.
29. As a 救護人員, I want traffic cases to then single-select 汽車／機車／腳踏車／行人 only, so that vehicle class is chartable without an “other vehicle” clutter path.
30. As a 救護人員, I want traffic vehicle selection to advance to the existing body map next, so that injury locations are pointed after mechanism.
31. As a 救護人員, I want non-traffic trauma to show an injury-type list on the mechanism page, so that fall／drown／burn／etc. are chosen without vehicle options.
32. As a 救護人員, I want fall height enterable immediately in meters with an imperial conversion shown, so that high-energy falls are captured at the scene.
33. As a 救護人員, I want burn as checkbox only without degree or TBSA percent, so that appraisal-heavy fields stay out of the pointing aid.
34. As a 救護人員, I want high-energy minority fields operated by crew with bilingual on-screen confirmation, so that bystanders can affirm without multilingual typing.
35. As a 傷病患, I want trauma body locations collected on the existing body map after mechanism, so that detailed anatomy remains available for later charting elsewhere.
36. As a 救護人員, I want secondary「還有其他感覺不舒服的地方」multi-select and skippable, so that accompanying reasons are optional.
37. As a 救護人員, I want non-trauma secondary to reuse the non-trauma primary catalog minus OHCA, so that combinations like unconsciousness plus dyspnea／fever are chartable.
38. As a 救護人員, I want trauma secondary to be a short trauma-sensation catalog only, so that mechanism and body map are not repeated at the end.
39. As a 救護人員, I want the summary 主訴 as one narrative that explicitly includes 創傷／非創傷, so that pasted notes map to the PCR scene column.
40. As a 救護人員, I want summary secondary as its own section titled for「還有其他感覺不舒服的地方」, so that secondary charting is obvious.
41. As a 傷病患或旁人, I want on-screen summary bilingual with second-language primacy, so that I can reconfirm the narrative.
42. As a 救護人員, I want clipboard summary to stay Chinese-only and omit the footer disclaimer per existing product rules, so that paste stays chart-ready.
43. As a 開發者／agent, I want all branching, gates, clears, and summary assembly observable through CaseSession `apply`／`viewFacts`, so that DOM is only an adapter.
44. As a 開發者／agent, I want Option selection and Body selection reused rather than forked, so that exclusive／multi／body rules stay one place.
45. As a 開發者／agent, I want Scene type and OPQRST chest path named in the domain glossary, so that later agents do not reinvent terms.
46. As a 救護人員, I want locale-complete bilingual strings for new catalogs and OPQRST chrome, so that no second-language line blanks.
47. As a 救護人員, I want finish／新案件 to clear Scene type with the Case, so that the next encounter starts clean.
48. As a 救護人員, I want Back from early interview to return to the informant＋Scene type Start page when language is set, so that opening corrections stay cheap.

## Implementation Decisions

- **Primary seam:** CaseSession via `apply(state, intent)` and `viewFacts(state)`. No second orchestration seam.
- **Scene type** is Case state (`trauma` | `non_trauma` | null) chosen on Start phase `informant` screen alongside Informant; gate requires both before leaving Start.
- **Glossary additions (implement with the feature):** Scene type; OPQRST chest page (non-trauma 胸悶／胸痛 only); primary reason／secondary reason as the product meaning of the first discomfort step and final other-discomfort step under this redesign.
- **Catalogs:** Separate simplified bilingual catalogs for non-trauma primary, trauma mechanism／injury types, trauma sensations (secondary), plus OPQRST option sets. Flat non-trauma list (no section headers). Exact option ids／full locale table may be filled during implementation from the PCR form + consensus, but must stay locale-complete.
- **Primary step:** Replaces／repurposes the current chief-complaint-1 “where／what” entry as Scene-type-branched primary reason (single-select). Trauma splits into mechanism page then existing Body selection page.
- **OPQRST:** Dedicated interview step after non-trauma chest primary. Fields O／P／Q／R／S as taps; S is integer 0–10 with reference faces／color bar only. T writes the **same** chief complaint duration answer detail the shared duration step would (pattern＋approx unit value or unknown); navigation skips `chief_complaint_duration` when that answer is already satisfied via OPQRST.
- **Soft Gate reasons:** Stable codes for missing Scene type, missing primary, incomplete trauma mechanism (e.g. traffic without vehicle), incomplete OPQRST (missing O／Q／S／T). Soft only.
- **Scene type change:** Clears primary／OPQRST／trauma mechanism／body／secondary／duration tied to chief complaint path as needed; keeps history mnemonic answers when present.
- **Secondary step:** Repurposes final other-symptoms／感 slot toward secondary reason UI copy「還有其他感覺不舒服的地方」with Scene-type-specific catalogs (non-trauma list minus OHCA; trauma sensations only).
- **Quality／duration:** Keep conditional quality for non-OPQRST paths as a later-detail matrix may remain partial; duration remains for non-OPQRST paths. Chest OPQRST path does not also show shared duration.
- **Summary:** Build one 主訴 narrative string pair `{ zh, other }` including Scene type wording; secondary section separate. `formatSummaryText` Chinese-only; no disclaimer paragraph.
- **Supporting pure helpers (not new orchestration seams):** meters↔imperial display for fall height; pain-scale presentation facts for 0–10. Reuse Option selection and Body selection.
- **DOM adapter:** Paints `viewFacts`, maps gate codes to copy, owns assets for faces／color bar and citation link visibility; does not own branch rules.
- **Consensus source:** `.scratch/scene-type-chief-complaint/grilling-consensus.md` (confirmed 2026-08-09, including T duration carry-in refinement).

## Testing Decisions

- Good tests assert external behaviour through CaseSession: state after `apply`, `viewFacts.gate`, screen discriminators, duration slot filled by OPQRST T, skip of duration step, Scene type change clears, summary narrative／secondary section Chinese copy — not DOM HTML or CSS.
- **Primary module under test:** CaseSession (`apply`／`viewFacts`) for Start＋Scene type, trauma／non-trauma primary flows, OPQRST gates and duration carry-in, secondary catalogs branch, summary facts.
- **Supporting tests:** Option selection／Body selection only if new call patterns need coverage; locale-completeness for new catalogs／UI copy; pure conversion helper for meters／imperial if non-trivial.
- **Prior art:** `orchestrate.test.ts`, chief-complaint／duration／other-symptoms／summary／locale-completeness suites — extend these rather than invent a parallel harness.
- Visual acceptance of pain-scale faces／color bar and density is manual; unit tests only check score value and that citation／chrome flags exist in facts or copy constants as appropriate.

## Out of Scope

- Full PCR clone (police on scene, vehicle damage details, burn degree／%, dual-column layout).
- Complete conditional matrix for every non-chest quality trigger (may ship a minimal conditional set; full matrix is follow-up).
- Redesigning history mnemonic steps (之前／吃／過／藥／敏) beyond preserve-on-Scene-type-change.
- Changing bilingual primacy or clipboard-Chinese rules.
- Native-speaker QA of all ten locales beyond completeness checks.
- GitHub Pages deploy unless separately requested.

## Further Notes

- Tracker: local markdown under `.scratch/` (`docs/agents/issue-tracker.md`). Triage: `ready-for-agent`.
- Pain-scale reference: https://medicalxpress.com/news/2022-07-emoji-shown-effective-numerical-pain.html
- This supersedes interview-UX-pass mapping of generic chief-complaint types as the long-term primary／secondary model where it conflicts; Start phase remains language → informant, with Scene type added on the informant page.
- Implementation may keep internal step ids stable where practical, but product copy and summary shape must match this spec.
