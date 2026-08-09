import {
  BODY_REGIONS,
  getBodyRegion,
} from "./catalog/chief-complaint-1.js";
import { NON_TRAUMA_PRIMARY_REASONS } from "./catalog/non-trauma-primary.js";
import {
  TRAUMA_INJURY_OPTIONS,
  TRAUMA_OHCA_LABELS,
  TRAUMA_TRAFFIC_OPTIONS,
  TRAUMA_VEHICLE_OPTIONS,
  formatMetersWithImperial,
} from "./catalog/trauma-primary.js";
import {
  OPQRST_ONSET,
  OPQRST_PROVOCATION,
  OPQRST_QUALITY,
  OPQRST_RADIATION_SITES,
  OPQRST_REGIONS,
  OPQRST_TIME_PATTERN,
  OPQRST_TIME_UNKNOWN_LABELS,
  OPQRST_RADIATION_TOGGLE_LABELS,
  PAIN_SCALE_SOURCE_NOTE,
  PAIN_SCALE_SOURCE_URL,
} from "./catalog/chest-opqrst.js";
import { visibleQualityOptions } from "./catalog/chief-complaint-quality.js";
import {
  TIME_BUCKETS,
  TIME_UNITS,
  formatApproxDuration,
} from "./catalog/chief-complaint-duration.js";
import {
  HISTORY_STEP_ORDER,
  getHistoryCatalog,
  isHistoryStep,
  type HistoryStepId,
} from "./catalog/history-block.js";
import { type BilingualText } from "./catalog/labels.js";
import { secondaryReasonsForScene } from "./catalog/secondary-reason.js";
import { UI_COPY } from "./catalog/ui-copy.js";
import {
  apply,
  createCase,
  viewFacts,
  type CaseState,
  type GateReason,
  type Intent,
  type InterviewStep,
  type SecondLanguage,
} from "./case-session/index.js";
import { DISCLAIMER_ZH } from "./content/disclaimer.js";
import {
  INFORMANT_OPTIONS,
  SCENE_TYPE_OPTIONS,
  SECOND_LANGUAGE_OPTIONS,
} from "./content/start-labels.js";
import { SUMMARY_COPY } from "./catalog/summary-copy.js";
import {
  bilingualButtonHtml,
  bilingualHeadingParts,
  bilingualInline,
  bilingualSectionTitle as bilingualSectionTitleFor,
  orderPair,
  type BilingualPrimacy,
} from "./presentation/bilingual.js";

/** Interview + summary display: second language on top, Chinese secondary. */
const INTERVIEW_PRIMACY: BilingualPrimacy = "second";
const SUMMARY_PRIMACY: BilingualPrimacy = "second";

/** Pain Assessment Tool palette (green → yellow → red), scores 0–10. */
const PAIN_SCORE_COLORS = [
  "#146933",
  "#3d9a4a",
  "#7cb342",
  "#c6d931",
  "#ffd800",
  "#ffc107",
  "#ff9800",
  "#f57c00",
  "#e65100",
  "#d84315",
  "#d71920",
] as const;

function painScoreTextColor(score: number): string {
  return score <= 3 ? "#ffffff" : "#1a1a1a";
}

/** Face bands aligned to score columns (Wong-Baker-style reference). */
function painFaceRowHtml(minScore: 0 | 1): string {
  const cols = minScore === 0 ? 11 : 10;
  const band = (start: number, end: number, face: string, label: string) => {
    const colStart = start - minScore + 1;
    const colEnd = end - minScore + 2;
    return `<span class="pain-face" style="grid-column:${colStart} / ${colEnd}">${face}<small>${label}</small></span>`;
  };
  const faces =
    minScore === 0
      ? [
          band(0, 0, "😀", "0"),
          band(1, 3, "🙂", "1–3"),
          band(4, 6, "😐", "4–6"),
          band(7, 9, "😣", "7–9"),
          band(10, 10, "😭", "10"),
        ].join("")
      : [
          band(1, 3, "🙂", "1–3"),
          band(4, 6, "😐", "4–6"),
          band(7, 9, "😣", "7–9"),
          band(10, 10, "😭", "10"),
        ].join("");
  return `<div class="pain-face-row" style="--pain-cols:${cols}" aria-hidden="true">${faces}</div>`;
}

function painScoreRowHtml(
  minScore: 0 | 1,
  selected: number | null,
  action: "opqrst-severity" | "ccq-pain",
): string {
  const max = 10;
  const buttons = Array.from({ length: max - minScore + 1 }, (_, i) => {
    const score = minScore + i;
    const pressed = selected === score;
    const bg = PAIN_SCORE_COLORS[score] ?? "#ccc";
    const fg = painScoreTextColor(score);
    return `
      <button
        type="button"
        class="pain-score"
        data-action="${action}"
        data-id="${score}"
        aria-pressed="${pressed}"
        style="--pain-bg:${bg};--pain-fg:${fg}"
      >${score}</button>`;
  }).join("");
  const cols = max - minScore + 1;
  return `<div class="pain-score-row" style="--pain-cols:${cols}">${buttons}</div>`;
}

