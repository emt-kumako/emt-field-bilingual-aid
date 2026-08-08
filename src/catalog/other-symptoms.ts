import { L, type BilingualText } from "./labels.js";

export type AccompanyingSymptomOption = {
  id: string;
  labels: BilingualText;
  exclusive?: boolean;
};

export const ACCOMPANYING_SYMPTOMS: AccompanyingSymptomOption[] = [
  {
    id: "shortness_of_breath",
    labels: L("喘／呼吸困難", {
      en: "Shortness of breath",
      vi: "Khó thở",
      id: "Sesak napas",
      ja: "息苦しさ",
      ko: "호흡곤란",
      fil: "Hirap huminga",
      th: "หายใจลำบาก",
      de: "Atemnot",
      fr: "Essoufflement",
      es: "Falta de aire",
    }),
  },
  {
    id: "cold_sweat",
    labels: L("冒冷汗", {
      en: "Cold sweat",
      vi: "Đổ mồ hôi lạnh",
      id: "Keringat dingin",
      ja: "冷や汗",
      ko: "식은땀",
      fil: "Malamig na pawis",
      th: "เหงื่อเย็น",
      de: "Kalter Schweiß",
      fr: "Sueurs froides",
      es: "Sudor frío",
    }),
  },
  {
    id: "nausea_vomit",
    labels: L("噁心／嘔吐", {
      en: "Nausea / vomiting",
      vi: "Buồn nôn / nôn",
      id: "Mual / muntah",
      ja: "吐き気・嘔吐",
      ko: "메스꺼움/구토",
      fil: "Nasusuka / pagsusuka",
      th: "คลื่นไส้/อาเจียน",
      de: "Übelkeit / Erbrechen",
      fr: "Nausées / vomissements",
      es: "Náuseas / vómitos",
    }),
  },
  {
    id: "dizziness_syncope",
    labels: L("暈／快昏倒", {
      en: "Dizzy / near fainting",
      vi: "Chóng mặt / gần ngất",
      id: "Pusing / hampir pingsan",
      ja: "めまい・失神しそう",
      ko: "어지럽거나 기절할 것 같음",
      fil: "Nahihilo / malapit mahimatay",
      th: "เวียนหัว/จะเป็นลม",
      de: "Schwindel / fast ohnmächtig",
      fr: "Vertige / presque évanoui",
      es: "Mareo / casi desmayo",
    }),
  },
  {
    id: "chest_discomfort",
    labels: L("胸口不適", {
      en: "Chest discomfort",
      vi: "Khó chịu ở ngực",
      id: "Tidak nyaman di dada",
      ja: "胸の不快感",
      ko: "가슴 불편",
      fil: "Hindi komportable ang dibdib",
      th: "แน่นอก/อึดอัดอก",
      de: "Brustbeschwerden",
      fr: "Gêne thoracique",
      es: "Molestia en el pecho",
    }),
  },
  {
    id: "abdominal_pain",
    labels: L("腹痛", {
      en: "Abdominal pain",
      vi: "Đau bụng",
      id: "Nyeri perut",
      ja: "腹痛",
      ko: "복통",
      fil: "Sakit ng tiyan",
      th: "ปวดท้อง",
      de: "Bauchschmerzen",
      fr: "Douleur abdominale",
      es: "Dolor abdominal",
    }),
  },
  {
    id: "headache",
    labels: L("頭痛", {
      en: "Headache",
      vi: "Đau đầu",
      id: "Sakit kepala",
      ja: "頭痛",
      ko: "두통",
      fil: "Sakit ng ulo",
      th: "ปวดหัว",
      de: "Kopfschmerzen",
      fr: "Mal de tête",
      es: "Dolor de cabeza",
    }),
  },
  {
    id: "weakness_numb",
    labels: L("無力／麻木", {
      en: "Weakness / numbness",
      vi: "Yếu / tê",
      id: "Lemah / kebas",
      ja: "脱力・しびれ",
      ko: "힘없음/저림",
      fil: "Mahina / manhid",
      th: "อ่อนแรง/ชา",
      de: "Schwäche / Taubheit",
      fr: "Faiblesse / engourdissement",
      es: "Debilidad / entumecimiento",
    }),
  },
  {
    id: "none_other",
    labels: L("沒有其他", {
      en: "Nothing else",
      vi: "Không còn gì",
      id: "Tidak ada yang lain",
      ja: "他にはない",
      ko: "더 없음",
      fil: "Wala nang iba",
      th: "ไม่มีอย่างอื่น",
      de: "Nichts weiter",
      fr: "Rien d'autre",
      es: "Nada más",
    }),
    exclusive: true,
  },
  {
    id: "unknown_option",
    labels: L("不知道", {
      en: "Don't know",
      vi: "Không biết",
      id: "Tidak tahu",
      ja: "わからない",
      ko: "모름",
      fil: "Hindi alam",
      th: "ไม่ทราบ",
      de: "Weiß nicht",
      fr: "Je ne sais pas",
      es: "No sé",
    }),
    exclusive: true,
  },
];

export function getAccompanyingSymptom(
  id: string,
): AccompanyingSymptomOption | undefined {
  return ACCOMPANYING_SYMPTOMS.find((s) => s.id === id);
}
