import { L, type BilingualText } from "./labels.js";

export type QualityOption = {
  id: string;
  /** Primarily for pain complaints; still selectable if mixed. */
  painRelated: boolean;
  labels: BilingualText;
};

export type TimeBucketOption = {
  id: string;
  mode: "duration" | "period";
  labels: BilingualText;
};

export const QUALITY_OPTIONS: QualityOption[] = [
  {
    id: "dull",
    painRelated: true,
    labels: L("悶痛", "Dull / pressure", "Đau tức", "Nyeri tumpul"),
  },
  {
    id: "sharp",
    painRelated: true,
    labels: L("刺痛", "Sharp / stabbing", "Đau nhói", "Nyeri tajam"),
  },
  {
    id: "burning",
    painRelated: true,
    labels: L("灼熱", "Burning", "Nóng rát", "Terbakar"),
  },
  {
    id: "crushing",
    painRelated: true,
    labels: L(
      "壓迫／緊悶",
      "Crushing / tight",
      "Đau thắt / nặng ngực",
      "Terasa menekan / sesak",
    ),
  },
  {
    id: "throbbing",
    painRelated: true,
    labels: L("搏動痛", "Throbbing", "Đau nhịp", "Nyeri berdenyut"),
  },
  {
    id: "cramping",
    painRelated: true,
    labels: L(
      "絞痛／抽筋感",
      "Cramping",
      "Đau quặn / chuột rút",
      "Keram / mulas",
    ),
  },
  {
    id: "tight_breath",
    painRelated: false,
    labels: L(
      "喘不過氣",
      "Cannot catch breath",
      "Không thở được",
      "Tidak bisa bernapas",
    ),
  },
  {
    id: "numb",
    painRelated: false,
    labels: L("麻木", "Numbness", "Tê", "Keba"),
  },
  {
    id: "other_quality",
    painRelated: false,
    labels: L(
      "其他感受",
      "Other feeling",
      "Cảm giác khác",
      "Perasaan lain",
    ),
  },
];

export const TIME_BUCKETS: TimeBucketOption[] = [
  {
    id: "just_now",
    mode: "duration",
    labels: L("剛才", "Just now", "Vừa mới", "Baru saja"),
  },
  {
    id: "about_20_min",
    mode: "duration",
    labels: L(
      "約 20 分鐘",
      "About 20 minutes",
      "Khoảng 20 phút",
      "Sekitar 20 menit",
    ),
  },
  {
    id: "under_1_hour",
    mode: "duration",
    labels: L(
      "不到 1 小時",
      "Under 1 hour",
      "Dưới 1 giờ",
      "Kurang dari 1 jam",
    ),
  },
  {
    id: "few_hours",
    mode: "duration",
    labels: L("數小時", "A few hours", "Vài giờ", "Beberapa jam"),
  },
  {
    id: "since_morning",
    mode: "period",
    labels: L(
      "今天早上",
      "This morning",
      "Sáng nay",
      "Pagi ini",
    ),
  },
  {
    id: "today",
    mode: "period",
    labels: L("今天", "Today", "Hôm nay", "Hari ini"),
  },
  {
    id: "yesterday",
    mode: "period",
    labels: L("昨天", "Yesterday", "Hôm qua", "Kemarin"),
  },
  {
    id: "before_yesterday",
    mode: "period",
    labels: L(
      "昨天以前",
      "Before yesterday",
      "Trước hôm qua",
      "Sebelum kemarin",
    ),
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
