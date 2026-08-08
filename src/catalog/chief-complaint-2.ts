import type { SecondLanguage } from "../case-session/types.js";
import { L, type BilingualText } from "./labels.js";

export type QualityOption = {
  id: string;
  painRelated: boolean;
  /** Selecting this clears other qualities (e.g. 同哪裡不舒服). */
  exclusive?: boolean;
  labels: BilingualText;
};

export type TimeBucketOption = {
  id: string;
  mode: "duration" | "period";
  labels: BilingualText;
};

export type TimeUnit = "minutes" | "hours" | "days";

export type TimeUnitOption = {
  id: TimeUnit;
  labels: BilingualText;
};

export const TIME_UNITS: TimeUnitOption[] = [
  {
    id: "minutes",
    labels: L("分鐘", {
      en: "minutes",
      vi: "phút",
      id: "menit",
      ja: "分",
      ko: "분",
      fil: "minuto",
      th: "นาที",
      de: "Minuten",
      fr: "minutes",
      es: "minutos",
    }),
  },
  {
    id: "hours",
    labels: L("小時", {
      en: "hours",
      vi: "giờ",
      id: "jam",
      ja: "時間",
      ko: "시간",
      fil: "oras",
      th: "ชั่วโมง",
      de: "Stunden",
      fr: "heures",
      es: "horas",
    }),
  },
  {
    id: "days",
    labels: L("日", {
      en: "days",
      vi: "ngày",
      id: "hari",
      ja: "日",
      ko: "일",
      fil: "araw",
      th: "วัน",
      de: "Tage",
      fr: "jours",
      es: "días",
    }),
  },
];

const ABOUT_PREFIX = L("約", {
  en: "About",
  vi: "Khoảng",
  id: "Sekitar",
  ja: "約",
  ko: "약",
  fil: "Mga",
  th: "ประมาณ",
      de: "Etwa",
      fr: "Environ",
      es: "Aproximadamente",
    });

/** Bilingual “約 N 分鐘／小時／日” display for numeric duration. */
export function formatApproxDuration(
  amount: number,
  unit: TimeUnit,
  lang: "zh" | SecondLanguage,
): string {
  const unitLabels = TIME_UNITS.find((u) => u.id === unit)?.labels;
  if (!unitLabels || !Number.isFinite(amount) || amount <= 0) return "";
  const unitText = lang === "zh" ? unitLabels.zh : unitLabels[lang];
  const about = lang === "zh" ? ABOUT_PREFIX.zh : ABOUT_PREFIX[lang];
  if (lang === "ja" || lang === "ko") return `${about}${amount}${unitText}`;
  return `${about} ${amount} ${unitText}`;
}

export function getTimeUnit(id: string): TimeUnitOption | undefined {
  return TIME_UNITS.find((u) => u.id === id);
}

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

export const TIME_BUCKETS: TimeBucketOption[] = [
  {
    id: "just_now",
    mode: "duration",
    labels: L("剛才", {
      en: "Just now",
      vi: "Vừa mới",
      id: "Baru saja",
      ja: "たった今",
      ko: "방금",
      fil: "Ngayon lang",
      th: "เพิ่งเกิด",
      de: "Gerade eben",
      fr: "À l'instant",
      es: "Justo ahora",
    }),
  },
  {
    id: "about_20_min",
    mode: "duration",
    labels: L("約 20 分鐘", {
      en: "About 20 minutes",
      vi: "Khoảng 20 phút",
      id: "Sekitar 20 menit",
      ja: "約20分",
      ko: "약 20분",
      fil: "Mga 20 minuto",
      th: "ประมาณ 20 นาที",
      de: "Etwa 20 Minuten",
      fr: "Environ 20 minutes",
      es: "Unos 20 minutos",
    }),
  },
  {
    id: "under_1_hour",
    mode: "duration",
    labels: L("不到 1 小時", {
      en: "Under 1 hour",
      vi: "Dưới 1 giờ",
      id: "Kurang dari 1 jam",
      ja: "1時間未満",
      ko: "1시간 미만",
      fil: "Wala pang 1 oras",
      th: "ไม่ถึง 1 ชั่วโมง",
      de: "Unter 1 Stunde",
      fr: "Moins d'1 heure",
      es: "Menos de 1 hora",
    }),
  },
  {
    id: "few_hours",
    mode: "duration",
    labels: L("數小時", {
      en: "A few hours",
      vi: "Vài giờ",
      id: "Beberapa jam",
      ja: "数時間",
      ko: "몇 시간",
      fil: "Ilang oras",
      th: "หลายชั่วโมง",
      de: "Vor ein paar Stunden",
      fr: "Il y a quelques heures",
      es: "Hace unas horas",
    }),
  },
  {
    id: "since_morning",
    mode: "period",
    labels: L("今天早上", {
      en: "This morning",
      vi: "Sáng nay",
      id: "Pagi ini",
      ja: "今朝",
      ko: "오늘 아침",
      fil: "Kaninang umaga",
      th: "เช้านี้",
      de: "Heute Morgen",
      fr: "Ce matin",
      es: "Esta mañana",
    }),
  },
  {
    id: "today",
    mode: "period",
    labels: L("今天", {
      en: "Today",
      vi: "Hôm nay",
      id: "Hari ini",
      ja: "今日",
      ko: "오늘",
      fil: "Ngayong araw",
      th: "วันนี้",
      de: "Heute",
      fr: "Aujourd'hui",
      es: "Hoy",
    }),
  },
  {
    id: "yesterday",
    mode: "period",
    labels: L("昨天", {
      en: "Yesterday",
      vi: "Hôm qua",
      id: "Kemarin",
      ja: "昨日",
      ko: "어제",
      fil: "Kahapon",
      th: "เมื่อวาน",
      de: "Gestern",
      fr: "Hier",
      es: "Ayer",
    }),
  },
  {
    id: "before_yesterday",
    mode: "period",
    labels: L("昨天以前", {
      en: "Before yesterday",
      vi: "Trước hôm qua",
      id: "Sebelum kemarin",
      ja: "昨日より前",
      ko: "어제 이전",
      fil: "Bago ang kahapon",
      th: "ก่อนเมื่อวาน",
      de: "Vor gestern",
      fr: "Avant hier",
      es: "Antes de ayer",
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

export function getTimeBucket(id: string): TimeBucketOption | undefined {
  return TIME_BUCKETS.find((b) => b.id === id);
}

export function durationBuckets(): TimeBucketOption[] {
  return TIME_BUCKETS.filter((b) => b.mode === "duration");
}

export function periodBuckets(): TimeBucketOption[] {
  return TIME_BUCKETS.filter((b) => b.mode === "period");
}
