# 03 — 身體圖規則＋768 切換

**What to build:** 疼痛、出血、外傷／撞傷必須選部位才能完成主訴第一步；呼吸、無力、暈眩、抽搐、噁心／嘔吐、其他不強制選部位（仍可選填）；寬度 &lt;768 用兩欄部位清單，≥768 用身體圖。規則由 CaseSession／題庫驅動並可測。

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Pain / bleeding / trauma require a body location to complete chief-complaint step 1
- [x] Breathing, weakness, dizziness, seizure, nausea/vomiting, and other do not require body location
- [x] Body location can still be optionally selected when not required
- [x] Viewport &lt;768 shows a two-column body-region list; ≥768 shows the body map
- [x] CaseSession tests cover required vs optional localization behavior

## Answer

- breathing + other_complaint no longer require body; pain/bleeding/trauma still do
- Optional body selection allowed when not required
- &lt;768 body list, ≥768 body map via CSS

