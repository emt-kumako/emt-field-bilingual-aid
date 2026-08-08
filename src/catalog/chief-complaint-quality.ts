import { L, type BilingualText } from "./labels.js";

export type QualityOption = {
  id: string;
  painRelated: boolean;
  /** Selecting this clears other qualities (e.g. 同哪裡不舒服). */
  exclusive?: boolean;
  labels: BilingualText;
};

export const QUALITY_OPTIONS: QualityOption[] = [
  {
    id: "same_as_complaint",
    painRelated: false,
    exclusive: true,
    labels: L("同哪裡不舒服", {
      en: "Same as the main problem",
      vi: "Giống chỗ đang khó chịu",
      id: "Sama dengan keluhan utama",
      ja: "主訴と同じところ",
      ko: "불편한 곳과 같음",
      fil: "Pareho sa problema",
      th: "ตรงกับที่ไม่สบาย",
      de: "Wie die Hauptbeschwerde",
      fr: "Comme le problème principal",
      es: "Igual a la molestia",
    }),
  },
  {
    id: "pain_general",
    painRelated: false,
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
    id: "dull",
    painRelated: true,
    labels: L("悶痛", {
      en: "Dull / pressure",
      vi: "Đau tức",
      id: "Nyeri tumpul",
      ja: "鈍い痛み",
      ko: "둔한 통증",
      fil: "Mapurol / bigat",
      th: "ปวดตื้อ/แน่น",
      de: "Dumpf / Druck",
      fr: "Sourd / pression",
      es: "Sordo / presión",
    }),
  },
  {
    id: "sharp",
    painRelated: true,
    labels: L("刺痛", {
      en: "Sharp / stabbing",
      vi: "Đau nhói",
      id: "Nyeri tajam",
      ja: "刺す痛み",
      ko: "찌르는 통증",
      fil: "Matulis / saksak",
      th: "ปวดแปลบ",
      de: "Stechend",
      fr: "En coup de poignard",
      es: "Punzante",
    }),
  },
  {
    id: "burning",
    painRelated: true,
    labels: L("灼熱", {
      en: "Burning",
      vi: "Nóng rát",
      id: "Terbakar",
      ja: "焼ける痛み",
      ko: "화끈거림",
      fil: "Nasusunog",
      th: "ปวดร้อน",
      de: "Brennend",
      fr: "Brûlure",
      es: "Ardor",
    }),
  },
  {
    id: "crushing",
    painRelated: true,
    labels: L("壓迫／緊悶", {
      en: "Crushing / tight",
      vi: "Đau thắt",
      id: "Menekan / sesak",
      ja: "締めつけ",
      ko: "조이는 느낌",
      fil: "Pumipisil",
      th: "แน่น/กดทับ",
      de: "Drückend / eng",
      fr: "Serré / oppressant",
      es: "Opresivo / apretado",
    }),
  },
  {
    id: "throbbing",
    painRelated: true,
    labels: L("搏動痛", {
      en: "Throbbing",
      vi: "Đau nhịp",
      id: "Berdenyut",
      ja: "ズキズキ",
      ko: "욱신거림",
      fil: "Kumikirot",
      th: "ปวดตุบๆ",
      de: "Pochen",
      fr: "Pulsatile",
      es: "Latido",
    }),
  },
  {
    id: "cramping",
    painRelated: true,
    labels: L("絞痛／抽筋感", {
      en: "Cramping",
      vi: "Đau quặn",
      id: "Keram / mulas",
      ja: "差し込み",
      ko: "쥐어짜는 통증",
      fil: "Pulikat",
      th: "ปวดบิด",
      de: "Krampfartig",
      fr: "Crampes",
      es: "Calambres",
    }),
  },
  {
    id: "tight_breath",
    painRelated: false,
    labels: L("喘不過氣", {
      en: "Can't breathe",
      vi: "Không thở được",
      id: "Tak bisa napas",
      ja: "息ができない",
      ko: "숨이 안 참",
      fil: "Hindi makahinga",
      th: "หายใจไม่ออก",
      de: "Kann nicht atmen",
      fr: "Ne peut pas respirer",
      es: "No puede respirar",
    }),
  },
  {
    id: "numb",
    painRelated: false,
    labels: L("麻木", {
      en: "Numbness",
      vi: "Tê",
      id: "Keba",
      ja: "しびれ",
      ko: "저림/감각 없음",
      fil: "Manhid",
      th: "ชา",
      de: "Taubheit",
      fr: "Engourdissement",
      es: "Entumecimiento",
    }),
  },
  {
    id: "other_quality",
    painRelated: false,
    labels: L("其他感受", {
      en: "Other feeling",
      vi: "Cảm giác khác",
      id: "Perasaan lain",
      ja: "その他の感じ",
      ko: "다른 느낌",
      fil: "Ibang pakiramdam",
      th: "รู้สึกอย่างอื่น",
      de: "Anderes Gefühl",
      fr: "Autre sensation",
      es: "Otra sensación",
    }),
  },
];

export function getQualityOption(id: string): QualityOption | undefined {
  return QUALITY_OPTIONS.find((q) => q.id === id);
}

/** Pain complaints see all qualities; others only non-pain-related options. */
export function visibleQualityOptions(showsPain: boolean): QualityOption[] {
  if (showsPain) return [...QUALITY_OPTIONS];
  return QUALITY_OPTIONS.filter((q) => !q.painRelated);
}
