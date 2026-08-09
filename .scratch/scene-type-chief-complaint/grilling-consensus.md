# Grilling consensus — scene type + chief complaint redesign

Status: confirmed  
Date: 2026-08-09

## Problem framing

Map PCR「現場狀況」求救主／次要原因 into the bilingual interview:
- Primary →「哪裡不舒服」
- Secondary →「還有其他不舒服／還有其他感覺不舒服的地方」
- After informant (same page): choose 創傷／非創傷 before interview

## Locked decisions

1. **Catalog strategy:** Branch into simplified bilingual catalogs by 創傷／非創傷 (not side-by-side dual columns). Structure aligns with the form for later charting; not a full PCR clone.
2. **Cardinality:** Primary = single-select required. Secondary = multi-select, skippable.
3. **Start gate:** Informant page also selects 創傷／非創傷; both required before Next.
4. **Change mid-case:** Scene type may change; clears primary/secondary-related answers; history block (之前／吃／過／藥／敏) may keep.
5. **Non-trauma primary:** Flat one-level list + 其他 (no 急病／一般疾病 section headers). OHCA pinned at top; OHCA-only allowed.
6. **Non-trauma chest pain/tightness:** Extra **OPQRST** page after selecting 胸悶／胸痛:
   - O: sudden vs gradual
   - P: position change / meds relieve (optional)
   - Q: stabbing / pressure / colicky
   - R: coarse location + radiation toggle + common radiation sites (no full body map)
   - S: tap 0–10; UI shows only 0–10 marks, color bar, face emojis (no Mild/Severe labels); faces are reference, not a second control
   - T (same semantics as shared duration step; writes the duration answer directly so「多久了」is skipped and already filled):
     - Pattern select: 一陣一陣／一直持續
     - Approx duration like duration page: 約 __ ＋ 分鐘／小時／天
     - Or 時間不詳
     - No other duration UI on this page (no full bucket strip beyond the above)
   - Soft gate: O／Q／S／T; P／R optional; unknown/skip soft rules remain. T satisfied when pattern is chosen and either approx duration or 時間不詳 is set.
   - Skips shared「多久了」; OPQRST T is the duration result (carry-in / same slot), not a parallel copy.
   - Small source note: https://medicalxpress.com/news/2022-07-emoji-shown-effective-numerical-pain.html
7. **Trauma primary page 1:** OHCA pinned (may still collect mechanism). Then 因／非因交通事故:
   - Traffic → vehicle single-select: 汽車／機車／腳踏車／行人 → next page body map
   - Non-traffic → injury-type list; fall height fillable now (meters canonical, show imperial conversion); burn = checkbox only (no degree/%)
8. **Trauma primary page 2:** Existing body map (detailed charting later elsewhere).
9. **High-energy minority fields:** EMT operates fill/select; bilingual on-screen for patient/bystander confirm (not free multilingual typing).
10. **Quality / duration generally:** Duration mostly kept; quality/pain score conditional — except chest OPQRST path above.
11. **Secondary:**
    - Non-trauma: same new non-trauma primary list minus OHCA (e.g. unconscious + dyspnea/fever)
    - Trauma: new short「創傷感受」list (pain, numb, weak, etc.); no second body map / traffic / injury-type round
12. **Summary:** One「主訴」narrative block (must explicitly include 創傷／非創傷). Secondary as separate「還有其他感覺不舒服的地方」for charting alignment. Clipboard remains Chinese-only per existing product rule.

## Out of scope (this consensus)

- Full PCR vehicle/police/burn % fields
- Dual-column form layout in-app
- Exact locale strings / option id tables (later)
- Full conditional matrix for every non-chest quality trigger (later)
