# Field Bilingual Aid — Grilling Consensus

Status: confirmed  
Date: 2026-08-08  
Source: `/grill-me` session

## Product

現場雙語溝通輔助工具（非救護技術、非評估、非診斷）。救護人員操作平板；患者／友人／家屬只負責指選選項。

## Locked decisions

| Topic | Decision |
| --- | --- |
| Operator | EMT 操作；對方只指選 |
| Bilingual display | 同屏雙語（中文為錨＋第二語） |
| MVP second languages | 英文、越南語、印尼語 |
| Later languages | 日、韓、菲、泰 |
| Runtime | 離線優先 PWA；有網才更新題庫 |
| Output | 本機結構化摘要（偏中文給 EMT）；可複製 |
| Persistence | 結束／新案件即清除；無案件歷史、無雲端 |
| Informant | 開始時選答題者；可中途改 |
| Skip | 每題可「不知道／跳過」 |
| Body location | 身體圖＋必要時細分 |
| Pictograms | 僅關鍵題配圖 |
| 主訴 structure | 兩步：① 身體圖＋怎麼了大類 → ② 性質＋時間；疼痛才有 1–10 痛尺 |
| Time answers | 時長或時段；粗選＋EMT 可細調 |
| 過／藥／敏／之前 | 短清單＋其他／不知道；可多選；之後再加項；其他由 EMT 備註 |
| 感 | 一輪伴隨症狀＋身體圖二次掃描；可「沒有其他／不知道」 |
| Navigation | EMT 可自由回改／跳題；摘要可點欄位修正 |
| Disclaimer | 啟動與摘要明顯提示；不強制每次確認 |

## Interview mnemonic (flow order)

1. **答題者** — 本人／家屬／友人／其他  
2. **主訴** — 主要含「怎麼了／哪裡／怎麼不舒服／多久」（怎麼了與哪裡常合併為第一步）  
3. **之前** — 發作／事情發生之前在做什麼  
4. **吃** — 上一餐進食時間  
5. **過** — 過去疾病  
6. **藥** — 服用藥物  
7. **敏** — 食物或藥物過敏  
8. **感** — 除前述外是否還有其他不舒服  
9. **摘要** — 本機檢視／複製／結束清除

## Out of scope (v1)

- 進階評估模組、系統對接、分享匯出、案件歷史  
- 全面配圖、非疼痛痛尺、每次強制免責確認  
- 原生 App 包裝（先 PWA）

## Working name

Field Bilingual Aid（現場雙語溝通輔助）— slug: `field-bilingual-aid`
