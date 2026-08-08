import {
  BODY_REGIONS,
  COMPLAINT_TYPES,
  getBodyRegion,
} from "./catalog/chief-complaint-1.js";
import {
  TIME_BUCKETS,
  TIME_UNITS,
  formatApproxDuration,
  visibleQualityOptions,
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
  canCompleteChiefComplaintDuration,
  canCompleteListStep,
  canCompleteOtherSymptoms,
  clearBodyDrilldown,
  clearOtherBodyDrilldown,
  completeChiefComplaint1,
  completeChiefComplaint2,
  completeChiefComplaintDuration,
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
  goBackFromChiefComplaintDuration,
  goBackFromOtherSymptoms,
  goBackListStep,
  goToStep,
  listStepNeedsNote,
  markChiefComplaint1Unknown,
  markChiefComplaint2Unknown,
  markChiefComplaintDurationUnknown,
  markListStepUnknown,
  markOtherSymptomsUnknown,
  needsBodyLocation,
  returnToSummaryView,
  formatDurationForLang,
  selectTimeBucket,
  setInformant,
  setListNote,
  setPainScore,
  setSecondLanguage,
  setTimeAmount,
  setTimeRefine,
  setTimeUnit,
  showsPainScale,
  skipChiefComplaint1,
  skipChiefComplaint2,
  skipChiefComplaintDuration,
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
/** Start flow is two pages: language → informant. */
let startPhase: "language" | "informant" = "language";

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

function gateNote(message: string): string {
  return `<p class="status-note gate-note">${message}</p>`;
}

function cc1GateNote(): string {
  if (canCompleteChiefComplaint1(state)) return "";
  const detail = getChiefComplaint1Detail(state);
  if (detail.complaintTypeIds.length === 0) {
    return gateNote("請選擇主訴，或按「不知道／無法回答／跳過」");
  }
  if (needsBodyLocation(state) && detail.bodyRegionIds.length === 0) {
    return gateNote("此主訴需點選身體部位後才能下一步");
  }
  return "";
}

function cc2GateNote(): string {
  if (canCompleteChiefComplaint2(state)) return "";
  return gateNote(
    "請選擇怎麼不舒服（或「同哪裡不舒服」／疼痛指數），或按「不知道／無法回答／跳過」",
  );
}

function ccDurationGateNote(): string {
  if (canCompleteChiefComplaintDuration(state)) return "";
  return gateNote(
    "請輸入多久了（數字＋單位）或時段，或按「不知道／無法回答／跳過」",
  );
}

function histGateNote(step: HistoryStepId): string {
  if (canCompleteListStep(state, step)) return "";
  return gateNote("請選擇至少一項，或按「不知道／無法回答／跳過」");
}

function senseGateNote(): string {
  if (canCompleteOtherSymptoms(state)) return "";
  return gateNote("請選擇伴隨症狀或身體部位，或按「不知道／無法回答／跳過」");
}

function render(): void {
  ensureShell();
  const prevStep = app!.dataset.step;
  app!.dataset.secondLang = state.secondLanguage ?? "";
  app!.dataset.step = state.currentStep;
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
    case "chief_complaint_duration":
      renderChiefComplaintDuration();
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
  if (prevStep !== state.currentStep) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    getView().scrollTop = 0;
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

  const title = bilingualHeading(catalog.title);
  const selected = new Set(getListOptionIds(state, step));
  const index = HISTORY_STEP_ORDER.indexOf(step) + 1;

  const renderOption = (opt: (typeof catalog.options)[number]) => {
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
  };

  let optionButtons = "";
  if (step === "intake") {
    const yesterday = catalog.options.filter((o) => o.group === "yesterday");
    const today = catalog.options.filter((o) => o.group === "today");
    const rest = catalog.options.filter((o) => !o.group);
    const yLabel = bilingualHeading(UI_COPY.intakeYesterday);
    const tLabel = bilingualHeading(UI_COPY.intakeToday);
    optionButtons = `
      <p class="option-group-label">${yLabel.title} · ${yLabel.lead}</p>
      <div class="option-grid cols-3">${yesterday.map(renderOption).join("")}</div>
      <p class="option-group-label">${tLabel.title} · ${tLabel.lead}</p>
      <div class="option-grid cols-3">${today.map(renderOption).join("")}</div>
      <div class="option-grid cols-2" style="margin-top:0.55rem">${rest.map(renderOption).join("")}</div>
    `;
  } else {
    optionButtons = `<div class="option-grid cols-2 fill-grid">${catalog.options.map(renderOption).join("")}</div>`;
  }

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
        <h1>${title.title}</h1>
        <p class="lead">${title.lead}</p>
      </header>
      ${renderHistoryNav(step)}
    `,
    body: `
      <section class="section grow">
        ${optionButtons}
      </section>
      ${noteBlock}
      ${statusNote}
      ${histGateNote(step)}
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
  if (startPhase === "informant" && state.secondLanguage) {
    renderStartInformant();
    return;
  }
  startPhase = "language";
  renderStartLanguage();
}

function renderStartLanguage(): void {
  const langButtons = SECOND_LANGUAGE_OPTIONS.map((opt) => {
    const pressed = state.secondLanguage === opt.id;
    const flag = LANG_FLAGS[opt.id];
    // 主客互換：原名／第二語在上，中文在下。
    return `
      <button
        type="button"
        class="option"
        data-action="lang"
        data-id="${opt.id}"
        aria-pressed="${pressed}"
      >
        <span class="zh"><span class="lang-flag" aria-hidden="true">${flag}</span> ${opt.native}</span>
        <span class="sub">${opt.zh}</span>
      </button>
    `;
  }).join("");

  const langTitle = state.secondLanguage
    ? bilingualSectionTitle(UI_COPY.selectLanguage)
    : `${UI_COPY.selectLanguage.en} · ${UI_COPY.selectLanguage.zh}`;

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header brand-header">
        <p class="brand-kicker">Zhongxinbei · Field Aid</p>
        <h1 class="brand-title">
          <span class="brand-title-main">救護現場</span>
          <span class="brand-title-sub">雙語溝通輔助</span>
        </h1>
        <p class="lead">救護人員操作；傷病患／家屬指選。同屏雙語。</p>
      </header>
    `,
    body: `
      <section class="section grow">
        <p class="eyebrow">開場 · 1／2</p>
        <h2>${langTitle}</h2>
        <div class="option-grid cols-2 lang-grid fill-grid">${langButtons}</div>
      </section>
    `,
    actions: `
      <button type="button" class="primary" data-action="start-lang-next" ${
        state.secondLanguage ? "" : "disabled"
      }>下一步</button>
      ${returnSummaryBar()}
    `,
  });
}

function renderStartInformant(): void {
  const title = bilingualHeading(UI_COPY.informantAsking);
  const informantButtons = INFORMANT_OPTIONS.map((opt) => {
    const pressed = state.informant === opt.id;
    return `
      <button
        type="button"
        class="option"
        data-action="informant"
        data-id="${opt.id}"
        aria-pressed="${pressed}"
      >
        ${bilingualButtonLabel(opt.labels)}
      </button>
    `;
  }).join("");

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">開場 · 2／2</p>
        <h1>${title.title}</h1>
        <p class="lead">${title.lead}</p>
      </header>
    `,
    body: `
      <section class="section grow">
        <div class="option-grid cols-2 fill-grid">${informantButtons}</div>
      </section>
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="start-informant-back">上一步</button>
        <button type="button" class="primary" data-action="begin" ${
          canBeginInterview(state) ? "" : "disabled"
        }>
          ${state.returnToSummary ? "回摘要" : "開始問診"}
        </button>
      </div>
      ${returnSummaryBar()}
    `,
  });
}

