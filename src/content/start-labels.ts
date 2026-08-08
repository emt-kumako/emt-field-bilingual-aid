import { L, type BilingualText } from "../catalog/labels.js";
import type { Informant, SecondLanguage } from "../case-session/types.js";

export const SECOND_LANGUAGE_OPTIONS: {
  id: SecondLanguage;
  zh: string;
  native: string;
}[] = [
  { id: "en", zh: "英文", native: "English" },
  { id: "vi", zh: "越南語", native: "Tiếng Việt" },
  { id: "id", zh: "印尼語", native: "Bahasa Indonesia" },
  { id: "ja", zh: "日文", native: "日本語" },
  { id: "ko", zh: "韓文", native: "한국어" },
  { id: "fil", zh: "菲律賓語", native: "Filipino" },
  { id: "th", zh: "泰文", native: "ภาษาไทย" },
];

export const INFORMANT_OPTIONS: {
  id: Informant;
  labels: BilingualText;
}[] = [
  {
    id: "self",
    labels: L("本人", {
      en: "Patient",
      vi: "Bản thân bệnh nhân",
      id: "Pasien sendiri",
      ja: "本人",
      ko: "본인",
      fil: "Pasyente mismo",
      th: "ผู้ป่วยเอง",
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
    }),
  },
  {
    id: "friend",
    labels: L("友人", {
      en: "Friend",
      vi: "Bạn bè",
      id: "Teman",
      ja: "友人",
      ko: "지인",
      fil: "Kaibigan",
      th: "เพื่อน",
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
    }),
  },
];