function painScaleBlockHtml(
  minScore: 0 | 1,
  selected: number | null,
  action: "opqrst-severity" | "ccq-pain",
): string {
  return `
    <div class="pain-scale-block">
      ${painFaceRowHtml(minScore)}
      ${painScoreRowHtml(minScore, selected, action)}
    </div>`;
}

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

const GATE_COPY: Record<GateReason, string> = {
  need_second_language: "請選擇語言",
  need_informant: "請選擇正在回答問題的是誰",
  need_scene_type: "請選擇現場為創傷或非創傷",
  need_complaint_type: "請選擇主訴，或按「不知道／無法回答／跳過」",
  need_trauma_mechanism: "請選擇因／非因交通事故與對應傷類或車種",
  need_trauma_vehicle: "請選擇車輛類型（汽車／機車／腳踏車／行人）",
  need_body_location: "此主訴需點選身體部位後才能下一步",
  need_quality_or_pain:
    "請選擇怎麼不舒服（或「同哪裡不舒服」／疼痛指數），或按「不知道／無法回答／跳過」",
  need_opqrst: "請完成 O／Q／S／T（P／R 可空），或按「不知道／無法回答／跳過」",
  need_duration:
    "請輸入多久了（數字＋單位）或時段，或按「不知道／無法回答／跳過」",
  need_list_selection: "請選擇至少一項，或按「不知道／無法回答／跳過」",
  need_secondary_reason:
    "請選擇次要原因，或按「不知道／無法回答／跳過」",
};

function softGateNote(): string {
  if (state.currentStep === "start") return "";
  const reason = viewFacts(state).gate.reason;
  if (!reason) return "";
  return gateNote(GATE_COPY[reason]);
}

function nextDisabledAttr(): string {
  return viewFacts(state).gate.nextEnabled ? "" : "disabled";
}

