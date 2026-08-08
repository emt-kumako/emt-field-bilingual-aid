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
];

export const INFORMANT_OPTIONS: {
  id: Informant;
  labels: BilingualText;
}[] = [
  {
    id: "self",
    labels: L("本人", "Patient", "Bản thân bệnh nhân", "Pasien sendiri"),
  },
  {
    id: "family",
    labels: L("家屬", "Family", "Người nhà", "Keluarga"),
  },
  {
    id: "friend",
    labels: L("友人", "Friend", "Bạn bè", "Teman"),
  },
  {
    id: "other",
    labels: L("其他", "Other", "Khác", "Lainnya"),
  },
];
