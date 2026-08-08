# Field Bilingual Aid — map

## Notes

MVP tickets 01–08 implemented on `main`. Primary seam: `CaseSession`.

## Decisions-so-far

- [01] Harness + CaseSession create/clear — Vitest seam at `src/case-session/`
- [02] Start: second language + informant + disclaimer (no acknowledge gate)
- [03] 主訴 step 1: body map + complaint types; non-localized skips body
- [04] 主訴 step 2: quality + duration/period time; pain 1–10 only for pain
- [05] 之前→吃→過→藥→敏 list steps + EMT 其他 notes + free history chips
- [06] 感 single pass + Chinese-primary summary + copy + clear
- [07] Offline shell via `public/sw.js` + manifest (runtime cache after warm load)
- [08] vi/id required on catalogs; `bilingualPair` throws on missing (no silent EN fallback)

## Fog

- Pictograms / pain supporting visuals still light (body = labeled hotspots)
- SW install precache is shell-only; hashed JS relies on runtime cache after first online visit
- Full mnemonic progress strip and mid-flow informant control not polished
