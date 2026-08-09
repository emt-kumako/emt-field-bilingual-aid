import {
  OPQRST_ONSET,
  OPQRST_PROVOCATION,
  OPQRST_QUALITY,
  OPQRST_RADIATION_SITES,
  OPQRST_REGIONS,
  OPQRST_TIME_PATTERN,
} from "../catalog/chest-opqrst.js";
import { nextSelectedIds } from "./option-selection.js";
import {
  durationSatisfiedFromOpqrst,
  getChiefComplaintDurationDetail,
  setTimeAmount,
  setTimePattern,
  setTimeUnit,
  setTimeUnknown,
} from "./chief-complaint-duration.js";
import { getChiefComplaint1Detail } from "./chief-complaint-1.js";
import {
  type CaseState,
  type ChestOpqrstDetail,
  type DurationTimePattern,
  emptyChestOpqrstDetail,
  emptyStepAnswer,
} from "./types.js";

function readDetail(state: CaseState): ChestOpqrstDetail {
  const answer = state.answers.chest_opqrst;
  if (!answer) return emptyChestOpqrstDetail();
  const d = answer.detail as Partial<ChestOpqrstDetail>;
  const base = emptyChestOpqrstDetail();
  const pattern = d.timePattern;
  return {
    ...base,
    onsetId: d.onsetId ?? null,
    provocationIds: d.provocationIds ?? [],
    qualityId: d.qualityId ?? null,
    regionIds: d.regionIds ?? [],
    radiation: d.radiation === true,
    radiationSiteIds: d.radiationSiteIds ?? [],
    severity:
      typeof d.severity === "number" &&
      Number.isInteger(d.severity) &&
      d.severity >= 0 &&
      d.severity <= 10
        ? d.severity
        : null,
    timePattern:
      pattern === "intermittent" || pattern === "continuous" ? pattern : null,
  };
}

function writeDetail(state: CaseState, detail: ChestOpqrstDetail): CaseState {
  const hasContent =
    detail.onsetId !== null ||
    detail.provocationIds.length > 0 ||
    detail.qualityId !== null ||
    detail.regionIds.length > 0 ||
    detail.radiation ||
    detail.radiationSiteIds.length > 0 ||
    detail.severity !== null ||
    detail.timePattern !== null;

  return {
    ...state,
    answers: {
      ...state.answers,
      chest_opqrst: {
        ...emptyStepAnswer(),
        status: hasContent ? "answered" : "empty",
        optionIds: [
          ...(detail.onsetId ? [detail.onsetId] : []),
          ...detail.provocationIds,
          ...(detail.qualityId ? [detail.qualityId] : []),
          ...detail.regionIds,
          ...(detail.severity !== null ? [`s${detail.severity}`] : []),
          ...(detail.timePattern ? [detail.timePattern] : []),
        ],
        detail: { ...detail },
      },
    },
  };
}

export function getChestOpqrstDetail(state: CaseState): ChestOpqrstDetail {
  return readDetail(state);
}

export function isChestOpqrstPath(state: CaseState): boolean {
  return (
    state.sceneType === "non_trauma" &&
    getChiefComplaint1Detail(state).complaintTypeIds.includes("chest_pain")
  );
}

export function setOpqrstOnset(state: CaseState, onsetId: string): CaseState {
  if (!OPQRST_ONSET.some((o) => o.id === onsetId)) return state;
  const detail = readDetail(state);
  return writeDetail(state, {
    ...detail,
    onsetId: detail.onsetId === onsetId ? null : onsetId,
  });
}

export function toggleOpqrstProvocation(
  state: CaseState,
  id: string,
): CaseState {
  const meta = OPQRST_PROVOCATION.map((o) => ({ id: o.id }));
  if (!meta.some((o) => o.id === id)) return state;
  const detail = readDetail(state);
  return writeDetail(state, {
    ...detail,
    provocationIds: nextSelectedIds(detail.provocationIds, meta, id, "multi"),
  });
}