function toIntent(
  action: string,
  id: string | undefined,
  stepAttr: string | undefined,
  inputValue?: string,
): Intent | null {
  switch (action) {
    case "lang":
      return id ? { type: "edit", slot: "secondLanguage", value: id } : null;
    case "informant":
      return id ? { type: "edit", slot: "informant", value: id } : null;
    case "sceneType":
      return id ? { type: "edit", slot: "sceneType", value: id } : null;
    case "start-lang-next":
    case "begin":
    case "cc1-next":
    case "opqrst-next":
    case "ccq-next":
    case "ccd-next":
    case "hist-next":
    case "sense-next":
      return { type: "nav", move: "next" };
    case "start-informant-back":
    case "cc1-back":
    case "opqrst-back":
    case "ccq-back":
    case "ccd-back":
    case "hist-back":
    case "sense-back":
      return { type: "nav", move: "back" };
    case "cc1-unknown":
    case "opqrst-unknown":
    case "ccq-unknown":
    case "ccd-unknown":
    case "hist-unknown":
    case "sense-unknown":
      return { type: "nav", move: "unknown" };
    case "cc1-skip":
    case "opqrst-skip":
    case "ccq-skip":
    case "ccd-skip":
    case "hist-skip":
    case "sense-skip":
      return { type: "nav", move: "skip" };
    case "opqrst-onset":
      return id ? { type: "edit", slot: "opqrstOnset", value: id } : null;
    case "opqrst-provocation":
      return id ? { type: "edit", slot: "opqrstProvocation", value: id } : null;
    case "opqrst-quality":
      return id ? { type: "edit", slot: "opqrstQuality", value: id } : null;
    case "opqrst-region":
      return id ? { type: "edit", slot: "opqrstRegion", value: id } : null;
    case "opqrst-radiation":
      return { type: "edit", slot: "opqrstRadiation" };
    case "opqrst-radiation-site":
      return id
        ? { type: "edit", slot: "opqrstRadiationSite", value: id }
        : null;
    case "opqrst-severity":
      return id ? { type: "edit", slot: "opqrstSeverity", value: id } : null;
    case "opqrst-time-pattern":
      return id ? { type: "edit", slot: "opqrstTimePattern", value: id } : null;
    case "opqrst-time-unknown":
      return { type: "edit", slot: "opqrstTimeUnknown" };
    case "cc1-complaint":
      return id ? { type: "edit", slot: "complaintType", value: id } : null;
    case "cc1-note":
      return { type: "edit", slot: "primaryNote", value: inputValue ?? "" };
    case "trauma-ohca":
      return { type: "edit", slot: "traumaOhca" };
    case "trauma-traffic":
      return id ? { type: "edit", slot: "traumaTraffic", value: id } : null;
    case "trauma-vehicle":
      return id ? { type: "edit", slot: "traumaVehicle", value: id } : null;
    case "trauma-injury":
      return id ? { type: "edit", slot: "traumaInjury", value: id } : null;
    case "trauma-fall-height":
      return { type: "edit", slot: "traumaFallHeight", value: inputValue ?? "" };
    case "cc1-body":
      return id ? { type: "edit", slot: "bodyRegion", value: id } : null;
    case "cc1-sub":
      return id ? { type: "edit", slot: "bodySubregion", value: id } : null;
    case "cc1-drill-done":
      return { type: "edit", slot: "bodyDrilldown" };
    case "ccq-quality":
      return id ? { type: "edit", slot: "quality", value: id } : null;
    case "ccq-pain":
      return id ? { type: "edit", slot: "painScore", value: id } : null;
    case "ccd-time":
      return id ? { type: "edit", slot: "timeBucket", value: id } : null;
    case "ccd-time-unit":
      return id ? { type: "edit", slot: "timeUnit", value: id } : null;
    case "ccd-time-amount":
      return { type: "edit", slot: "timeAmount", value: inputValue ?? "" };
    case "ccd-refine":
      return { type: "edit", slot: "timeRefine", value: inputValue ?? "" };
    case "hist-option":
      return id ? { type: "edit", slot: "listOption", value: id } : null;
    case "hist-note":
      return { type: "edit", slot: "listNote", value: inputValue ?? "" };
    case "hist-goto":
      return id && isHistoryStep(id)
        ? { type: "nav", move: "goto", step: id }
        : null;
    case "sense-reason":
      return id ? { type: "edit", slot: "secondaryReason", value: id } : null;
    case "summary-edit":
      return id && isInterviewStep(id)
        ? { type: "nav", move: "edit", step: id }
        : null;
    case "summary-return":
      return { type: "nav", move: "return_to_summary" };
    case "summary-finish":
      return { type: "nav", move: "finish" };
    default:
      void stepAttr;
      return null;
  }
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
    case "chest_opqrst":
      renderChestOpqrst();
      break;
    case "chief_complaint_quality":
      renderChiefComplaintQuality();
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

function answerStatusNote(status: string): string {
  if (status === "unknown") return `<p class="status-note">已標示：不知道</p>`;
  if (status === "skipped") return `<p class="status-note">已標示：跳過</p>`;
  return "";
}

function renderHistoryStep(step: HistoryStepId): void {
  const catalog = getHistoryCatalog(step);
  if (!catalog) return;
  const screen = viewFacts(state).screen;
  if (
    screen.step !== "before" &&
    screen.step !== "intake" &&
    screen.step !== "past_history" &&
    screen.step !== "medications" &&
    screen.step !== "allergies"
  ) {
    return;
  }

  const title = bilingualHeading(catalog.title);
  const selected = new Set(screen.optionIds);
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

  const noteBlock = screen.noteRequired
    ? `
      <section class="section emt-only">
        <h2>EMT 備註「其他」（患者不用打字）</h2>
        <input
          class="refine-input"
          type="text"
          data-action="hist-note"
          data-step="${step}"
          placeholder="簡短註記"
          value="${escapeAttr(screen.note)}"
        />
      </section>
    `
    : "";

  const statusNote = answerStatusNote(screen.answerStatus);

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
      ${softGateNote()}
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="hist-back" data-step="${step}">上一步</button>
        <button type="button" class="ghost" data-action="hist-unknown" data-step="${step}">不知道</button>
        <button type="button" class="ghost" data-action="hist-unknown" data-step="${step}">無法回答</button>
        <button type="button" class="ghost" data-action="hist-skip" data-step="${step}">跳過</button>
        <button type="button" class="primary" data-action="hist-next" data-step="${step}" ${nextDisabledAttr()}>下一步</button>
      </div>
      ${returnSummaryBar()}
    `,
  });
}

function renderStart(): void {
  const screen = viewFacts(state).screen;
  if (screen.step === "start" && screen.startPhase === "informant") {
    renderStartInformant();
    return;
  }
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
      <button type="button" class="primary" data-action="start-lang-next" ${nextDisabledAttr()}>下一步</button>
      ${returnSummaryBar()}
    `,
  });
}

function renderStartInformant(): void {
  const title = bilingualHeading(UI_COPY.informantAsking);
  const sceneTitle = bilingualHeading(UI_COPY.sceneTypeAsking);
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
  const sceneButtons = SCENE_TYPE_OPTIONS.map((opt) => {
    const pressed = state.sceneType === opt.id;
    return `
      <button
        type="button"
        class="option"
        data-action="sceneType"
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
      <section class="section">
        <div class="option-grid cols-2">${informantButtons}</div>
      </section>
      <section class="section grow">
        <h2>${sceneTitle.title}</h2>
        <p class="lead">${sceneTitle.lead}</p>
        <div class="option-grid cols-2">${sceneButtons}</div>
      </section>
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="start-informant-back">上一步</button>
        <button type="button" class="primary" data-action="begin" ${nextDisabledAttr()}>
          ${state.returnToSummary ? "回摘要" : "開始問診"}
        </button>
      </div>
      ${returnSummaryBar()}
    `,
  });
}

function bilingualButtonLabel(labels: BilingualText): string {
  return bilingualButtonHtml(labels, secondLang(), INTERVIEW_PRIMACY);
}

function bilingualHeading(text: BilingualText): { title: string; lead: string } {
  return bilingualHeadingParts(text, secondLang(), INTERVIEW_PRIMACY);
}

