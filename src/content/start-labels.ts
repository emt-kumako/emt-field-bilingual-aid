import { L, type BilingualText } from "../catalog/labels.js";
import type {
  Informant,
  SceneType,
  SecondLanguage,
} from "../case-session/types.js";

export const SECOND_LANGUAGE_OPTIONS: {
  id: SecondLanguage;
  zh: string;
  native: string;
}[] = [
  { id: "en", zh: "英文", native: "English" },
  { id: "vi", zh: "越南語", native: "Tiếng Việt" },
  { id: "id", zh: "印尼語", native: "Bahasa Indonesia" },
  { id: "fil", zh: "菲律賓語", native: "Filipino" },
  { id: "th", zh: "泰文", native: "ภาษาไทย" },
  { id: "ja", zh: "日文", native: "日本語" },
  { id: "ko", zh: "韓文", native: "한국어" },
  { id: "de", zh: "德語", native: "Deutsch" },
  { id: "fr", zh: "法語", native: "Français" },
  { id: "es", zh: "西班牙語", native: "Español" },
];

export const INFORMANT_OPTIONS: {
  id: Informant;
  labels: BilingualText;
}[] = [
  {
    id: "self",
    labels: L("本人", {
      en: "Patient",
      vi: "Bản thân",
      id: "Pasien sendiri",
      ja: "本人",
      ko: "본인",
      fil: "Pasyente",
      th: "ผู้ป่วยเอง",
      de: "Patient selbst",
      fr: "Le patient",
      es: "El paciente",
    }),
  },
  {
    id: "family",
    labels: L("家屬", {
      en: "Family",
      vi: "Người nhà",
      id: "Keluarga",
      ja: "家族",
      ko: "가족",
      fil: "Pamilya",
      th: "ครอบครัว",
      de: "Angehörige",
      fr: "Famille",
      es: "Familiar",
    }),
  },
  {
    id: "friend",
    labels: L("朋友(友人)", {
      en: "Friend",
      vi: "Bạn bè",
      id: "Teman",
      ja: "友人",
      ko: "친구",
      fil: "Kaibigan",
      th: "เพื่อน",
      de: "Freund/in",
      fr: "Ami(e)",
      es: "Amigo/a",
    }),
  },
  {
    id: "other",
    labels: L("其他", {
      en: "Other",
      vi: "Khác",
      id: "Lainnya",
      ja: "その他",
      ko: "기타",
      fil: "Iba pa",
      th: "อื่นๆ",
      de: "Sonstiges",
      fr: "Autre",
      es: "Otro",
    }),
  },
];

export const SCENE_TYPE_OPTIONS: {
  id: SceneType;
  labels: BilingualText;
}[] = [
  {
    id: "non_trauma",
    labels: L("非創傷", {
      en: "Non-trauma",
      vi: "Không chấn thương",
      id: "Non-trauma",
      ja: "非外傷",
      ko: "비외상",
      fil: "Hindi trauma",
      th: "ไม่ใช่บาดเจ็บ",
      de: "Nicht-Trauma",
      fr: "Non traumatique",
      es: "No traumático",
    }),
  },
  {
    id: "trauma",
    labels: L("創傷", {
      en: "Trauma",
      vi: "Chấn thương",
      id: "Trauma",
      ja: "外傷",
      ko: "외상",
      fil: "Trauma",
      th: "บาดเจ็บ",
      de: "Trauma",
      fr: "Traumatisme",
      es: "Trauma",
    }),
  },
];
