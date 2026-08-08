Status: ready-for-agent
Type: spec
Feature: interview-ux-pass

# Interview UX Pass — Spec

## Problem Statement

救護現場雙語溝通輔助需要在開場、版面與多語上定稿，並擴充德語、法語、西班牙語，使更多傷病患／家屬能以指選完成主訴與口訣問診。現有流程已能跑通，但開場應拆頁、雙語主客與國旗辨識需一致，且十種第二語的用語必須完整、正確、適合現場，並在常見裝置寬度下不爆版、不裁字。

## Solution

完成 **Interview UX Pass**：開場兩頁（選語言 → 正在回答問題的是）；語言鈕「國旗＋原名／中文」；十語（英越印菲泰日韓德法西）全量同屏雙語且主客互換；德／法／西一次進齊題庫；保留可捲版面、身體圖規則、主訴三步、吃／過修正；另以全語用語審視＋三寬度×十語密度驗收收斂。

## User Stories

1. As a救護人員, I want the first screen to only choose language, so that opening has one job per page.
2. As a傷病患或家屬, I want language buttons showing flag(s) then native name on top and Chinese below, so that I can spot my language fast.
3. As a救護人員, I want English as one button with 🇺🇸🇬🇧, so that US/UK readers share one catalog.
4. As a救護人員, I want Spanish as one button with 🇪🇸🇲🇽 and one `es` catalog, so that Iberian and LatAm readers share wording.
5. As a救護人員, I want German 🇩🇪 and French 🇫🇷 on the picker, so that European encounters are covered.
6. As a救護人員, I want languages ordered en, vi, id, fil, th, ja, ko, de, fr, es, so that high-frequency SE Asian languages stay near the top.
7. As a救護人員, I want the second start page titled「正在回答問題的是：」with 本人／家屬／有人／其他, so that informant selection is clear.
8. As a傷病患或家屬, I want informant options bilingual in the selected second language (primary) and Chinese (secondary), so that pointing matches the chosen language.
9. As a救護人員, I want Next on language disabled until a language is chosen, so that informant always has a second language.
10. As a救護人員, I want Back from informant to language without wiping the case, so that corrections are cheap.
11. As a傷病患或家屬, I want every bilingual interview control to put the second language above Chinese, so that pointing language is primary.
12. As a救護人員, I want the summary Chinese-primary, so that local handoff stays readable.
13. As a救護人員, I want de/fr/es catalogs complete with no missing strings, so that switching language never blanks options.
14. As a傷病患 speaking German, I want polite Sie short phrases, so that address stays appropriate under stress.
15. As a傷病患 speaking French, I want polite vous short phrases, so that address stays appropriate under stress.
16. As a傷病患 speaking Spanish, I want neutral ES/LatAm short phrases, so that one catalog serves both flag audiences.
17. As a救護人員, I want free scrolling on phone/tablet/web with sticky transparent actions, so that long bilingual pages stay usable.
18. As a傷病患或家屬, I want no hidden or line-clamped bilingual secondary text, so that meaning is never cropped.
19. As a救護人員, I want zoom lock kept, so that accidental pinch does not break targets.
20. As a救護人員, I want body list below 768px and body map at/above 768px, so that pointing fits the glass size.
21. As a傷病患 with pain/bleeding/trauma, I want body location required, so that localized problems are captured.
22. As a傷病患 with breathing/weakness/dizziness/seizure/nausea/other, I want body location optional, so that non-localized complaints are not blocked.
23. As a救護人員, I want 主訴 as where/what → how it feels → how long, so that each screen has one job.
24. As a傷病患或家屬, I want exclusive「同哪裡不舒服」, so that matching the chief complaint is one tap.
25. As a救護人員, I want duration numeric/units, 剛才/period shortcuts, and optional EMT refine with last-write-wins, so that time answers stay flexible.
26. As a救護人員, I want intake as yesterday/today meals + other/don’t know (single-select), so that last meal matches field talk.
27. As a救護人員, I want past history titled 過（過去病史） with dialysis left/right mutex and 精神疾病, so that common history is captured.
28. As a救護人員, I want one summary 主訴 row with edit into the right sub-step, so that handoff stays compact but fixable.
29. As a language reviewer, I want a dedicated pass over all ten second languages for grammar, correctness, and field fitness, so that bad phrases do not ship.
30. As a maintainer, I want language-QA findings fixed in catalog strings before the UX pass is marked complete, so that acceptance includes wording quality.
31. As a maintainer, I want density acceptance at 390/768/1180 × ten languages on key screens, so that layout regressions are caught.
32. As a developer, I want CaseSession as the only domain test seam, so that flow rules stay testable without DOM.
33. As a developer, I want locale completeness to require zh plus all ten second languages, so that gaps fail loudly.
34. As a救護人員, I want offline PWA, disclaimer, 之前／藥／敏／感, and clear-on-new-case preserved, so that core product behavior does not regress.
35. As a clinical reviewer, I want the tool to remain a communication aid only, so that no assessment claims are added.
36. As a救護人員 editing informant from summary, I want to land on the informant page when language is already set, so that common fixes take fewer taps.