export function setOpqrstQuality(state: CaseState, qualityId: string): CaseState {
  if (!OPQRST_QUALITY.some((o) => o.id === qualityId)) return state;
  const detail = readDetail(state);
  return writeDetail(state, {
    ...detail,
    qualityId: detail.qualityId === qualityId ? null : qualityId,
  });
}

export function toggleOpqrstRegion(state: CaseState, id: string): CaseState {
  const meta = OPQRST_REGIONS.map((o) => ({ id: o.id }));
  if (!meta.some((o) => o.id === id)) return state;
  const detail = readDetail(state);
  return writeDetail(state, {
    ...detail,
    regionIds: nextSelectedIds(detail.regionIds, meta, id, "multi"),
  });
}

export function setOpqrstRadiation(state: CaseState, on: boolean): CaseState {
  const detail = readDetail(state);
  return writeDetail(state, {
    ...detail,
    radiation: on,
    radiationSiteIds: on ? detail.radiationSiteIds : [],
  });
}

export function toggleOpqrstRadiationSite(
  state: CaseState,
  id: string,
): CaseState {
  const meta = OPQRST_RADIATION_SITES.map((o) => ({ id: o.id }));
  if (!meta.some((o) => o.id === id)) return state;
  const detail = readDetail(state);
  if (!detail.radiation) return state;
  return writeDetail(state, {
    ...detail,
    radiationSiteIds: nextSelectedIds(
      detail.radiationSiteIds,
      meta,
      id,
      "multi",
    ),
  });
}

export function setOpqrstSeverity(state: CaseState, score: number): CaseState {
  if (!Number.isInteger(score) || score < 0 || score > 10) return state;
  return writeDetail(state, { ...readDetail(state), severity: score });
}

export function setOpqrstTimePattern(
  state: CaseState,
  pattern: DurationTimePattern,
): CaseState {
  if (!OPQRST_TIME_PATTERN.some((o) => o.id === pattern)) return state;
  const detail = readDetail(state);
  const next = detail.timePattern === pattern ? null : pattern;
  let nextState = writeDetail(state, { ...detail, timePattern: next });
  nextState = setTimePattern(nextState, next);
  return nextState;
}

export function setOpqrstTimeAmount(state: CaseState, raw: string): CaseState {
  let next = setTimeUnknown(state, false);
  next = setTimeAmount(next, raw);
  return next;
}

export function setOpqrstTimeUnit(state: CaseState, unitId: string): CaseState {
  let next = setTimeUnknown(state, false);
  next = setTimeUnit(next, unitId);
  return next;
}

export function setOpqrstTimeUnknown(state: CaseState): CaseState {
  const detail = readDetail(state);
  if (!detail.timePattern) return state;
  const alreadyUnknown =
    getChiefComplaintDurationDetail(state).timeUnknown === true;
  return setTimeUnknown(state, !alreadyUnknown);
}

export function canCompleteChestOpqrst(state: CaseState): boolean {
  const answer = state.answers.chest_opqrst;
  if (!answer) return false;
  if (answer.status === "unknown" || answer.status === "skipped") return true;
  const detail = readDetail(state);
  if (!detail.onsetId || !detail.qualityId || detail.severity === null) {
    return false;
  }
  return durationSatisfiedFromOpqrst(state);
}

export function markChestOpqrstUnknown(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      chest_opqrst: {
        ...emptyStepAnswer(),
        status: "unknown",
        detail: emptyChestOpqrstDetail(),
      },
    },
  };
}

export function skipChestOpqrst(state: CaseState): CaseState {
  return {
    ...state,
    answers: {
      ...state.answers,
      chest_opqrst: {
        ...emptyStepAnswer(),
        status: "skipped",
        detail: emptyChestOpqrstDetail(),
      },
    },
  };
}

/** Finish OPQRST → 之前 (skips quality + duration pages). */
export function completeChestOpqrst(state: CaseState): CaseState {
  if (!canCompleteChestOpqrst(state)) return state;
  return { ...state, currentStep: "before" };
}

export function goBackFromChestOpqrst(state: CaseState): CaseState {
  return { ...state, currentStep: "chief_complaint_1" };
}