function bilingualSectionTitle(text: BilingualText): string {
  return bilingualSectionTitleFor(text, secondLang(), INTERVIEW_PRIMACY);
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
  "chest_opqrst",
  "chief_complaint_quality",
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

function cc1StatusNote(): string {
  const screen = viewFacts(state).screen;
  if (screen.step !== "chief_complaint_1") return "";
  return answerStatusNote(screen.answerStatus);
}

function optionButtons(
  options: { id: string; labels: import("./catalog/labels.js").BilingualText }[],
  action: string,
  selected: string | string[] | null,
): string {
  const selectedSet = new Set(
    Array.isArray(selected) ? selected : selected ? [selected] : [],
  );
  return options
    .map((opt) => {
      const pressed = selectedSet.has(opt.id);
      return `
      <button type="button" class="option" data-action="${action}" data-id="${opt.id}" aria-pressed="${pressed}">
        ${bilingualButtonLabel(opt.labels)}
      </button>`;
    })
    .join("");
}

function renderChestOpqrst(): void {
  const screen = viewFacts(state).screen;
  if (screen.step !== "chest_opqrst") return;
  const sourceNote = bilingualInline(
    PAIN_SCALE_SOURCE_NOTE,
    secondLang(),
    INTERVIEW_PRIMACY,
  );
  const unitButtons = TIME_UNITS.map((u) => {
    const pressed = screen.timeUnit === u.id;
    return `
      <button type="button" class="option unit-chip" data-action="ccd-time-unit" data-id="${u.id}" aria-pressed="${pressed}">
        ${bilingualButtonLabel(u.labels)}
      </button>`;
  }).join("");
  const statusNote = answerStatusNote(screen.answerStatus);

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">主訴</p>
        <h1>胸痛／胸悶 · 怎麼發生的</h1>
        <p class="lead">Chest pain / tightness · how it started</p>
      </header>
    `,
    body: `
      <section class="section">
        <h2>O</h2>
        <div class="option-grid cols-2">${optionButtons(OPQRST_ONSET, "opqrst-onset", screen.onsetId)}</div>
      </section>
      <section class="section">
        <h2>P</h2>
        <div class="option-grid cols-2">${optionButtons(OPQRST_PROVOCATION, "opqrst-provocation", screen.provocationIds)}</div>
      </section>
      <section class="section">
        <h2>Q</h2>
        <div class="option-grid cols-2">${optionButtons(OPQRST_QUALITY, "opqrst-quality", screen.qualityId)}</div>
      </section>
      <section class="section">
        <h2>R</h2>
        <div class="option-grid cols-2">${optionButtons(OPQRST_REGIONS, "opqrst-region", screen.regionIds)}</div>
        <button type="button" class="option" data-action="opqrst-radiation" aria-pressed="${screen.radiation}">
          ${bilingualButtonLabel(OPQRST_RADIATION_TOGGLE_LABELS)}
        </button>
        ${
          screen.radiation
            ? `<div class="option-grid cols-2">${optionButtons(OPQRST_RADIATION_SITES, "opqrst-radiation-site", screen.radiationSiteIds)}</div>`
            : ""
        }
      </section>
      <section class="section">
        <h2>S · 0–10</h2>
        ${painScaleBlockHtml(0, screen.severity, "opqrst-severity")}
        <p class="source-note">${escapeHtml(sourceNote.primary)} · ${escapeHtml(sourceNote.secondary)}
          <a href="${PAIN_SCALE_SOURCE_URL}" target="_blank" rel="noopener noreferrer">medicalxpress.com</a>
        </p>
      </section>
      <section class="section">
        <h2>T</h2>
        <div class="option-grid cols-2">${optionButtons(OPQRST_TIME_PATTERN, "opqrst-time-pattern", screen.timePattern)}</div>
        <div class="opqrst-time-entry">
          <span class="duration-prefix">
            <span class="zh">約</span>
            <span class="sub">About</span>
          </span>
          <input
            class="duration-amount"
            type="number"
            min="1"
            inputmode="numeric"
            placeholder="＿＿"
            data-action="ccd-time-amount"
            value="${screen.timeAmount ?? ""}"
            ${screen.timeUnknown ? "disabled" : ""}
          />
          <div class="option-grid cols-3 unit-grid">${unitButtons}</div>
        </div>
        <button type="button" class="option" data-action="opqrst-time-unknown" aria-pressed="${screen.timeUnknown}">
          ${bilingualButtonLabel(OPQRST_TIME_UNKNOWN_LABELS)}
        </button>
      </section>
      ${statusNote}
      ${softGateNote()}
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="opqrst-back">上一步</button>
        <button type="button" class="ghost" data-action="opqrst-unknown">不知道</button>
        <button type="button" class="ghost" data-action="opqrst-unknown">無法回答</button>
        <button type="button" class="ghost" data-action="opqrst-skip">跳過</button>
        <button type="button" class="primary" data-action="opqrst-next" ${nextDisabledAttr()}>下一步</button>
      </div>
      ${returnSummaryBar()}
    `,
  });
}

function cc1ActionBar(): string {
  return `
    <div class="actions">
      <button type="button" class="secondary" data-action="cc1-back">上一步</button>
      <button type="button" class="ghost" data-action="cc1-unknown">不知道</button>
      <button type="button" class="ghost" data-action="cc1-unknown">無法回答</button>
      <button type="button" class="ghost" data-action="cc1-skip">跳過</button>
      <button type="button" class="primary" data-action="cc1-next" ${nextDisabledAttr()}>下一步</button>
    </div>
    ${returnSummaryBar()}
  `;
}

function renderChiefComplaint1(): void {
  const screen = viewFacts(state).screen;
  if (screen.step !== "chief_complaint_1") return;
  const title = bilingualHeading(UI_COPY.cc1Title);

  if (screen.usesTraumaPrimary) {
    if (screen.traumaStage === "body") {
      const drillRegion = screen.drilldownRegionId
        ? getBodyRegion(screen.drilldownRegionId)
        : undefined;
      if (drillRegion && drillRegion.subregions.length > 0) {
        paintBodyDrilldown({
          eyebrow: "主訴 · 身體部位",
          titleSuffix: " — finer location",
          region: drillRegion,
          selectedSubIds: screen.bodySubregionIds,
          subAction: "cc1-sub",
          doneAction: "cc1-drill-done",
          leadZhSuffix: "更精確位置（選填）",
        });
        return;
      }
      const bodyTitle = bilingualSectionTitle(UI_COPY.traumaBodyTitle);
      getView().innerHTML = screenLayout({
        header: `
          <header class="step-header">
            <p class="eyebrow">主訴 · 身體部位</p>
            <h1>${title.title}</h1>
            <p class="lead">${title.lead}</p>
          </header>
        `,
        body: `
          <section class="section grow">
            <h2>${bodyTitle}</h2>
            ${renderBodyMap(screen.bodyRegionIds, "cc1-body")}
          </section>
          ${cc1StatusNote()}
          ${softGateNote()}
        `,
        actions: cc1ActionBar(),
      });
      return;
    }

    const mechTitle = bilingualSectionTitle(UI_COPY.traumaMechanismTitle);
    const ohcaPressed = screen.traumaOhca;
    const trafficButtons = TRAUMA_TRAFFIC_OPTIONS.map((opt) => {
      const pressed = screen.traumaTraffic === opt.id;
      return `
        <button type="button" class="option" data-action="trauma-traffic" data-id="${opt.id}" aria-pressed="${pressed}">
          ${bilingualButtonLabel(opt.labels)}
        </button>`;
    }).join("");
    const vehicleBlock =
      screen.traumaTraffic === "traffic"
        ? `
      <section class="section">
        <h2>${bilingualSectionTitle(UI_COPY.traumaVehicleTitle)}</h2>
        <div class="option-grid cols-2">${TRAUMA_VEHICLE_OPTIONS.map((opt) => {
          const pressed = screen.traumaVehicleId === opt.id;
          return `
            <button type="button" class="option" data-action="trauma-vehicle" data-id="${opt.id}" aria-pressed="${pressed}">
              ${bilingualButtonLabel(opt.labels)}
            </button>`;
        }).join("")}</div>
      </section>`
        : "";
    const injuryBlock =
      screen.traumaTraffic === "non_traffic"
        ? `
      <section class="section grow">
        <h2>${bilingualSectionTitle(UI_COPY.traumaInjuryTitle)}</h2>
        <div class="option-grid cols-2">${TRAUMA_INJURY_OPTIONS.map((opt) => {
          const pressed = screen.traumaInjuryTypeId === opt.id;
          return `
            <button type="button" class="option" data-action="trauma-injury" data-id="${opt.id}" aria-pressed="${pressed}">
              ${bilingualButtonLabel(opt.labels)}
            </button>`;
        }).join("")}</div>
        ${
          screen.traumaAsksFallHeight
            ? `
        <label class="field">
          <span class="field-label">${bilingualSectionTitle(UI_COPY.traumaFallHeight)}</span>
          <input type="number" min="0" step="0.1" inputmode="decimal" data-action="trauma-fall-height" value="${
            screen.traumaFallHeightMeters ?? ""
          }" />
          ${
            screen.traumaFallHeightMeters != null
              ? `<p class="lead">${escapeHtml(
                  formatMetersWithImperial(screen.traumaFallHeightMeters, "zh"),
                )} · ${escapeHtml(
                  formatMetersWithImperial(screen.traumaFallHeightMeters, "en"),
                )}</p>`
              : ""
          }
        </label>`
            : ""
        }
      </section>`
        : "";

    getView().innerHTML = screenLayout({
      header: `
        <header class="step-header">
          <p class="eyebrow">主訴 · 機轉</p>
          <h1>${title.title}</h1>
          <p class="lead">${title.lead}</p>
        </header>
      `,
      body: `
        <section class="section">
          <button type="button" class="option" data-action="trauma-ohca" aria-pressed="${ohcaPressed}">
            ${bilingualButtonLabel(TRAUMA_OHCA_LABELS)}
          </button>
        </section>
        <section class="section">
          <h2>${mechTitle}</h2>
          <div class="option-grid cols-2">${trafficButtons}</div>
        </section>
        ${vehicleBlock}
        ${injuryBlock}
        ${cc1StatusNote()}
        ${softGateNote()}
      `,
      actions: cc1ActionBar(),
    });
    return;
  }

  const nonTrauma = screen.usesNonTraumaPrimary;
  const drillRegion = screen.drilldownRegionId
    ? getBodyRegion(screen.drilldownRegionId)
    : undefined;

  if (!nonTrauma && drillRegion && drillRegion.subregions.length > 0) {
    paintBodyDrilldown({
      eyebrow: "主訴 · 1／3",
      titleSuffix: " — finer location",
      region: drillRegion,
      selectedSubIds: screen.bodySubregionIds,
      subAction: "cc1-sub",
      doneAction: "cc1-drill-done",
      leadZhSuffix: "更精確位置（選填）",
    });
    return;
  }

  const catalog = NON_TRAUMA_PRIMARY_REASONS;
  const complaintButtons = catalog.map((opt) => {
    const pressed = screen.complaintTypeIds.includes(opt.id);
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

  const noteBlock =
    nonTrauma && screen.primaryOpensNote
      ? `
      <section class="section emt-only compact">
        <h2>EMT 備註「其他」（患者不用打字）</h2>
        <label class="field">
          <span class="field-label">短註</span>
          <input
            type="text"
            data-action="cc1-note"
            value="${escapeAttr(screen.primaryNote)}"
          />
        </label>
      </section>`
      : "";

  const what = bilingualSectionTitle(UI_COPY.cc1What);

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">主訴 · 1／3</p>
        <h1>${title.title}</h1>
        <p class="lead">${title.lead}</p>
      </header>
    `,
    body: `
      <section class="section grow">
        <h2>${what}</h2>
        <div class="option-grid cols-2 fill-grid">${complaintButtons}</div>
      </section>
      ${noteBlock}
      ${cc1StatusNote()}
      ${softGateNote()}
    `,
    actions: cc1ActionBar(),
  });
}

