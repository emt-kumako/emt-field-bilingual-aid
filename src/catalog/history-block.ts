import { L, type BilingualText } from "./labels.js";

export type HistoryStepId =
  | "before"
  | "intake"
  | "past_history"
  | "medications"
  | "allergies";

export type ListOption = {
  id: string;
  labels: BilingualText;
  /** Selecting this clears other options (e.g. 無 / 不知道). */
  exclusive?: boolean;
  /** Show EMT-only note field when selected. */
  opensNote?: boolean;
};

export type HistoryStepCatalog = {
  id: HistoryStepId;
  title: BilingualText;
  /** Intake uses single-select; others are multi-select. */
  selection: "single" | "multi";
  options: ListOption[];
};

export const HISTORY_STEP_ORDER: HistoryStepId[] = [
  "before",
  "intake",
  "past_history",
  "medications",
  "allergies",
];

const OTHER = L("其他", "Other", "Khác", "Lainnya");
const UNKNOWN = L("不知道", "Don't know", "Không biết", "Tidak tahu");
const NONE = L("無", "None", "Không", "Tidak ada");

export const HISTORY_BLOCK: HistoryStepCatalog[] = [
  {
    id: "before",
    title: L("之前", "Before onset", "Trước khi xảy ra", "Sebelum keluhan"),
    selection: "multi",
    options: [
      { id: "sleeping", labels: L("睡覺", "Sleeping", "Đang ngủ", "Tidur") },
      { id: "resting", labels: L("休息", "Resting", "Đang nghỉ", "Istirahat") },
      { id: "walking", labels: L("走路", "Walking", "Đang đi bộ", "Berjalan") },
      {
        id: "working",
        labels: L(
          "工作／勞動",
          "Working / labor",
          "Đang làm việc",
          "Bekerja / kerja fisik",
        ),
      },
      {
        id: "driving",
        labels: L(
          "開車／搭車",
          "Driving / riding",
          "Đang lái / đi xe",
          "Mengemudi / naik kendaraan",
        ),
      },
      { id: "eating", labels: L("吃飯", "Eating", "Đang ăn", "Makan") },
      {
        id: "exercise",
        labels: L("運動", "Exercise", "Đang tập", "Olahraga"),
      },
      {
        id: "emotional",
        labels: L(
          "情緒激動／爭吵",
          "Upset / argument",
          "Bực tức / cãi nhau",
          "Emosi / bertengkar",
        ),
      },
      {
        id: "during_trauma",
        labels: L(
          "外傷當下",
          "During trauma",
          "Khi bị thương",
          "Saat cedera",
        ),
      },
      { id: "other", labels: OTHER, opensNote: true },
      { id: "unknown_option", labels: UNKNOWN, exclusive: true },
    ],
  },
  {
    id: "intake",
    title: L(
      "吃（上一餐）",
      "Last oral intake",
      "Bữa ăn gần nhất",
      "Makan terakhir",
    ),
    selection: "single",
    options: [
      {
        id: "within_1h",
        labels: L(
          "1 小時內",
          "Within 1 hour",
          "Trong 1 giờ",
          "Dalam 1 jam",
        ),
      },
      {
        id: "1_to_4h",
        labels: L(
          "1–4 小時",
          "1–4 hours ago",
          "1–4 giờ trước",
          "1–4 jam lalu",
        ),
      },
      {
        id: "over_4h",
        labels: L(
          "超過 4 小時",
          "Over 4 hours ago",
          "Hơn 4 giờ",
          "Lebih dari 4 jam",
        ),
      },
      {
        id: "no_food_today",
        labels: L(
          "今天沒吃",
          "Nothing today",
          "Hôm nay chưa ăn",
          "Hari ini belum makan",
        ),
      },
      { id: "other", labels: OTHER, opensNote: true },
      { id: "unknown_option", labels: UNKNOWN, exclusive: true },
    ],
  },
  {
    id: "past_history",
    title: L(
      "過（過去疾病）",
      "Past history",
      "Bệnh cũ",
      "Riwayat penyakit",
    ),
    selection: "multi",
    options: [
      {
        id: "hypertension",
        labels: L("高血壓", "Hypertension", "Cao huyết áp", "Hipertensi"),
      },
      {
        id: "diabetes",
        labels: L("糖尿病", "Diabetes", "Tiểu đường", "Diabetes"),
      },
      {
        id: "heart_disease",
        labels: L("心臟病", "Heart disease", "Bệnh tim", "Penyakit jantung"),
      },
      { id: "asthma", labels: L("氣喘", "Asthma", "Hen suyễn", "Asma") },
      { id: "stroke", labels: L("中風", "Stroke", "Đột quỵ", "Stroke") },
      {
        id: "epilepsy",
        labels: L("癲癇", "Epilepsy", "Động kinh", "Epilepsi"),
      },
      { id: "none", labels: NONE, exclusive: true },
      { id: "other", labels: OTHER, opensNote: true },
      { id: "unknown_option", labels: UNKNOWN, exclusive: true },
    ],
  },
  {
    id: "medications",
    title: L("藥（服用藥物）", "Medications", "Thuốc đang dùng", "Obat"),
    selection: "multi",
    options: [
      {
        id: "antihypertensive",
        labels: L(
          "降血壓藥",
          "Blood pressure meds",
          "Thuốc huyết áp",
          "Obat darah tinggi",
        ),
      },
      {
        id: "diabetes_meds",
        labels: L(
          "降血糖藥／胰島素",
          "Diabetes meds / insulin",
          "Thuốc tiểu đường / insulin",
          "Obat diabetes / insulin",
        ),
      },
      {
        id: "anticoagulant",
        labels: L(
          "抗凝血藥",
          "Blood thinners",
          "Thuốc chống đông",
          "Pengencer darah",
        ),
      },
      {
        id: "heart_meds",
        labels: L(
          "心臟病藥",
          "Heart medications",
          "Thuốc tim",
          "Obat jantung",
        ),
      },
      {
        id: "painkillers",
        labels: L("止痛藥", "Painkillers", "Thuốc giảm đau", "Pereda nyeri"),
      },
      { id: "none", labels: NONE, exclusive: true },
      { id: "other", labels: OTHER, opensNote: true },
      { id: "unknown_option", labels: UNKNOWN, exclusive: true },
    ],
  },
  {
    id: "allergies",
    title: L("敏（過敏）", "Allergies", "Dị ứng", "Alergi"),
    selection: "multi",
    options: [
      {
        id: "drug_allergy",
        labels: L(
          "藥物過敏",
          "Drug allergy",
          "Dị ứng thuốc",
          "Alergi obat",
        ),
        opensNote: true,
      },
      {
        id: "food_allergy",
        labels: L(
          "食物過敏",
          "Food allergy",
          "Dị ứng thức ăn",
          "Alergi makanan",
        ),
        opensNote: true,
      },
      {
        id: "none",
        labels: L(
          "無已知過敏",
          "No known allergies",
          "Không dị ứng",
          "Tidak ada alergi diketahui",
        ),
        exclusive: true,
      },
      { id: "other", labels: OTHER, opensNote: true },
      { id: "unknown_option", labels: UNKNOWN, exclusive: true },
    ],
  },
];

export function getHistoryCatalog(
  step: HistoryStepId,
): HistoryStepCatalog | undefined {
  return HISTORY_BLOCK.find((s) => s.id === step);
}

export function isHistoryStep(step: string): step is HistoryStepId {
  return (HISTORY_STEP_ORDER as readonly string[]).includes(step);
}

export function nextHistoryStep(
  step: HistoryStepId,
): HistoryStepId | "other_symptoms" {
  const index = HISTORY_STEP_ORDER.indexOf(step);
  if (index < 0 || index >= HISTORY_STEP_ORDER.length - 1) {
    return "other_symptoms";
  }
  return HISTORY_STEP_ORDER[index + 1]!;
}

export function previousHistoryStep(
  step: HistoryStepId,
): HistoryStepId | "chief_complaint_2" {
  const index = HISTORY_STEP_ORDER.indexOf(step);
  if (index <= 0) return "chief_complaint_2";
  return HISTORY_STEP_ORDER[index - 1]!;
}
