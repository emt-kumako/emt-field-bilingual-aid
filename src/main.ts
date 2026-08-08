import {
  BODY_REGIONS,
  COMPLAINT_TYPES,
  getBodyRegion,
} from "./catalog/chief-complaint-1.js";
import {
  QUALITY_OPTIONS,
  TIME_BUCKETS,
} from "./catalog/chief-complaint-2.js";
import {
  HISTORY_STEP_ORDER,
  getHistoryCatalog,
  isHistoryStep,
  type HistoryStepId,
} from "./catalog/history-block.js";
import { bilingualPair, type BilingualText } from "./catalog/labels.js";
import { ACCOMPANYING_SYMPTOMS } from "./catalog/other-symptoms.js";
import { UI_COPY } from "./catalog/ui-copy.js";
import {
  beginInterview,
  buildSummarySections,
  canBeginInterview,
  canCompleteChiefComplaint1,
  canCompleteChiefComplaint2,
  canCompleteListStep,
  canCompleteOtherSymptoms,
  clearBodyDrilldown,
  clearOtherBodyDrilldown,
  completeChiefComplaint1,
  completeChiefComplaint2,
  completeListStep,
  completeOtherSymptoms,
  createCase,
  editFromSummary,
  finishCase,
  formatSummaryText,
  getChiefComplaint1Detail,
  getChiefComplaint2Detail,
  getListNote,
  getListOptionIds,
  getOtherSymptomsDetail,
  goBackFromChiefComplaint1,
  goBackFromChiefComplaint2,
  goBackFromOtherSymptoms,
  goBackListStep,
  goToStep,
  listStepNeedsNote,
  markChiefComplaint1Unknown,
  markChiefComplaint2Unknown,
  markListStepUnknown,
  markOtherSymptomsUnknown,
  needsBodyLocation,
  returnToSummaryView,
  selectTimeBucket,
  setInformant,
  setListNote,
  setPainScore,
  setSecondLanguage,
  setTimeRefine,
  showsPainScale,
  skipChiefComplaint1,
  skipChiefComplaint2,
  skipListStep,
  skipOtherSymptoms,
  toggleAccompanyingSymptom,
  toggleBodyRegion,
  toggleBodySubregion,
  toggleComplaintType,
  toggleListOption,
  toggleOtherBodyRegion,
  toggleOtherBodySubregion,
  toggleQuality,
  type CaseState,
  type Informant,
  type InterviewStep,
  type SecondLanguage,
} from "./case-session/index.js";
import { DISCLAIMER_ZH } from "./content/disclaimer.js";
import {
  INFORMANT_OPTIONS,
  SECOND_LANGUAGE_OPTIONS,
} from "./content/start-labels.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    void navigator.serviceWorker.register(swUrl).catch(() => undefined);
  });
}

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("#app missing");
}

/** Keep field tablet layout fixed: block pinch-zoom / ctrl-wheel zoom. */
function lockPageZoom(): void {
  const block = (event: Event) => {
    event.preventDefault();
  };
  for (const type of ["gesturestart", "gesturechange", "gestureend"] as const) {
    document.addEventListener(type, block, { passive: false });
  }
  document.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey) event.preventDefault();
    },
    { passive: false },
  );
  document.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length > 1) event.preventDefault();
    },
    { passive: false },
  );
}
lockPageZoom();

let state: CaseState = createCase();

function secondLang(): SecondLanguage {
  return state.secondLanguage ?? "en";
}

function ensureShell(): void {
  if (app!.querySelector("#view")) return;
  app!.innerHTML = `
    <div id="view" class="view"></div>
    <footer class="site-footer" role="contentinfo">
      <p class="footer-disclaimer">${DISCLAIMER_ZH}</p>
      <img
        class="footer-logo"
        src="${import.meta.env.BASE_URL}brand/zxb-logo.png"
        alt="打火 ZXB · ZHONGXINBEI BRANCH"
        width="328"
        height="96"
      />
    </footer>
  `;
}

