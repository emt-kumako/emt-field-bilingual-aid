# 救護現場雙語溝通輔助（Field Bilingual Aid）

離線優先 PWA：救護人員操作平板，傷病患／家屬指選。中文為錨；第二語可選英／越／印尼／日／韓／菲／泰。介面以平板閱讀與大觸控為主。

## 開發

```bash
npm install
npm test
npm run dev
```

## GitHub Pages

站點：https://emt-kumako.github.io/emt-field-bilingual-aid/

推送到 `main` 後，Actions 會 `npm run build` 並部署 `dist/`。  
本機預覽仍用相對路徑；Pages 建置會設 `VITE_BASE=/emt-field-bilingual-aid/`。

## 離線／安裝驗證（ticket 07）

1. `npm run build && npm run preview`
2. 用平板或桌面瀏覽器打開 preview URL，先完整載入一次並點進流程（讓 Service Worker 把 JS/CSS 寫入快取）
3. DevTools → Network → Offline（或關掉 Wi‑Fi／行動網路）後重新整理
4. 應仍可走完：開場 → 主訴 → 之前／吃／過／藥／敏 → 感 → 摘要／複製
5. 安裝：瀏覽器「加到主畫面／Install app」（iPad Safari：分享 → 加入主畫面）

`public/sw.js` 負責離線殼；題庫與語言包都打進 JS bundle，離線不需再抓翻譯。

## 語言策略（ticket 08）

- 同屏雙語：`zh` + 選定第二語（`en` / `vi` / `id` / `ja` / `ko` / `fil` / `th`）
- **不做**缺字時默默退回英文；缺字會在開發／測試拋錯（見 `bilingualPair`）
