# 07 — 離線 PWA 殼（預載／可離線開）

**What to build:** Package the working interview as an offline-capable PWA so a tablet can open the already-loaded app and run the full flow without network. Catalog/language assets used by the MVP path are preloaded. Online catalog update UI can stay minimal or absent.

**Blocked by:** 06 — 感＋本機摘要＋複製＋結束清除

**Status:** resolved

- [x] App is installable / add-to-home-screen capable as a PWA (or documented equivalent on target tablets)
- [x] After first load, the full zh+en interview path works with network disabled
- [x] Bundled catalogs/language packs needed for the MVP path are available offline
- [x] Offline behavior is manually verifiable on a tablet or browser offline mode

## Answer

- `public/manifest.webmanifest` + SVG icon + `public/sw.js` (install precache + runtime cache)
- `main.ts` registers `./sw.js`; catalogs/locales live in the JS bundle so they are offline after first load
- Verify: `npm run build && npm run preview` → load once → Network Offline → full flow; Install / 加入主畫面 per README
- No online catalog updater in v1