function getView(): HTMLElement {
  ensureShell();
  const view = app!.querySelector<HTMLElement>("#view");
  if (!view) throw new Error("#view missing");
  return view;
}

/** One-viewport shell: chrome pinned, main fills remaining height. */
function screenLayout(parts: {
  header?: string;
  body: string;
  actions?: string;
}): string {
  return `
    <div class="screen">
      ${parts.header ?? ""}
      <div class="screen-main">${parts.body}</div>
      ${
        parts.actions
          ? `<div class="screen-chrome">${parts.actions}</div>`
          : ""
      }
    </div>
  `;
}

function render(): void {
  ensureShell();
  switch (state.currentStep) {
    case "start":
      renderStart();
      break;
    case "chief_complaint_1":
      renderChiefComplaint1();
      break;
    case "chief_complaint_2":
      renderChiefComplaint2();
      break;
    case "before":
    case "intake":
    case "past_history":
    case "medications":
    case "allergies":
      renderHistoryStep(state.currentStep);
      break;
    case "other_symptoms":
      renderOtherSymptoms();
      break;
    case "summary":
      renderSummary();
      break;
  }
}

function returnSummaryBar(): string {
  if (!state.returnToSummary) return "";
  return `<div class="return-bar"><button type="button" class="secondary" data-action="summary-return">回摘要</button></div>`;
}

function renderHistoryNav(active: HistoryStepId): string {
  const labels: Record<HistoryStepId, string> = {
    before: "之前",
    intake: "吃",
    past_history: "過",
    medications: "藥",
    allergies: "敏",
  };
  return `
    <nav class="step-nav" aria-label="口訣進度">
      ${HISTORY_STEP_ORDER.map((id) => {
        const current = id === active;
        return `<button type="button" class="step-chip ${current ? "is-current" : ""}" data-action="hist-goto" data-id="${id}">${labels[id]}</button>`;
      }).join("")}
    </nav>
  `;
}