function renderChiefComplaintQuality(): void {
  const screen = viewFacts(state).screen;
  if (screen.step !== "chief_complaint_quality") return;
  const pain = screen.showsPainScale;

  const qualityButtons = visibleQualityOptions(pain)
    .map((opt) => {
      const pressed = screen.qualityIds.includes(opt.id);
      return `
        <button
          type="button"
          class="option"
          data-action="ccq-quality"
          data-id="${opt.id}"
          aria-pressed="${pressed}"
        >
          ${bilingualButtonLabel(opt.labels)}
        </button>
      `;
    })
    .join("");

  const statusNote = answerStatusNote(screen.answerStatus);

  const title = bilingualHeading(UI_COPY.ccQualityTitle);
  const quality = bilingualSectionTitle(UI_COPY.ccQuality);
  const painTitle = bilingualSectionTitle(UI_COPY.ccPain);

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
        ${painScaleBlockHtml(1, screen.painScore, "ccq-pain")}
      </section>`
          : ""
      }
      ${statusNote}
      ${softGateNote()}
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="ccq-back">上一步</button>
        <button type="button" class="ghost" data-action="ccq-unknown">不知道</button>
        <button type="button" class="ghost" data-action="ccq-unknown">無法回答</button>
        <button type="button" class="ghost" data-action="ccq-skip">跳過</button>
        <button type="button" class="primary" data-action="ccq-next" ${nextDisabledAttr()}>下一步</button>
      </div>
      ${returnSummaryBar()}
    `,
  });
}

