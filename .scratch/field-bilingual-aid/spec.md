Status: ready-for-agent
Type: spec
Feature: field-bilingual-aid

# Field Bilingual Aid — Spec

## Problem Statement

在救護現場，救護人員常遇到傷病患或家屬不會中文（或中文不足以完成問診）的情況。現場需要快速問清主訴與基本病史，但手邊缺乏可離線使用、可讓對方用手指選、又能立刻彙整成交接摘要的雙語工具。現有做法多靠手比、翻譯 App 或臨時找人翻譯，節奏慢、資訊易漏、也不便交接。

## Solution

提供一個**離線優先的平板 PWA**：救護人員操作，傷病患／友人／家屬只負責指選。畫面**同屏雙語**（中文為錨＋可選第二語）。流程依口訣走完 **主訴 → 之前 → 吃 → 過 → 藥 → 敏 → 感**，結束產出**本機結構化摘要**供檢視與複製；新案件或結束即清除，不留歷史。工具定位為**溝通輔助**，不是救護技術、評估或診斷。

## User Stories

1. As a救護人員, I want to open the tool on a tablet without relying on network, so that I can use it in basements, rural areas, or dead zones.
2. As a救護人員, I want a short disclaimer that this is a communication aid only, so that the tool is not mistaken for clinical assessment software.
3. As a救護人員, I want the disclaimer visible on start and on the summary without an extra confirm tap each case, so that it does not slow the call.
4. As a救護人員, I want to choose a second language before starting the interview, so that the patient-facing side matches who I am talking to.
5. As a救護人員, I want Chinese always shown alongside the second language, so that I can operate while the other person reads their language.
6. As a救護人員, I want MVP second languages English, Vietnamese, and Indonesian, so that common traveler and migrant-worker encounters are covered first.
7. As a救護人員, I want later expansion paths for Japanese, Korean, Filipino, and Thai, so that the catalog can grow without redesigning the flow.
8. As a救護人員, I want to select who is answering (本人／家屬／友人／其他) at the start, so that handoff notes reflect information quality.
9. As a救護人員, I want to change the informant mid-case, so that I can switch when the patient becomes able to answer.
10. As a傷病患或家屬, I want large tappable options on one question per screen, so that I can point without operating the device.
11. As a救護人員, I want to keep exclusive control of navigation and selection confirmation, so that gloves, stress, and device handling stay with me.
12. As a救護人員, I want 主訴 step 1 to combine a body map with “what is wrong” categories, so that location and complaint type are captured together.
13. As a傷病患或家屬, I want large body-map hotspots, so that I can point to where it hurts even under stress.
14. As a救護人員, I want optional body-region drill-down after a coarse body tap, so that laterality or sub-region can be refined without an anatomy lesson.
15. As a救護人員, I want non-localized complaints (e.g. generalized weakness, seizure) to skip body drill-down, so that the flow does not force a false location.
16. As a救護人員, I want 主訴 step 2 to capture symptom quality and time, so that I know how it feels and since when.
17. As a傷病患或家屬, I want time choices as duration buckets or period buckets (e.g. about 20 minutes, this morning, yesterday), so that I can answer without typing a clock time.
18. As a救護人員, I want to optionally refine time after the coarse choice, so that the summary can be more precise when needed without blocking the patient.
19. As a救護人員, I want a 1–10 pain scale only when the complaint is pain, so that non-pain complaints are not mislabeled as pain scores.
20. As a傷病患或家屬, I want the pain scale presented with clear large controls and supporting visuals, so that pointing to a number is easy.
21. As a救護人員, I want to ask 之前 (what they were doing before onset) with a short multi-select list plus 其他／不知道, so that pre-onset context is captured without free typing by the patient.
22. As a救護人員, I want to ask 吃 (last oral intake) with coarse time choices, so that last meal timing is available for handoff.
23. As a救護人員, I want to ask 過 (past illnesses) from a short common list plus 無／其他／不知道, so that major history is gathered quickly.
24. As a救護人員, I want to ask 藥 (medications) from a short common class list plus 無／其他／不知道, so that medication risk is flagged without a pharmacy database.
25. As a救護人員, I want to ask 敏 (allergies) for food or drug allergy with common follow-ups plus 無已知過敏／不知道, so that allergy status is explicit.
26. As a救護人員, I want to ask 感 as one additional scan of accompanying symptoms and optional second body-map pass, so that I catch symptoms beyond the chief complaint without restarting the whole interview.
27. As a傷病患或家屬, I want a clear “沒有其他／不知道” option on 感, so that I can finish when nothing else is wrong.
28. As a救護人員, I want every question to allow 不知道／跳過／無法回答, so that the summary never fakes certainty.
29. As a救護人員, I want skipped or unknown answers clearly marked in the summary, so that I can distinguish confirmed vs not obtained.
30. As a救護人員, I want multi-select where clinically natural (e.g. past history, meds, accompanying symptoms), so that more than one relevant item can be recorded.
31. As a救護人員, I want an 其他 path that lets me type a short local note, so that uncommon answers are not lost while patients still never have to type.
32. As a傷病患或家屬, I want pictograms on key questions (body, pain quality, severity, common event/activity types), so that literacy or imperfect second-language still allows pointing.
33. As a救護人員, I want mostly text (bilingual) for 過敏／用藥／病史 detail, so that misleading medical cartoons are avoided.
34. As a救護人員, I want to move freely back and forth between steps, so that wrong taps and later corrections are cheap.
35. As a救護人員, I want to jump from the summary back into a field to edit it, so that I can fix one item before copy/handoff.
36. As a救護人員, I want a one-screen structured Chinese-primary summary of informant, 主訴, 之前, 吃, 過, 藥, 敏, and 感, so that I can read and hand off quickly.
37. As a救護人員, I want to copy the summary to the clipboard, so that I can paste into whatever record tool I use manually.
38. As a救護人員, I want finishing a case or starting a new case to clear all answers immediately, so that the next crew or next patient never sees prior PHI.
39. As a救護人員, I want no case history stored on device in v1, so that a lost tablet does not accumulate interviews.
40. As a救護人員, I want question catalogs and language packs preloaded for offline use, so that a dead network does not break the interview.
41. As a maintainer, I want online use only for content updates later, so that field operation stays offline-first.
42. As a maintainer, I want Chinese to be the source strings for the catalog, so that clinical wording is edited in one place and other languages follow.
43. As a maintainer, I want short option lists that can grow later, so that v1 ships fast and field feedback can expand 過／藥／敏／之前 items.
44. As a developer, I want all interview behavior concentrated behind a CaseSession seam, so that flow rules can be tested without a browser.
45. As a developer, I want the UI to be a thin adapter over CaseSession, so that PWA chrome does not own business rules.
46. As a救護人員, I want the tool to run as an installable/offline-capable web app on mixed tablets, so that iPad and Android can share one codebase.
47. As a救護人員, I want progress through the mnemonic visible without clutter, so that I know what is left under time pressure.
48. As a救護人員, I want the summary to show when informant changed mid-case in a simple way, so that mixed-source answers are not silently blended.
49. As a clinical reviewer, I want v1 to stay limited to communication and information assembly, so that the product does not claim assessment completeness.
50. As a future user, I want advanced assessment modules to be addable later, so that v1 depth stays intentional.

