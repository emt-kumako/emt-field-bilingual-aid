/** Second language shown beside Chinese (anchor). */
export type SecondLanguage =
  | "en"
  | "vi"
  | "id"
  | "fil"
  | "th"
  | "ja"
  | "ko"
  | "de"
  | "fr"
  | "es";

export type Informant = "self" | "family" | "friend" | "other";

/** PCR-aligned scene branch chosen on the informant Start page. */
export type SceneType = "trauma" | "non_trauma";

/** Two-page prelude before the chief-complaint interview. */
export type StartPhase = "language" | "informant";

/** Soft gate: why Next stays disabled. UI maps to copy. */
export type GateReason =
  | "need_second_language"
  | "need_informant"
  | "need_scene_type"
  | "need_complaint_type"
  | "need_trauma_mechanism"
  | "need_trauma_vehicle"
  | "need_body_location"
  | "need_quality_or_pain"
  | "need_duration"
  | "need_opqrst"
  | "need_list_selection"
  | "need_other_symptom_or_body";

/** Interview mnemonic steps after start. */
export type InterviewStep =
  | "start"
  | "chief_complaint_1"
  | "chest_opqrst"
  | "chief_complaint_quality"
  | "chief_complaint_duration"
  | "before"
  | "intake"
  | "past_history"
  | "medications"
  | "allergies"
  | "other_symptoms"
  | "summary";

export type AnswerStatus = "answered" | "unknown" | "skipped" | "empty";

export type TraumaTrafficRelated = "traffic" | "non_traffic";
export type TraumaPrimaryStage = "mechanism" | "body";

/** 主訴 step 1 payload stored in answers.chief_complaint_1.detail */
export type ChiefComplaint1Detail = {
  complaintTypeIds: string[];
  bodyRegionIds: string[];
  bodySubregionIds: string[];
  /** When set, UI is on optional fine location for this coarse region. */
  drilldownRegionId: string | null;
  /** Trauma path: OHCA toggle (mechanism still required). */
  traumaOhca: boolean;
  traumaTraffic: TraumaTrafficRelated | null;
  traumaVehicleId: string | null;
  traumaInjuryTypeId: string | null;
  /** Canonical meters when injury is fall-from-height. */
  traumaFallHeightMeters: number | null;
  traumaStage: TraumaPrimaryStage;
};

export type StepAnswer = {
  status: AnswerStatus;
  /** Selected option ids when status is answered. */
  optionIds: string[];
  /** EMT-only free note (e.g. 其他). */
  note: string;
  /** Opaque step-specific payload (time refine, pain score, etc.). */
  detail: Record<string, unknown>;
};

export function emptyChiefComplaint1Detail(): ChiefComplaint1Detail {
  return {
    complaintTypeIds: [],
    bodyRegionIds: [],
    bodySubregionIds: [],
    drilldownRegionId: null,
    traumaOhca: false,
    traumaTraffic: null,
    traumaVehicleId: null,
    traumaInjuryTypeId: null,
    traumaFallHeightMeters: null,
    traumaStage: "mechanism",
  };
}

/** 主訴「怎麼不舒服」payload in answers.chief_complaint_quality.detail */
export type ChiefComplaintQualityDetail = {
  qualityIds: string[];
  /** 1–10 when pain; otherwise null. */
  painScore: number | null;
};

export function emptyChiefComplaintQualityDetail(): ChiefComplaintQualityDetail {
  return {
    qualityIds: [],
    painScore: null,
  };
}

export type DurationTimePattern = "intermittent" | "continuous";

/** 主訴「多久了」payload in answers.chief_complaint_duration.detail */
export type ChiefComplaintDurationDetail = {
  timeMode: "duration" | "period" | null;
  timeBucketId: string | null;
  timeAmount: number | null;
  timeUnit: "minutes" | "hours" | "days" | null;
  timeRefine: string;
  /** From OPQRST T / optional on duration. */
  timePattern: DurationTimePattern | null;
  /** 時間不詳 — satisfies duration when set with a pattern from OPQRST. */
  timeUnknown: boolean;
};

export function emptyChiefComplaintDurationDetail(): ChiefComplaintDurationDetail {
  return {
    timeMode: null,
    timeBucketId: null,
    timeAmount: null,
    timeUnit: null,
    timeRefine: "",
    timePattern: null,
    timeUnknown: false,
  };
}

/** Non-trauma chest pain／tightness OPQRST page. */
export type ChestOpqrstDetail = {
  onsetId: string | null;
  provocationIds: string[];
  qualityId: string | null;
  regionIds: string[];
  radiation: boolean;
  radiationSiteIds: string[];
  /** 0–10 inclusive. */
  severity: number | null;
  timePattern: DurationTimePattern | null;
};

export function emptyChestOpqrstDetail(): ChestOpqrstDetail {
  return {
    onsetId: null,
    provocationIds: [],
    qualityId: null,
    regionIds: [],
    radiation: false,
    radiationSiteIds: [],
    severity: null,
    timePattern: null,
  };
}

/** 感 payload in answers.other_symptoms.detail */
export type OtherSymptomsDetail = {
  symptomIds: string[];
  bodyRegionIds: string[];
  bodySubregionIds: string[];
  drilldownRegionId: string | null;
};

export function emptyOtherSymptomsDetail(): OtherSymptomsDetail {
  return {
    symptomIds: [],
    bodyRegionIds: [],
    bodySubregionIds: [],
    drilldownRegionId: null,
  };
}

/** Steps cleared when Scene type changes (primary／secondary path). */
export const SCENE_TYPE_DEPENDENT_STEPS: InterviewStep[] = [
  "chief_complaint_1",
  "chest_opqrst",
  "chief_complaint_quality",
  "chief_complaint_duration",
  "other_symptoms",
];

export type CaseState = {
  id: string;
  secondLanguage: SecondLanguage | null;
  informant: Informant | null;
  /** Informant history for mid-case changes (simple audit for summary). */
  informantHistory: Informant[];
  /** 創傷／非創傷 branch; required with Informant before interview. */
  sceneType: SceneType | null;
  /** Prelude page when currentStep === "start". */
  startPhase: StartPhase;
  currentStep: InterviewStep;
  answers: Partial<Record<InterviewStep, StepAnswer>>;
  /** When true, editing from summary; primary action returns to summary. */
  returnToSummary: boolean;
};

export function emptyStepAnswer(): StepAnswer {
  return {
    status: "empty",
    optionIds: [],
    note: "",
    detail: {},
  };
}