function renderHistoryStep(step: HistoryStepId): void {
  const catalog = getHistoryCatalog(step);
  if (!catalog) return;

  const title = bilingualPair(catalog.title, secondLang());
  const selected = new Set(getListOptionIds(state, step));
  const index = HISTORY_STEP_ORDER.indexOf(step) + 1;

  const optionButtons = catalog.options
    .map((opt) => {
      const pressed = selected.has(opt.id);
      return `
        <button
          type="button"
          class="option"
          data-action="hist-option"
          data-step="${step}"
          data-id="${opt.id}"
          aria-pressed="${pressed}"
        >
          ${bilingualButtonLabel(opt.labels)}
        </button>
      `;
    })
    .join("");

  const noteBlock = listStepNeedsNote(state, step)
    ? `
      <section class="section emt-only">
        <h2>EMT 備註「其他」（患者不用打字）</h2>
        <input
          class="refine-input"
          type="text"
          data-action="hist-note"
          data-step="${step}"
          placeholder="簡短註記"
          value="${escapeAttr(getListNote(state, step))}"
        />
      </section>
    `
    : "";

  const status = state.answers[step]?.status;
  const statusNote =
    status === "unknown"
      ? `<p class="status-note">已標示：不知道</p>`
      : status === "skipped"
        ? `<p class="status-note">已標示：跳過</p>`
        : "";

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">口訣 · ${index}／5</p>
        <h1>${title.zh}</h1>
        <p class="lead">${title.other}</p>
      </header>
      ${renderHistoryNav(step)}
    `,
    body: `
      <section class="section grow">
        <div class="option-grid cols-2 fill-grid">${optionButtons}</div>
      </section>
      ${noteBlock}
      ${statusNote}
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="hist-back" data-step="${step}">上一步</button>
        <button type="button" class="ghost" data-action="hist-unknown" data-step="${step}">不知道</button>
        <button type="button" class="ghost" data-action="hist-unknown" data-step="${step}">無法回答</button>
        <button type="button" class="ghost" data-action="hist-skip" data-step="${step}">跳過</button>
        <button type="button" class="primary" data-action="hist-next" data-step="${step}" ${
          canCompleteListStep(state, step) ? "" : "disabled"
        }>下一步</button>
      </div>
      ${returnSummaryBar()}
    `,
  });
}

function renderStart(): void {
  const langButtons = SECOND_LANGUAGE_OPTIONS.map((opt) => {
    const pressed = state.secondLanguage === opt.id;
    return `
      <button
        type="button"
        class="option"
        data-action="lang"
        data-id="${opt.id}"
        aria-pressed="${pressed}"
      >
        <span class="zh">${opt.zh}</span>
        <span class="sub">${opt.native}</span>
      </button>
    `;
  }).join("");

  const informantButtons = INFORMANT_OPTIONS.map((opt) => {
    const pressed = state.informant === opt.id;
    // Start screen: Chinese + English labels for EMT; second language applies after begin.
    return `
      <button
        type="button"
        class="option"
        data-action="informant"
        data-id="${opt.id}"
        aria-pressed="${pressed}"
      >
        <span class="zh">${opt.labels.zh}</span>
        <span class="sub">${opt.labels.en}</span>
      </button>
    `;
  }).join("");

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header brand-header">
        <p class="brand-kicker">Zhongxinbei · Field Aid</p>
        <h1 class="brand-title">
          <span class="brand-title-main">救護現場</span>
          <span class="brand-title-sub">雙語溝通輔助</span>
        </h1>
        <p class="lead">救護人員操作；傷病患／家屬指選。中文為錨，同屏雙語。</p>
      </header>
    `,

    body: `
      <section class="section grow">
        <h2>選擇第二語</h2>
        <div class="option-grid cols-2 lang-grid fill-grid">${langButtons}</div>
      </section>
      <section class="section">
        <h2>誰在回答</h2>
        <div class="option-grid cols-2">${informantButtons}</div>
      </section>
    `,
    actions: `
      <button type="button" class="primary" data-action="begin" ${
        canBeginInterview(state) ? "" : "disabled"
      }>
        ${state.returnToSummary ? "回摘要" : "開始問診"}
      </button>
      ${returnSummaryBar()}
    `,
  });
}

function bilingualButtonLabel(labels: BilingualText): string {
  const pair = bilingualPair(labels, secondLang());
  return `<span class="zh">${pair.zh}</span><span class="sub">${pair.other}</span>`;
}

const INTERVIEW_STEPS: InterviewStep[] = [
  "start",
  "chief_complaint_1",
  "chief_complaint_2",
  "before",
  "intake",
  "past_history",
  "medications",
  "allergies",
  "other_symptoms",
  "summary",
];

function isInterviewStep(step: string): step is InterviewStep {
  return (INTERVIEW_STEPS as readonly string[]).includes(step);
}