## Implementation Decisions

- **Product name / slug:** Field Bilingual Aid / `field-bilingual-aid`.
- **Client shape:** Offline-first PWA (tablet-first). No native app shell in v1.
- **Primary test seam:** `CaseSession` — pure interview/case engine (no DOM). Owns second-language selection, informant, step navigation, answers including skip/unknown, pain-scale gating, time coarse/fine handling, summary building, and case clear. UI, static catalog JSON, and service worker are adapters.
- **Catalog as data:** Question steps, option lists, and translations live as versioned data with Chinese as source; MVP locales: `zh` + `en` / `vi` / `id`. Structure must allow later `ja` / `ko` / `fil` / `th`.
- **Flow skeleton:** Informant → 主訴 (two steps) → 之前 → 吃 → 過 → 藥 → 敏 → 感 → Summary.
- **主訴 step 1:** Body map + complaint-type categories (merged). Drill-down only when localization applies.
- **主訴 step 2:** Quality + time (duration or period). Pain scale 1–10 only if complaint type is pain.
- **List questions (之前／過／藥／敏):** Short common multi-select lists + 無/其他/不知道 as appropriate; EMT local note for 其他.
- **感:** Single extra pass of accompanying symptoms + optional body map; includes 沒有其他／不知道; not an infinite restart of 主訴.
- **Summary:** Chinese-primary structured local view; clipboard copy; edit-via-jump-back; clear on new/finish.
- **Privacy:** No persisted case history in v1; in-memory (or equivalent session-only) state wiped on new case / finish.
- **Disclaimer:** Visible on start and summary; no mandatory acknowledge gate per case.
- **Content update path:** Design for later online catalog refresh; v1 may ship fully bundled with no updater UI yet.
- **Domain vocabulary to prefer:** 主訴, 之前, 吃, 過, 藥, 敏, 感, 答題者, 第二語, 同屏雙語, 本機摘要, CaseSession. Avoid calling this SAMPLE/OPQRST in product UI unless useful internally as aliases.

## Testing Decisions

- Good tests assert **external behavior of `CaseSession`**: given commands/events, resulting state and summary content are correct. Do not test React/DOM internals, CSS, or service-worker implementation details for domain rules.
- Cover at least: flow order; skip/unknown marking; informant change; pain scale shown only for pain; non-localized complaints skip body drill-down; duration vs period time; summary includes confirmed vs not-obtained; clear wipes state; multi-select + 其他 note behavior; 感 is single pass.
- Catalog/locale resolution may be tested as pure functions if kept separate, but prefer exercising them through `CaseSession` where practical (one seam).
- Prior art: none in this repo yet (greenfield). Establish the CaseSession test harness as the first testing pattern.
- No requirement for end-to-end browser tests in v1; manual tablet check is enough for PWA shell.

## Out of Scope

- Cloud sync, accounts, case history, analytics identifying patients
- Hospital / ePCR system integration and share-sheet export beyond clipboard
- Full advanced assessment modules (vitals coaching, pediatric/pregnancy branches, etc.) as v1 requirements
- Native iOS/Android store apps
- Machine translation at runtime; speech recognition; camera
- Exhaustive medication/allergy databases
- Mandatory per-case legal acknowledgement flows
- Non-pain 1–10 scales; 0–10 vs 1–10 bikeshedding beyond the locked 1–10 pain-only choice
- Authoring CMS for translations in v1

## Further Notes

- Grilling consensus backup: `.scratch/field-bilingual-aid/grilling-consensus.md`.
- Confirmed test seam: single `CaseSession` engine.
- Issue tracker for this repo: local markdown under `.scratch/` (see `docs/agents/issue-tracker.md`).
- First implementation should prefer shipping Chinese+English end-to-end, then add Vietnamese and Indonesian packs without changing flow logic.
