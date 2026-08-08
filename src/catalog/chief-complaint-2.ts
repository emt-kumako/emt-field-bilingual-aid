import { L, type BilingualText } from "./labels.js";

export type QualityOption = {
  id: string;
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
    labels: L("悶痛", {
      en: "Dull / pressure",
      vi: "Đau tức",
      id: "Nyeri tumpul",
      ja: "鈍い痛み・圧迫感",
      ko: "둔한 통증/압박감",
      fil: "Mapurol / bigat",
      th: "ปวดตื้อ/แน่น",
    }),
  },
  {
    id: "sharp",
    painRelated: true,
    labels: L("刺痛", {
      en: "Sharp / stabbing",
      vi: "Đau nhói",
      id: "Nyeri tajam",
      ja: "刺すような痛み",
      ko: "찌르는 통증",
      fil: "Matulis / sinasaksak",
      th: "ปวดแปลบ",
    }),
  },
  {
    id: "burning",
    painRelated: true,
    labels: L("灼熱", {
      en: "Burning",
      vi: "Nóng rát",
      id: "Terbakar",
      ja: "焼けるような痛み",
      ko: "화끈거리는 통증",
      fil: "Nasusunog",
      th: "ปวดร้อน",
    }),
  },
  {
    id: "crushing",
    painRelated: true,
    labels: L("壓迫／緊悶", {
      en: "Crushing / tight",
      vi: "Đau thắt / nặng ngực",
      id: "Terasa menekan / sesak",
      ja: "締めつけ・圧迫",
      ko: "조이는/누르는 느낌",
      fil: "Pumipisil / mahigpit",
      th: "แน่น/ถูกกดทับ",
    }),
  },
  {
    id: "throbbing",
    painRelated: true,
    labels: L("搏動痛", {
      en: "Throbbing",
      vi: "Đau nhịp",
      id: "Nyeri berdenyut",
      ja: "ズキズキする痛み",
      ko: "욱신거리는 통증",
      fil: "Kumikirot",
      th: "ปวดตุบๆ",
    }),
  },
  {
    id: "cramping",
    painRelated: true,
    labels: L("絞痛／抽筋感", {
      en: "Cramping",
      vi: "Đau quặn / chuột rút",
      id: "Keram / mulas",
      ja: "差し込み・けいれん痛",
      ko: "쥐어짜는/경련성 통증",
      fil: "Pulikat / tipak",
      th: "ปวดบิด/เป็นตะคริว",
    }),
  },
  {
    id: "tight_breath",
    painRelated: false,
    labels: L("喘不過氣", {
      en: "Cannot catch breath",
      vi: "Không thở được",
      id: "Tidak bisa bernapas",
      ja: "息ができない",
      ko: "숨이 안 참",
      fil: "Hindi makahinga",
      th: "หายใจไม่ออก",
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
