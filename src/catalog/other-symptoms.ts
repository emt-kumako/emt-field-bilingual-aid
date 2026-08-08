import { L, type BilingualText } from "./labels.js";

export type AccompanyingSymptomOption = {
  id: string;
  labels: BilingualText;
  exclusive?: boolean;
};

export const ACCOMPANYING_SYMPTOMS: AccompanyingSymptomOption[] = [
  {
    id: "shortness_of_breath",
    labels: L(
      "喘／呼吸困難",
      "Shortness of breath",
      "Khó thở",
      "Sesak napas",
    ),
  },
  {
    id: "cold_sweat",
    labels: L("冒冷汗", "Cold sweat", "Đổ mồ hôi lạnh", "Keringat dingin"),
  },
  {
    id: "nausea_vomit",
    labels: L(
      "噁心／嘔吐",
      "Nausea / vomiting",
      "Buồn nôn / nôn",
      "Mual / muntah",
    ),
  },
  {
    id: "dizziness_syncope",
    labels: L(
      "暈／快昏倒",
      "Dizzy / near fainting",
      "Chóng mặt / gần ngất",
      "Pusing / hampir pingsan",
    ),
  },
  {
    id: "chest_discomfort",
    labels: L(
      "胸口不適",
      "Chest discomfort",
      "Khó chịu ở ngực",
      "Tidak nyaman di dada",
    ),
  },
  {
    id: "abdominal_pain",
    labels: L("腹痛", "Abdominal pain", "Đau bụng", "Nyeri perut"),
  },
  {
    id: "headache",
    labels: L("頭痛", "Headache", "Đau đầu", "Sakit kepala"),
  },
  {
    id: "weakness_numb",
    labels: L(
      "無力／麻木",
      "Weakness / numbness",
      "Yếu / tê",
      "Lemah / kebas",
    ),
  },
  {
    id: "none_other",
    labels: L(
      "沒有其他",
      "Nothing else",
      "Không còn gì",
      "Tidak ada yang lain",
    ),
    exclusive: true,
  },
  {
    id: "unknown_option",
    labels: L("不知道", "Don't know", "Không biết", "Tidak tahu"),
    exclusive: true,
  },
];

export function getAccompanyingSymptom(
  id: string,
): AccompanyingSymptomOption | undefined {
  return ACCOMPANYING_SYMPTOMS.find((s) => s.id === id);
}
