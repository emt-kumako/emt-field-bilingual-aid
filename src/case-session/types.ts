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

/** Interview mnemonic steps after start. */
export type InterviewStep =
  | "start"
  | "chief_complaint_1"
  | "chief_complaint_2"
  | "chief_complaint_duration"
  | "before"
  | "intake"
  | "past_history"
  | "medications"
  | "allergies"
  | "other_symptoms"
  | "summary";

export type AnswerStatus = "answered" | "unknown" | "skipped" | "empty";

/** 主訴 step 1 payload stored in answers.chief_complaint_1.detail */
export type ChiefComplaint1Detail = {
  complaintTypeIds: string[];
  bodyRegionIds: string[];
  bodySubregionIds: string[];
  /** When set, UI is on optional fine location for this coarse region. */
  drilldownRegionId: string | null;
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
  };
}

/** 主訴「怎麼不舒服」payload in answers.chief_complaint_2.detail */
export type ChiefComplaint2Detail = {
  qualityIds: string[];
  /** 1–10 when pain; otherwise null. */
  painScore: number | null;
};

export function emptyChiefComplaint2Detail(): ChiefComplaint2Detail {
  return {
    qualityIds: [],
    painScore: null,
  };
}

/** 主訴「多久了」payload in answers.chief_complaint_duration.detail */
export type ChiefComplaintDurationDetail = {
  timeMode: "duration" | "period" | null;
  timeBucketId: string | null;
  timeAmount: number | null;
  timeUnit: "minutes" | "hours" | "days" | null;
  timeRefine: string;
};

export function emptyChiefComplaintDurationDetail(): ChiefComplaintDurationDetail {
  return {
    timeMode: null,
    timeBucketId: null,
    timeAmount: null,
    timeUnit: null,
    timeRefine: "",
  };
}

/** Combined view for summary / UI that needs quality + duration together. */
export type ChiefComplaintCombinedDetail = ChiefComplaint2Detail &
  ChiefComplaintDurationDetail;

export function emptyChiefComplaintCombinedDetail(): ChiefComplaintCombinedDetail {
  return {
    ...emptyChiefComplaint2Detail(),
    ...emptyChiefComplaintDurationDetail(),
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

export type CaseState = {
  id: string;
  secondLanguage: SecondLanguage | null;
  informant: Informant | null;
  /** Informant history for mid-case changes (simple audit for summary). */
  informantHistory: Informant[];
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