function durationLabelFromScreen(
  screen: {
    timeAmount: number | null;
    timeUnit: "minutes" | "hours" | "days" | null;
    timeBucketId: string | null;
  },
  lang: "zh" | SecondLanguage,
): string {
  if (screen.timeAmount && screen.timeUnit) {
    return formatApproxDuration(screen.timeAmount, screen.timeUnit, lang);
  }
  if (screen.timeBucketId) {
    const labels = TIME_BUCKETS.find((b) => b.id === screen.timeBucketId)?.labels;
    if (!labels) return screen.timeBucketId;
    return lang === "zh" ? labels.zh : labels[lang];
  }
  return "";
}

function renderChiefComplaintDuration(): void {
  const screen = viewFacts(state).screen;
  if (screen.step !== "chief_complaint_duration") return;
  const lang = secondLang();

  const justNow = TIME_BUCKETS.find((b) => b.id === "just_now");
  const justNowButton = justNow
    ? `
      <button
        type="button"
        class="option"
        data-action="ccd-time"
        data-id="${justNow.id}"
        aria-pressed="${screen.timeBucketId === justNow.id}"
      >
        ${bilingualButtonLabel(justNow.labels)}
      </button>
    `
    : "";

  const unitButtons = TIME_UNITS.map((unit) => {
    const pressed = screen.timeUnit === unit.id;
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
      const pressed = screen.timeBucketId === opt.id;
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

  const statusNote = answerStatusNote(screen.answerStatus);

  const title = bilingualHeading(UI_COPY.ccDurationTitle);
  const duration = bilingualSectionTitle(UI_COPY.ccDuration);
  const about = bilingualInline(UI_COPY.ccDurationAbout, lang, INTERVIEW_PRIMACY);
  const previewLabel = bilingualInline(
    UI_COPY.ccDurationPreview,
    lang,
    INTERVIEW_PRIMACY,
  );
  const period = bilingualSectionTitle(UI_COPY.ccPeriod);

  const previewZh = durationLabelFromScreen(screen, "zh");
  const previewOther = durationLabelFromScreen(screen, lang);
  const previewBlock =
    previewZh || previewOther
      ? `<p class="duration-preview" aria-live="polite">
          <span class="preview-label">${previewLabel.primary} · ${previewLabel.secondary}</span>
          <span class="zh">${previewOther || "—"}</span>
          <span class="sub">${previewZh || "—"}</span>
        </p>`
      : `<p class="duration-preview is-empty" aria-live="polite">
          <span class="preview-label">${previewLabel.primary} · ${previewLabel.secondary}</span>
          <span class="zh">${about.primary} ＿＿</span>
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
            <span class="zh">${about.primary}</span>
            <span class="sub">${about.secondary}</span>
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
            value="${screen.timeAmount ?? ""}"
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
          value="${escapeAttr(screen.timeRefine)}"
        />
      </section>
      ${statusNote}
      ${softGateNote()}
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="ccd-back">上一步</button>
        <button type="button" class="ghost" data-action="ccd-unknown">不知道</button>
        <button type="button" class="ghost" data-action="ccd-unknown">無法回答</button>
        <button type="button" class="ghost" data-action="ccd-skip">跳過</button>
        <button type="button" class="primary" data-action="ccd-next" ${nextDisabledAttr()}>下一步</button>
      </div>
      ${returnSummaryBar()}
    `,
  });
}

