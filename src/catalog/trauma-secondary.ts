import { L, type BilingualText } from "./labels.js";

export type TraumaSecondaryOption = {
  id: string;
  labels: BilingualText;
};

/** Short trauma-sensation catalog for secondary reasons (no mechanism / body map). */
export const TRAUMA_SECONDARY_SENSATIONS: TraumaSecondaryOption[] = [
  {
    id: "pain",
    labels: L("疼痛", {
      en: "Pain",
      vi: "Đau",
      id: "Nyeri",
      ja: "痛み",
      ko: "통증",
      fil: "Sakit",
      th: "ปวด",
      de: "Schmerz",
      fr: "Douleur",
      es: "Dolor",
    }),
  },
  {
    id: "numbness",
    labels: L("麻木", {
      en: "Numbness",
      vi: "Tê",
      id: "Kebas",
      ja: "しびれ",
      ko: "저림/무감각",
      fil: "Manhid",
      th: "ชา",
      de: "Taubheit",
      fr: "Engourdissement",
      es: "Entumecimiento",
    }),
  },
  {
    id: "weakness",
    labels: L("無力", {
      en: "Weakness",
      vi: "Yếu",
      id: "Lemah",
      ja: "力が入らない",
      ko: "힘없음",
      fil: "Mahina",
      th: "อ่อนแรง",
      de: "Schwäche",
      fr: "Faiblesse",
      es: "Debilidad",
    }),
  },
  {
    id: "swelling",
    labels: L("腫脹", {
      en: "Swelling",
      vi: "Sưng",
      id: "Bengkak",
      ja: "腫れ",
      ko: "부종",
      fil: "Namamaga",
      th: "บวม",
      de: "Schwellung",
      fr: "Gonflement",
      es: "Hinchazón",
    }),
  },
  {
    id: "bleeding",
    labels: L("出血", {
      en: "Bleeding",
      vi: "Chảy máu",
      id: "Pendarahan",
      ja: "出血",
      ko: "출혈",
      fil: "Pagdurugo",
      th: "เลือดออก",
      de: "Blutung",
      fr: "Saignement",
      es: "Sangrado",
    }),
  },
  {
    id: "deformity",
    labels: L("變形", {
      en: "Deformity",
      vi: "Biến dạng",
      id: "Deformitas",
      ja: "変形",
      ko: "변형",
      fil: "Deformidad",
      th: "ผิดรูป",
      de: "Fehlstellung",
      fr: "Déformation",
      es: "Deformidad",
    }),
  },
  {
    id: "limited_motion",
    labels: L("活動受限", {
      en: "Limited motion",
      vi: "Hạn chế cử động",
      id: "Gerakan terbatas",
      ja: "動きにくい",
      ko: "움직임 제한",
      fil: "Limitadong galaw",
      th: "ขยับได้น้อย",
      de: "Bewegungseinschränkung",
      fr: "Mouvement limité",
      es: "Movimiento limitado",
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

export function getTraumaSecondary(
  id: string,
): TraumaSecondaryOption | undefined {
  return TRAUMA_SECONDARY_SENSATIONS.find((o) => o.id === id);
}
