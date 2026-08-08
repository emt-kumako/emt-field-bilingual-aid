# 01 — 版面解鎖

**What to build:** 手機、平板、網頁問診畫面可整頁自由捲動；底部操作列 sticky 且可觸及；畫面 chrome／操作列背景透明；拿掉矮視窗藏第二語與摘要 line-clamp 裁切；維持鎖縮放。完成後長雙語內容不再被鎖在單一視窗裡。

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Phone / tablet / web no longer use a one-viewport overflow lock for interview content
- [x] Sticky action controls remain reachable while scrolling
- [x] Screen chrome and sticky action backgrounds are transparent (no opaque slab over content)
- [x] Secondary-language hide-on-short-height and summary line-clamp are removed so bilingual text can wrap fully
- [x] Pinch-zoom lock remains in place

## Answer

- Global free page scroll (phone/tablet/web); sticky transparent chrome
- Removed summary line-clamp and short-height hide of bilingual `.sub`
- Zoom lock kept