function paintBodyDrilldown(opts: {
  eyebrow: string;
  titleSuffix?: string;
  region: NonNullable<ReturnType<typeof getBodyRegion>>;
  selectedSubIds: string[];
  subAction: string;
  doneAction: string;
  leadZhSuffix: string;
  chromeExtra?: string;
}): void {
  const subButtons = opts.region.subregions
    .map((sub) => {
      const pressed = opts.selectedSubIds.includes(sub.id);
      return `
        <button
          type="button"
          class="option"
          data-action="${opts.subAction}"
          data-id="${sub.id}"
          aria-pressed="${pressed}"
        >
          ${bilingualButtonLabel(sub.labels)}
        </button>
      `;
    })
    .join("");
  const regionPair = bilingualHeadingParts(
    opts.region.labels,
    secondLang(),
    INTERVIEW_PRIMACY,
  );
  const title = opts.titleSuffix
    ? `${regionPair.title}${opts.titleSuffix}`
    : regionPair.title;
  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">${opts.eyebrow}</p>
        <h1>${title}</h1>
        <p class="lead">${regionPair.lead} — ${opts.leadZhSuffix}</p>
      </header>
    `,
    body: `<div class="option-grid cols-2 fill-grid">${subButtons}</div>`,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="${opts.doneAction}">完成細分／略過</button>
      </div>
      ${opts.chromeExtra ?? ""}
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
  const screen = viewFacts(state).screen;
  if (screen.step !== "other_symptoms") return;

  const catalog = secondaryReasonsForScene(state.sceneType);
  const reasonButtons = catalog
    .map((opt) => {
      const pressed = screen.reasonIds.includes(opt.id);
      return `
      <button type="button" class="option" data-action="sense-reason" data-id="${opt.id}" aria-pressed="${pressed}">
        ${bilingualButtonLabel(opt.labels)}
      </button>`;
    })
    .join("");

  const statusNote = answerStatusNote(screen.answerStatus);

  const title = bilingualHeading(UI_COPY.senseTitle);
  const lead = bilingualInline(UI_COPY.senseLead, secondLang(), INTERVIEW_PRIMACY);
  const eyebrow =
    screen.secondaryCatalog === "trauma" ? "次要原因 · 創傷感受" : "次要原因";

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title.title}</h1>
        <p class="lead">${title.lead} · ${lead.primary}</p>
      </header>
    `,
    body: `
      <section class="section grow">
        <div class="option-grid cols-2 fill-grid">${reasonButtons}</div>
      </section>
      ${statusNote}
      ${softGateNote()}
    `,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="sense-back">上一步</button>
        <button type="button" class="ghost" data-action="sense-unknown">不知道</button>
        <button type="button" class="ghost" data-action="sense-unknown">無法回答</button>
        <button type="button" class="ghost" data-action="sense-skip">跳過</button>
        <button type="button" class="primary" data-action="sense-next" ${nextDisabledAttr()}>看摘要</button>
      </div>
      ${returnSummaryBar()}
    `,
  });
}

function renderSummary(): void {
  const lang = secondLang();
  const header = bilingualHeadingParts(
    SUMMARY_COPY.title,
    lang,
    SUMMARY_PRIMACY,
  );
  const eyebrow = bilingualInline(SUMMARY_COPY.eyebrow, lang, SUMMARY_PRIMACY);
  const lead = bilingualInline(SUMMARY_COPY.lead, lang, SUMMARY_PRIMACY);
  const edit = bilingualInline(SUMMARY_COPY.edit, lang, SUMMARY_PRIMACY);
  const copyHint = bilingualInline(SUMMARY_COPY.copyHint, lang, SUMMARY_PRIMACY);

  const facts = viewFacts(state);
  const summaryScreen =
    facts.screen.step === "summary" ? facts.screen : null;
  const sections = (summaryScreen?.sections ?? [])
    .map((s) => {
      const tone = s.obtained ? "" : " is-missing";
      const label = orderPair(s.label, SUMMARY_PRIMACY);
      const value = orderPair(s.value, SUMMARY_PRIMACY);
      return `
        <button type="button" class="summary-row${tone}" data-action="summary-edit" data-id="${s.editStep}">
          <span class="summary-label">
            <span class="zh">${escapeHtml(label.primary)}</span>
            <span class="sub">${escapeHtml(label.secondary)}</span>
          </span>
          <span class="summary-value">
            <span class="zh">${escapeHtml(value.primary)}</span>
            <span class="sub">${escapeHtml(value.secondary)}</span>
          </span>
          <span class="summary-edit">
            <span class="zh">${escapeHtml(edit.primary)}</span>
            <span class="sub">${escapeHtml(edit.secondary)}</span>
          </span>
        </button>
      `;
    })
    .join("");

  getView().innerHTML = screenLayout({
    header: `
      <header class="step-header">
        <p class="eyebrow"><span class="zh">${escapeHtml(eyebrow.primary)}</span> · <span class="sub">${escapeHtml(eyebrow.secondary)}</span></p>
        <h1>${escapeHtml(header.title)}</h1>
        <p class="lead">${escapeHtml(header.lead)}</p>
        <p class="lead subtle">${escapeHtml(lead.primary)} · ${escapeHtml(lead.secondary)}</p>
      </header>
    `,
    body: `<div class="summary-list fill-grid">${sections}</div>`,
    actions: `
      <div class="actions">
        <button type="button" class="secondary" data-action="summary-copy">
          <span class="zh">${escapeHtml(copyHint.primary)}</span>
          <span class="sub">${escapeHtml(copyHint.secondary)}</span>
        </button>
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
  if (!action) return;

  if (action === "summary-copy") {
    const screen = viewFacts(state).screen;
    const text =
      screen.step === "summary" ? screen.plainText : "";
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

  const intent = toIntent(action, target.dataset.id, target.dataset.step);
  if (!intent) return;
  state = apply(state, intent);
  render();
});