/** Interview options: second language primary (top), Chinese secondary. */
function bilingualButtonLabel(labels: BilingualText): string {
  const pair = bilingualPair(labels, secondLang());
  return `<span class="zh">${pair.other}</span><span class="sub">${pair.zh}</span>`;
}

function bilingualHeading(text: BilingualText): { title: string; lead: string } {
  const pair = bilingualPair(text, secondLang());
  return { title: pair.other, lead: pair.zh };
}

function bilingualSectionTitle(text: BilingualText): string {
  const pair = bilingualPair(text, secondLang());
  return `${pair.other} · ${pair.zh}`;
}

const LANG_FLAGS: Record<SecondLanguage, string> = {
  en: "🇺🇸🇬🇧",
  vi: "🇻🇳",
  id: "🇮🇩",
  fil: "🇵🇭",
  th: "🇹🇭",
  ja: "🇯🇵",
  ko: "🇰🇷",
  de: "🇩🇪",
  fr: "🇫🇷",
  es: "🇪🇸🇲🇽",
};

const INTERVIEW_STEPS: InterviewStep[] = [
  "start",
  "chief_complaint_1",
  "chief_complaint_2",
  "chief_complaint_duration",
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
          <p class="eyebrow">主訴 · 1／3</p>
          <h1>${regionPair.other} — finer location</h1>
          <p class="lead">${regionPair.zh} — 更精確位置（選填）</p>
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

  const bodyMap = renderBodyMap(detail.bodyRegionIds, "cc1-body");

  const status = state.answers.chief_complaint_1?.status;
  const statusNote =
    status === "unknown"
      ? `<p class="status-note">已標示：不知道</p>`
      : status === "skipped"
        ? `<p class="status-note">已標示：跳過</p>`
        : "";

  const title = bilingualHeading(UI_COPY.cc1Title);
  const what = bilingualSectionTitle(UI_COPY.cc1What);
  const where = bilingualSectionTitle(UI_COPY.cc1Where);
  const whereOpt = bilingualPair(UI_COPY.cc1WhereOptional, secondLang());

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">主訴 · 1／3</p>
        <h1>${title.title}</h1>
        <p class="lead">${title.lead}</p>
      </header>
    `,
    body: `
      <div class="split-panels">
        <section class="section grow">
          <h2>${what}</h2>
          <div class="option-grid cols-2 fill-grid">${complaintButtons}</div>
        </section>
        <section class="section grow">
          <h2>${where}${showBody ? "" : ` <span class="sub">${whereOpt.other} · ${whereOpt.zh}</span>`}</h2>
          ${bodyMap}
        </section>
      </div>
      ${statusNote}
      ${cc1GateNote()}
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

  const qualityButtons = visibleQualityOptions(pain)
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

  const title = bilingualHeading(UI_COPY.cc2Title);
  const quality = bilingualSectionTitle(UI_COPY.cc2Quality);
  const painTitle = bilingualSectionTitle(UI_COPY.cc2Pain);

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">主訴 · 2／3</p>
        <h1>${title.title}</h1>
        <p class="lead">${title.lead}</p>
      </header>
    `,
    body: `
      <section class="section">
        <h2>${quality}</h2>
        <div class="option-grid cols-3">${qualityButtons}</div>
      </section>
      ${
        pain
          ? `<section class="section compact">
        <h2>${painTitle}</h2>
        <div class="pain-scale">${painButtons}</div>
      </section>`
          : ""
      }
      ${statusNote}
      ${cc2GateNote()}
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

function renderChiefComplaintDuration(): void {
  const detail = getChiefComplaint2Detail(state);
  const lang = secondLang();

  const justNow = TIME_BUCKETS.find((b) => b.id === "just_now");
  const justNowButton = justNow
    ? `
      <button
        type="button"
        class="option"
        data-action="ccd-time"
        data-id="${justNow.id}"
        aria-pressed="${detail.timeBucketId === justNow.id}"
      >
        ${bilingualButtonLabel(justNow.labels)}
      </button>
    `
    : "";

  const unitButtons = TIME_UNITS.map((unit) => {
    const pressed = detail.timeUnit === unit.id;
    return `
      <button
        type="button"
        class="option unit-chip"
        data-action="ccd-time-unit"
        data-id="${unit.id}"
        aria-pressed="${pressed}"
      >
        ${bilingualButtonLabel(unit.labels)}
      </button>
    `;
  }).join("");

  const periodButtons = TIME_BUCKETS.filter((b) => b.mode === "period")
    .map((opt) => {
      const pressed = detail.timeBucketId === opt.id;
      return `
        <button
          type="button"
          class="option"
          data-action="ccd-time"
          data-id="${opt.id}"
          aria-pressed="${pressed}"
        >
          ${bilingualButtonLabel(opt.labels)}
        </button>
      `;
    })
    .join("");

  const status = state.answers.chief_complaint_duration?.status;
  const statusNote =
    status === "unknown"
      ? `<p class="status-note">已標示：不知道</p>`
      : status === "skipped"
        ? `<p class="status-note">已標示：跳過</p>`
        : "";

  const title = bilingualHeading(UI_COPY.ccDurationTitle);
  const duration = bilingualSectionTitle(UI_COPY.cc2Duration);
  const about = bilingualPair(UI_COPY.cc2DurationAbout, lang);
  const previewLabel = bilingualPair(UI_COPY.cc2DurationPreview, lang);
  const period = bilingualSectionTitle(UI_COPY.cc2Period);

  const previewZh =
    detail.timeAmount && detail.timeUnit
      ? formatApproxDuration(detail.timeAmount, detail.timeUnit, "zh")
      : "";
  const previewOther =
    detail.timeAmount && detail.timeUnit
      ? formatApproxDuration(detail.timeAmount, detail.timeUnit, lang)
      : formatDurationForLang(state, lang);
  const previewBlock =
    previewZh || previewOther
      ? `<p class="duration-preview" aria-live="polite">
          <span class="preview-label">${previewLabel.other} · ${previewLabel.zh}</span>
          <span class="zh">${previewOther || "—"}</span>
          <span class="sub">${previewZh || "—"}</span>
        </p>`
      : `<p class="duration-preview is-empty" aria-live="polite">
          <span class="preview-label">${previewLabel.other} · ${previewLabel.zh}</span>
          <span class="zh">${about.other} ＿＿</span>
          <span class="sub">約＿＿分鐘／小時／日</span>
        </p>`;

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">主訴 · 3／3</p>
        <h1>${title.title}</h1>
        <p class="lead">${title.lead}</p>
      </header>
    `,
    body: `
      <section class="section">
        <h2>${duration}</h2>
        <div class="duration-entry">
          <span class="duration-prefix">
            <span class="zh">${about.other}</span>
            <span class="sub">${about.zh}</span>
          </span>
          <input
            class="duration-amount"
            type="number"
            inputmode="numeric"
            min="1"
            max="9999"
            step="1"
            placeholder="＿＿"
            data-action="ccd-time-amount"
            value="${detail.timeAmount ?? ""}"
          />
          <div class="option-grid cols-3 unit-grid">${unitButtons}</div>
        </div>
        ${previewBlock}
        ${
          justNowButton
            ? `<div class="option-grid cols-1 quick-time">${justNowButton}</div>`
            : ""
        }
      </section>
      <section class="section">
        <h2>${period}</h2>
        <div class="option-grid cols-2">${periodButtons}</div>
      </section>
      <section class="section emt-only compact">
        <h2>EMT 細調時間（選填）</h2>
        <input
          class="refine-input"
          type="text"
          data-action="ccd-refine"
          placeholder="例如：約 14:10 開始／發作已 25 分鐘"
          value="${escapeAttr(detail.timeRefine)}"
        />
      </section>
      ${statusNote}
      ${ccDurationGateNote()}
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="ccd-back">上一步</button>
        <button type="button" class="ghost" data-action="ccd-unknown">不知道</button>
        <button type="button" class="ghost" data-action="ccd-unknown">無法回答</button>
        <button type="button" class="ghost" data-action="ccd-skip">跳過</button>
        <button type="button" class="primary" data-action="ccd-next" ${
          canCompleteChiefComplaintDuration(state) ? "" : "disabled"
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
  const list = BODY_REGIONS.map((region) => {
    const pressed = selectedRegions.includes(region.id);
    return `<button type="button" class="option" data-action="${action}" data-id="${region.id}" aria-pressed="${pressed}">${bilingualButtonLabel(region.labels)}</button>`;
  }).join("");
  return `
    <div class="body-list" aria-label="身體部位清單">${list}</div>
    <div class="body-map-wrap">
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
          <h1>${regionPair.other}</h1>
          <p class="lead">${regionPair.zh} — 更精確位置</p>
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

  const title = bilingualHeading(UI_COPY.senseTitle);
  const lead = bilingualPair(UI_COPY.senseLead, secondLang());
  const symptoms = bilingualPair(UI_COPY.senseSymptoms, secondLang());
  const body = bilingualPair(UI_COPY.senseBody, secondLang());

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">感</p>
        <h1>${title.title}</h1>
        <p class="lead">${title.lead} · ${lead.other}</p>
      </header>
    `,
    body: `
      <div class="split-panels">
        <section class="section grow">
          <h2>${symptoms.other} · ${symptoms.zh}</h2>
          <div class="option-grid cols-2 fill-grid">${symptomButtons}</div>
        </section>
        <section class="section grow ${exclusive ? "is-disabled" : ""}">
          <h2>${body.other} · ${body.zh}</h2>
          ${renderBodyMap(detail.bodyRegionIds, "sense-body")}
        </section>
      </div>
      ${statusNote}
      ${senseGateNote()}
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
    case "start-lang-next":
      if (state.secondLanguage) startPhase = "informant";
      break;
    case "start-informant-back":
      startPhase = "language";
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
      if (state.currentStep === "start" && state.secondLanguage) {
        startPhase = "informant";
      }
      break;
    case "cc2-quality":
      if (id) state = toggleQuality(state, id);
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
    case "ccd-time":
      if (id) state = selectTimeBucket(state, id);
      break;
    case "ccd-time-unit":
      if (id) state = setTimeUnit(state, id);
      break;
    case "ccd-unknown":
      state = markChiefComplaintDurationUnknown(state);
      break;
    case "ccd-skip":
      state = skipChiefComplaintDuration(state);
      break;
    case "ccd-next":
      state = completeChiefComplaintDuration(state);
      break;
    case "ccd-back":
      state = goBackFromChiefComplaintDuration(state);
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
      if (id && isInterviewStep(id)) {
        state = editFromSummary(state, id);
        if (id === "start" && state.secondLanguage) startPhase = "informant";
      }
      break;
    case "summary-return":
      state = returnToSummaryView(state);
      break;
    case "summary-finish":
      state = finishCase(state);
      startPhase = "language";
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

function refreshDurationNextAndPreview(): void {
  const nextBtn = app!.querySelector<HTMLButtonElement>(
    "button[data-action='ccd-next']",
  );
  if (nextBtn) {
    nextBtn.disabled = !canCompleteChiefComplaintDuration(state);
  }
  const detail = getChiefComplaint2Detail(state);
  const preview = app!.querySelector(".duration-preview");
  if (!preview) return;
  const lang = secondLang();
  const previewLabel = bilingualPair(UI_COPY.cc2DurationPreview, lang);
  const about = bilingualPair(UI_COPY.cc2DurationAbout, lang);
  if (detail.timeAmount && detail.timeUnit) {
    const zh = formatApproxDuration(
      detail.timeAmount,
      detail.timeUnit,
      "zh",
    );
    const other = formatApproxDuration(
      detail.timeAmount,
      detail.timeUnit,
      lang,
    );
    preview.classList.remove("is-empty");
    preview.innerHTML = `
      <span class="preview-label">${previewLabel.other} · ${previewLabel.zh}</span>
      <span class="zh">${other}</span>
      <span class="sub">${zh}</span>
    `;
  } else {
    preview.classList.add("is-empty");
    preview.innerHTML = `
      <span class="preview-label">${previewLabel.other} · ${previewLabel.zh}</span>
      <span class="zh">${about.other} ＿＿</span>
      <span class="sub">約＿＿分鐘／小時／日</span>
    `;
  }
  for (const btn of app!.querySelectorAll<HTMLButtonElement>(
    "button[data-action='ccd-time-unit']",
  )) {
    btn.setAttribute(
      "aria-pressed",
      String(btn.dataset.id === detail.timeUnit),
    );
  }
  for (const btn of app!.querySelectorAll<HTMLButtonElement>(
    "button[data-action='ccd-time']",
  )) {
    btn.setAttribute(
      "aria-pressed",
      String(btn.dataset.id === detail.timeBucketId),
    );
  }
}

app.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  if (target.matches("input[data-action='ccd-time-amount']")) {
    state = setTimeAmount(state, target.value);
    refreshDurationNextAndPreview();
    return;
  }

  if (target.matches("input[data-action='ccd-refine']")) {
    state = setTimeRefine(state, target.value);
    const nextBtn = app!.querySelector<HTMLButtonElement>(
      "button[data-action='ccd-next']",
    );
    if (nextBtn) {
      nextBtn.disabled = !canCompleteChiefComplaintDuration(state);
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
