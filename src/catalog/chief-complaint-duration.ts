import type { SecondLanguage } from "../case-session/types.js";
import { L, type BilingualText } from "./labels.js";

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

export function getTimeBucket(id: string): TimeBucketOption | undefined {
  return TIME_BUCKETS.find((b) => b.id === id);
}

export function durationBuckets(): TimeBucketOption[] {
  return TIME_BUCKETS.filter((b) => b.mode === "duration");
}

export function periodBuckets(): TimeBucketOption[] {
  return TIME_BUCKETS.filter((b) => b.mode === "period");
}