## Implementation Decisions

- **Feature slug:** `interview-ux-pass`.
- **Primary test seam:** `CaseSession` only.
- **SecondLanguage expansion:** add `de`, `fr`, `es` alongside en, vi, id, ja, ko, fil, th. Every `BilingualText` / catalog string must include all ten.
- **Picker order:** en, vi, id, fil, th, ja, ko, de, fr, es.
- **Flags:** picker only; top line flag(s)+native, bottom Chinese; en 🇺🇸🇬🇧; es 🇪🇸🇲🇽; de 🇩🇪; fr 🇫🇷.
- **Start flow:** two pages (language → informant). Domain may keep `start` until `beginInterview`; UI phase is acceptable.
- **Informant:** title「正在回答問題的是：」; options 本人、家屬、有人、其他 (user-facing; existing id `friend` may map to 有人).
- **Register:** de Sie; fr vous; es neutral; short field phrases.
- **Language QA:** dedicated ticket after catalogs land; produce issue list + copy fixes; pass not complete until fixed.
- **Acceptance:** 390 / 768 / 1180 × 10 langs; screens: start language, start informant, chief complaint+body, quality, duration, one mnemonic list, 感, summary.
- **Prior landed work:** layout unlock, bilingual primacy, body rules, chief-complaint split, intake meals, past-history additions may already exist; tickets should gap-fill (locales, start polish, QA, density) rather than blindly rewrite.
- **Domain vocabulary:** 主訴, 怎麼不舒服, 多久了, 同哪裡不舒服, 正在回答問題的是, 之前, 吃, 過（過去病史）, 藥, 敏, 感, 第二語, CaseSession.

## Testing Decisions

- Good tests assert CaseSession external behavior and locale completeness (no missing second-language strings). Do not unit-test emoji rendering, sticky CSS, or scroll metrics.
- Cover: beginInterview needs language+informant; body required/optional; quality exclusive shortcut; quality→duration; intake single-select meals; dialysis mutex; summary one 主訴; completeness for de/fr/es and all catalogs.
- Language QA is human/content review; regressions after fixes are guarded by completeness + spot session tests, not NLP assertions.
- Density/layout/flag order verified by manual acceptance matrix.
- Prior art: existing CaseSession / list-step / chief-complaint / summary / locale-completeness tests.

## Out of Scope

- Additional languages beyond the ten second languages
- Separate US vs UK or ES vs MX catalogs (flags only differentiate recognition)
- Cloud sync, case history, ePCR integration
- Unlocking pinch-zoom
- Native apps, speech, camera, runtime machine translation
- Clinical assessment modules

## Further Notes

- Grilling consensus is stored beside this spec.
- Ticket stage must include an explicit all-language wording review, not only engineering completeness.