function renderChiefComplaint1(): void {
  const detail = getChiefComplaint1Detail(state);
  const showBody = needsBodyLocation(state);
  const drillRegion = detail.drilldownRegionId
    ? getBodyRegion(detail.drilldownRegionId)
    : undefined;

  if (drillRegion && drillRegion.subregions.length > 0) {
    const subButtons = drillRegion.subregions
      .map((sub) => {
        const pressed = detail.bodySubregionIds.includes(sub.id);
        return `
          <button
            type="button"
            class="option"
            data-action="cc1-sub"
            data-id="${sub.id}"
            aria-pressed="${pressed}"
          >
            ${bilingualButtonLabel(sub.labels)}
          </button>
        `;
      })
      .join("");

    const regionPair = bilingualPair(drillRegion.labels, secondLang());
    getView().innerHTML = screenLayout({
      header: `
        <header class="step-header">
          <p class="eyebrow">主訴 · 1／2</p>
          <h1>${regionPair.zh} — 更精確位置</h1>
          <p class="lead">${regionPair.other} — finer location (optional)</p>
        </header>
      `,
      body: `<div class="option-grid cols-2 fill-grid">${subButtons}</div>`,
      actions: `
        <div class="actions">
          <button type="button" class="secondary" data-action="cc1-drill-done">完成細分／略過</button>
        </div>
      `,
    });
    return;
  }

  const complaintButtons = COMPLAINT_TYPES.map((opt) => {
    const pressed = detail.complaintTypeIds.includes(opt.id);
    return `
      <button
        type="button"
        class="option"
        data-action="cc1-complaint"
        data-id="${opt.id}"
        aria-pressed="${pressed}"
      >
        ${bilingualButtonLabel(opt.labels)}
      </button>
    `;
  }).join("");

  const bodyMap = `
    <div class="body-map" aria-label="身體圖">
      <button type="button" class="body-hotspot head" data-action="cc1-body" data-id="head" aria-pressed="${detail.bodyRegionIds.includes("head")}">${bilingualButtonLabel(BODY_REGIONS.find((r) => r.id === "head")!.labels)}</button>
      <button type="button" class="body-hotspot neck" data-action="cc1-body" data-id="neck" aria-pressed="${detail.bodyRegionIds.includes("neck")}">${bilingualButtonLabel(BODY_REGIONS.find((r) => r.id === "neck")!.labels)}</button>
      <button type="button" class="body-hotspot left-arm" data-action="cc1-body" data-id="left_arm" aria-pressed="${detail.bodyRegionIds.includes("left_arm")}">${bilingualButtonLabel(BODY_REGIONS.find((r) => r.id === "left_arm")!.labels)}</button>
      <button type="button" class="body-hotspot chest" data-action="cc1-body" data-id="chest" aria-pressed="${detail.bodyRegionIds.includes("chest")}">${bilingualButtonLabel(BODY_REGIONS.find((r) => r.id === "chest")!.labels)}</button>
      <button type="button" class="body-hotspot right-arm" data-action="cc1-body" data-id="right_arm" aria-pressed="${detail.bodyRegionIds.includes("right_arm")}">${bilingualButtonLabel(BODY_REGIONS.find((r) => r.id === "right_arm")!.labels)}</button>
      <button type="button" class="body-hotspot abdomen" data-action="cc1-body" data-id="abdomen" aria-pressed="${detail.bodyRegionIds.includes("abdomen")}">${bilingualButtonLabel(BODY_REGIONS.find((r) => r.id === "abdomen")!.labels)}</button>
      <button type="button" class="body-hotspot back" data-action="cc1-body" data-id="back" aria-pressed="${detail.bodyRegionIds.includes("back")}">${bilingualButtonLabel(BODY_REGIONS.find((r) => r.id === "back")!.labels)}</button>
      <button type="button" class="body-hotspot pelvis" data-action="cc1-body" data-id="pelvis" aria-pressed="${detail.bodyRegionIds.includes("pelvis")}">${bilingualButtonLabel(BODY_REGIONS.find((r) => r.id === "pelvis")!.labels)}</button>
      <button type="button" class="body-hotspot left-leg" data-action="cc1-body" data-id="left_leg" aria-pressed="${detail.bodyRegionIds.includes("left_leg")}">${bilingualButtonLabel(BODY_REGIONS.find((r) => r.id === "left_leg")!.labels)}</button>
      <button type="button" class="body-hotspot right-leg" data-action="cc1-body" data-id="right_leg" aria-pressed="${detail.bodyRegionIds.includes("right_leg")}">${bilingualButtonLabel(BODY_REGIONS.find((r) => r.id === "right_leg")!.labels)}</button>
    </div>
  `;

  const status = state.answers.chief_complaint_1?.status;
  const statusNote =
    status === "unknown"
      ? `<p class="status-note">已標示：不知道</p>`
      : status === "skipped"
        ? `<p class="status-note">已標示：跳過</p>`
        : "";

  const title = bilingualPair(UI_COPY.cc1Title, secondLang());
  const what = bilingualPair(UI_COPY.cc1What, secondLang());
  const where = bilingualPair(UI_COPY.cc1Where, secondLang());
  const whereOpt = bilingualPair(UI_COPY.cc1WhereOptional, secondLang());

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">主訴 · 1／2</p>
        <h1>${title.zh}</h1>
        <p class="lead">${title.other}</p>
      </header>
    `,
    body: `
      <div class="split-panels">
        <section class="section grow">
          <h2>${what.zh} · ${what.other}</h2>
          <div class="option-grid cols-2 fill-grid">${complaintButtons}</div>
        </section>
        <section class="section grow ${showBody ? "" : "is-disabled"}">
          <h2>${where.zh} · ${where.other}${showBody ? "" : ` ${whereOpt.zh}`}</h2>
          ${bodyMap}
        </section>
      </div>
      ${statusNote}
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="cc1-back">上一步</button>
        <button type="button" class="ghost" data-action="cc1-unknown">不知道</button>
        <button type="button" class="ghost" data-action="cc1-unknown">無法回答</button>
        <button type="button" class="ghost" data-action="cc1-skip">跳過</button>
        <button type="button" class="primary" data-action="cc1-next" ${
          canCompleteChiefComplaint1(state) ? "" : "disabled"
        }>下一步</button>
      </div>
      ${returnSummaryBar()}
    `,
  });
}

function renderChiefComplaint2(): void {
  const detail = getChiefComplaint2Detail(state);
  const pain = showsPainScale(state);

  // Pain: full quality list. Non-pain: non-pain-related + other.
  const qualityButtons = QUALITY_OPTIONS.filter((q) =>
    pain ? true : !q.painRelated || q.id === "other_quality",
  )
    .map((opt) => {
      const pressed = detail.qualityIds.includes(opt.id);
      return `
        <button
          type="button"
          class="option"
          data-action="cc2-quality"
          data-id="${opt.id}"
          aria-pressed="${pressed}"
        >
          ${bilingualButtonLabel(opt.labels)}
        </button>
      `;
    })
    .join("");

  const durationButtons = TIME_BUCKETS.filter((b) => b.mode === "duration")
    .map((opt) => {
      const pressed = detail.timeBucketId === opt.id;
      return `
        <button
          type="button"
          class="option"
          data-action="cc2-time"
          data-id="${opt.id}"
          aria-pressed="${pressed}"
        >
          ${bilingualButtonLabel(opt.labels)}
        </button>
      `;
    })
    .join("");

  const periodButtons = TIME_BUCKETS.filter((b) => b.mode === "period")
    .map((opt) => {
      const pressed = detail.timeBucketId === opt.id;
      return `
        <button
          type="button"
          class="option"
          data-action="cc2-time"
          data-id="${opt.id}"
          aria-pressed="${pressed}"
        >
          ${bilingualButtonLabel(opt.labels)}
        </button>
      `;
    })
    .join("");

  const painButtons = pain
    ? Array.from({ length: 10 }, (_, i) => i + 1)
        .map((n) => {
          const pressed = detail.painScore === n;
          return `
            <button
              type="button"
              class="pain-score"
              data-action="cc2-pain"
              data-id="${n}"
              aria-pressed="${pressed}"
            >${n}</button>
          `;
        })
        .join("")
    : "";

  const status = state.answers.chief_complaint_2?.status;
  const statusNote =
    status === "unknown"
      ? `<p class="status-note">已標示：不知道</p>`
      : status === "skipped"
        ? `<p class="status-note">已標示：跳過</p>`
        : "";

  const title = bilingualPair(UI_COPY.cc2Title, secondLang());
  const quality = bilingualPair(UI_COPY.cc2Quality, secondLang());
  const duration = bilingualPair(UI_COPY.cc2Duration, secondLang());
  const period = bilingualPair(UI_COPY.cc2Period, secondLang());
  const painTitle = bilingualPair(UI_COPY.cc2Pain, secondLang());

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">主訴 · 2／2</p>
        <h1>${title.zh}</h1>
        <p class="lead">${title.other}</p>
      </header>
    `,
    body: `
      <section class="section">
        <h2>${quality.zh} · ${quality.other}</h2>
        <div class="option-grid cols-3">${qualityButtons}</div>
      </section>
      <div class="twin-sections">
        <section class="section">
          <h2>${duration.zh} · ${duration.other}</h2>
          <div class="option-grid cols-2">${durationButtons}</div>
        </section>
        <section class="section">
          <h2>${period.zh} · ${period.other}</h2>
          <div class="option-grid cols-2">${periodButtons}</div>
        </section>
      </div>
      <section class="section emt-only compact">
        <h2>EMT 細調時間（選填）</h2>
        <input
          class="refine-input"
          type="text"
          data-action="cc2-refine"
          placeholder="例如：約 14:10 開始／發作已 25 分鐘"
          value="${escapeAttr(detail.timeRefine)}"
        />
      </section>
      ${
        pain
          ? `<section class="section compact">
        <h2>${painTitle.zh} · ${painTitle.other}</h2>
        <div class="pain-scale">${painButtons}</div>
      </section>`
          : ""
      }
      ${statusNote}
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="cc2-back">上一步</button>
        <button type="button" class="ghost" data-action="cc2-unknown">不知道</button>
        <button type="button" class="ghost" data-action="cc2-unknown">無法回答</button>
        <button type="button" class="ghost" data-action="cc2-skip">跳過</button>
        <button type="button" class="primary" data-action="cc2-next" ${
          canCompleteChiefComplaint2(state) ? "" : "disabled"
        }>下一步</button>
      </div>
      ${returnSummaryBar()}
    `,
  });
}