function refreshDurationNextAndPreview(): void {
  const nextBtn = app!.querySelector<HTMLButtonElement>(
    "button[data-action='ccd-next']",
  );
  if (nextBtn) {
    nextBtn.disabled = !viewFacts(state).gate.nextEnabled;
  }
  const screen = viewFacts(state).screen;
  if (screen.step !== "chief_complaint_duration") return;
  const preview = app!.querySelector(".duration-preview");
  if (!preview) return;
  const lang = secondLang();
  const previewLabel = bilingualInline(
    UI_COPY.ccDurationPreview,
    lang,
    INTERVIEW_PRIMACY,
  );
  const about = bilingualInline(UI_COPY.ccDurationAbout, lang, INTERVIEW_PRIMACY);
  const zh = durationLabelFromScreen(screen, "zh");
  const other = durationLabelFromScreen(screen, lang);
  if (zh || other) {
    preview.classList.remove("is-empty");
    preview.innerHTML = `
      <span class="preview-label">${previewLabel.primary} · ${previewLabel.secondary}</span>
      <span class="zh">${other || "—"}</span>
      <span class="sub">${zh || "—"}</span>
    `;
  } else {
    preview.classList.add("is-empty");
    preview.innerHTML = `
      <span class="preview-label">${previewLabel.primary} · ${previewLabel.secondary}</span>
      <span class="zh">${about.primary} ＿＿</span>
      <span class="sub">約＿＿分鐘／小時／日</span>
    `;
  }
  for (const btn of app!.querySelectorAll<HTMLButtonElement>(
    "button[data-action='ccd-time-unit']",
  )) {
    btn.setAttribute(
      "aria-pressed",
      String(btn.dataset.id === screen.timeUnit),
    );
  }
  for (const btn of app!.querySelectorAll<HTMLButtonElement>(
    "button[data-action='ccd-time']",
  )) {
    btn.setAttribute(
      "aria-pressed",
      String(btn.dataset.id === screen.timeBucketId),
    );
  }
}

app.addEventListener("input", (event) => {
  const target = event.target as HTMLInputElement;
  const action = target.dataset.action;
  if (!action) return;

  const intent = toIntent(action, target.dataset.id, target.dataset.step, target.value);
  if (!intent) return;
  state = apply(state, intent);

  if (action === "ccd-time-amount" || action === "ccd-refine") {
    refreshDurationNextAndPreview();
    const opqrstNext = app!.querySelector<HTMLButtonElement>(
      "button[data-action='opqrst-next']",
    );
    if (opqrstNext) {
      opqrstNext.disabled = !viewFacts(state).gate.nextEnabled;
    }
    if (action === "ccd-refine") {
      const nextBtn = app!.querySelector<HTMLButtonElement>(
        "button[data-action='ccd-next']",
      );
      if (nextBtn) nextBtn.disabled = !viewFacts(state).gate.nextEnabled;
    }
    return;
  }

  if (action === "hist-note") {
    const nextBtn = app!.querySelector<HTMLButtonElement>(
      "button[data-action='hist-next']",
    );
    if (nextBtn) nextBtn.disabled = !viewFacts(state).gate.nextEnabled;
  }
});

render();