function renderBodyMap(
  selectedRegions: string[],
  action: "cc1-body" | "sense-body",
): string {
  const cell = (id: string, area: string) => {
    const labels = BODY_REGIONS.find((r) => r.id === id)!.labels;
    return `<button type="button" class="body-hotspot ${area}" data-action="${action}" data-id="${id}" aria-pressed="${selectedRegions.includes(id)}">${bilingualButtonLabel(labels)}</button>`;
  };
  return `
    <div class="body-map" aria-label="身體圖">
      ${cell("head", "head")}
      ${cell("neck", "neck")}
      ${cell("left_arm", "left-arm")}
      ${cell("chest", "chest")}
      ${cell("right_arm", "right-arm")}
      ${cell("abdomen", "abdomen")}
      ${cell("back", "back")}
      ${cell("pelvis", "pelvis")}
      ${cell("left_leg", "left-leg")}
      ${cell("right_leg", "right-leg")}
    </div>
  `;
}

function renderOtherSymptoms(): void {
  const detail = getOtherSymptomsDetail(state);
  const exclusive = detail.symptomIds.some(
    (id) => ACCOMPANYING_SYMPTOMS.find((s) => s.id === id)?.exclusive,
  );
  const drillRegion = detail.drilldownRegionId
    ? getBodyRegion(detail.drilldownRegionId)
    : undefined;

  if (drillRegion && drillRegion.subregions.length > 0) {
    const subButtons = drillRegion.subregions
      .map((sub) => {
        const pressed = detail.bodySubregionIds.includes(sub.id);
        return `
          <button type="button" class="option" data-action="sense-sub" data-id="${sub.id}" aria-pressed="${pressed}">
            ${bilingualButtonLabel(sub.labels)}
          </button>
        `;
      })
      .join("");
    const regionPair = bilingualPair(drillRegion.labels, secondLang());
    getView().innerHTML = screenLayout({
      header: `
        <header class="step-header">
          <p class="eyebrow">感 · 二次掃描</p>
          <h1>${regionPair.zh} — 更精確位置</h1>
          <p class="lead">${regionPair.other}</p>
        </header>
      `,
      body: `<div class="option-grid cols-2 fill-grid">${subButtons}</div>`,
      actions: `
        <div class="actions">
          <button type="button" class="secondary" data-action="sense-drill-done">完成細分／略過</button>
        </div>
        ${returnSummaryBar()}
      `,
    });
    return;
  }

  const symptomButtons = ACCOMPANYING_SYMPTOMS.map((opt) => {
    const pressed = detail.symptomIds.includes(opt.id);
    return `
      <button type="button" class="option" data-action="sense-symptom" data-id="${opt.id}" aria-pressed="${pressed}">
        ${bilingualButtonLabel(opt.labels)}
      </button>
    `;
  }).join("");

  const status = state.answers.other_symptoms?.status;
  const statusNote =
    status === "unknown"
      ? `<p class="status-note">已標示：不知道</p>`
      : status === "skipped"
        ? `<p class="status-note">已標示：跳過</p>`
        : "";

  const title = bilingualPair(UI_COPY.senseTitle, secondLang());
  const lead = bilingualPair(UI_COPY.senseLead, secondLang());
  const symptoms = bilingualPair(UI_COPY.senseSymptoms, secondLang());
  const body = bilingualPair(UI_COPY.senseBody, secondLang());

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">感</p>
        <h1>${title.zh}</h1>
        <p class="lead">${title.other} · ${lead.other}</p>
      </header>
    `,
    body: `
      <div class="split-panels">
        <section class="section grow">
          <h2>${symptoms.zh} · ${symptoms.other}</h2>
          <div class="option-grid cols-2 fill-grid">${symptomButtons}</div>
        </section>
        <section class="section grow ${exclusive ? "is-disabled" : ""}">
          <h2>${body.zh} · ${body.other}</h2>
          ${renderBodyMap(detail.bodyRegionIds, "sense-body")}
        </section>
      </div>
      ${statusNote}
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="sense-back">上一步</button>
        <button type="button" class="ghost" data-action="sense-unknown">不知道</button>
        <button type="button" class="ghost" data-action="sense-unknown">無法回答</button>
        <button type="button" class="ghost" data-action="sense-skip">跳過</button>
        <button type="button" class="primary" data-action="sense-next" ${
          canCompleteOtherSymptoms(state) ? "" : "disabled"
        }>看摘要</button>
      </div>
      ${returnSummaryBar()}
    `,
  });
}

function renderSummary(): void {
  const sections = buildSummarySections(state)
    .map((s) => {
      const tone = s.obtained ? "" : " is-missing";
      return `
        <button type="button" class="summary-row${tone}" data-action="summary-edit" data-id="${s.editStep}">
          <span class="summary-label">${s.label}</span>
          <span class="summary-value">${escapeHtml(s.value)}</span>
          <span class="summary-edit">編輯</span>
        </button>
      `;
    })
    .join("");

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">本機摘要</p>
        <h1>現場資訊彙整</h1>
        <p class="lead">可複製後貼到紀錄；結束即清除。</p>
      </header>
    `,
    body: `<div class="summary-list fill-grid">${sections}</div>`,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="summary-copy">複製摘要</button>
        <button type="button" class="primary" data-action="summary-finish">結束／新案件</button>
      </div>
      <p class="copy-status" data-copy-status hidden></p>
    `,
  });
}

function escapeAttr(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

app.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "button[data-action]",
  );
  if (!target) return;

  const action = target.dataset.action;
  const id = target.dataset.id;

  switch (action) {
    case "lang":
      if (id) state = setSecondLanguage(state, id as SecondLanguage);
      break;
    case "informant":
      if (id) state = setInformant(state, id as Informant);
      break;
    case "begin":
      state = state.returnToSummary
        ? returnToSummaryView(state)
        : beginInterview(state);
      break;
    case "cc1-complaint":
      if (id) state = toggleComplaintType(state, id);
      break;
    case "cc1-body":
      if (id) state = toggleBodyRegion(state, id);
      break;
    case "cc1-sub":
      if (id) state = toggleBodySubregion(state, id);
      break;
    case "cc1-drill-done":
      state = clearBodyDrilldown(state);
      break;
    case "cc1-unknown":
      state = markChiefComplaint1Unknown(state);
      break;
    case "cc1-skip":
      state = skipChiefComplaint1(state);
      break;
    case "cc1-next":
      state = completeChiefComplaint1(state);
      break;
    case "cc1-back":
      state = goBackFromChiefComplaint1(state);
      break;
    case "cc2-quality":
      if (id) state = toggleQuality(state, id);
      break;
    case "cc2-time":
      if (id) state = selectTimeBucket(state, id);
      break;
    case "cc2-pain":
      if (id) state = setPainScore(state, Number(id));
      break;
    case "cc2-unknown":
      state = markChiefComplaint2Unknown(state);
      break;
    case "cc2-skip":
      state = skipChiefComplaint2(state);
      break;
    case "cc2-next":
      state = completeChiefComplaint2(state);
      break;
    case "cc2-back":
      state = goBackFromChiefComplaint2(state);
      break;
    case "hist-option": {
      const step = target.dataset.step;
      if (step && id && isHistoryStep(step)) {
        state = toggleListOption(state, step, id);
      }
      break;
    }
    case "hist-unknown": {
      const step = target.dataset.step;
      if (step && isHistoryStep(step)) {
        state = markListStepUnknown(state, step);
      }
      break;
    }
    case "hist-skip": {
      const step = target.dataset.step;
      if (step && isHistoryStep(step)) {
        state = skipListStep(state, step);
      }
      break;
    }
    case "hist-next": {
      const step = target.dataset.step;
      if (step && isHistoryStep(step)) {
        state = completeListStep(state, step);
      }
      break;
    }
    case "hist-back": {
      const step = target.dataset.step;
      if (step && isHistoryStep(step)) {
        state = goBackListStep(state, step);
      }
      break;
    }
    case "hist-goto":
      if (id && isHistoryStep(id)) {
        state = goToStep(state, id);
      }
      break;
    case "sense-symptom":
      if (id) state = toggleAccompanyingSymptom(state, id);
      break;
    case "sense-body":
      if (id) state = toggleOtherBodyRegion(state, id);
      break;
    case "sense-sub":
      if (id) state = toggleOtherBodySubregion(state, id);
      break;
    case "sense-drill-done":
      state = clearOtherBodyDrilldown(state);
      break;
    case "sense-unknown":
      state = markOtherSymptomsUnknown(state);
      break;
    case "sense-skip":
      state = skipOtherSymptoms(state);
      break;
    case "sense-next":
      state = completeOtherSymptoms(state);
      break;
    case "sense-back":
      state = goBackFromOtherSymptoms(state);
      break;
    case "summary-edit":
      if (id && isInterviewStep(id)) state = editFromSummary(state, id);
      break;
    case "summary-return":
      state = returnToSummaryView(state);
      break;
    case "summary-finish":
      state = finishCase(state);
      break;
    case "summary-copy": {
      const text = formatSummaryText(state);
      void navigator.clipboard.writeText(text).then(
        () => {
          const el = app!.querySelector<HTMLElement>("[data-copy-status]");
          if (el) {
            el.hidden = false;
            el.textContent = "已複製到剪貼簿";
          }
        },
        () => {
          const el = app!.querySelector<HTMLElement>("[data-copy-status]");
          if (el) {
            el.hidden = false;
            el.textContent = "複製失敗，請手動選取摘要文字";
          }
        },
      );
      return;
    }
    default:
      return;
  }

  render();
});

app.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  if (target.matches("input[data-action='cc2-refine']")) {
    state = setTimeRefine(state, target.value);
    const nextBtn = app!.querySelector<HTMLButtonElement>(
      "button[data-action='cc2-next']",
    );
    if (nextBtn) {
      nextBtn.disabled = !canCompleteChiefComplaint2(state);
    }
    return;
  }

  if (target.matches("input[data-action='hist-note']")) {
    const step = target.dataset.step;
    if (step && isHistoryStep(step)) {
      state = setListNote(state, step, target.value);
      const nextBtn = app!.querySelector<HTMLButtonElement>(
        "button[data-action='hist-next']",
      );
      if (nextBtn) {
        nextBtn.disabled = !canCompleteListStep(state, step);
      }
    }
  }
});

render();
