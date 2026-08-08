import { L, type BilingualText } from "./labels.js";

export type HistoryStepId =
  | "before"
  | "intake"
  | "past_history"
  | "medications"
  | "allergies";

export type ListOption = {
  id: string;
  labels: BilingualText;
  exclusive?: boolean;
  opensNote?: boolean;
};

export type HistoryStepCatalog = {
  id: HistoryStepId;
  title: BilingualText;
  selection: "single" | "multi";
  options: ListOption[];
};

export const HISTORY_STEP_ORDER: HistoryStepId[] = [
  "before",
  "intake",
  "past_history",
  "medications",
  "allergies",
];

const OTHER = L("其他", {
  en: "Other",
  vi: "Khác",
  id: "Lainnya",
  ja: "その他",
  ko: "기타",
  fil: "Iba pa",
  th: "อื่นๆ",
});
const UNKNOWN = L("不知道", {
  en: "Don't know",
  vi: "Không biết",
  id: "Tidak tahu",
  ja: "わからない",
  ko: "모름",
  fil: "Hindi alam",
  th: "ไม่ทราบ",
});
const NONE = L("無", {
  en: "None",
  vi: "Không",
  id: "Tidak ada",
  ja: "なし",
  ko: "없음",
  fil: "Wala",
  th: "ไม่มี",
});

export const HISTORY_BLOCK: HistoryStepCatalog[] = [
  {
    id: "before",
    title: L("之前", {
      en: "Before onset",
      vi: "Trước khi xảy ra",
      id: "Sebelum keluhan",
      ja: "発症前",
      ko: "증상 전",
      fil: "Bago magkasakit",
      th: "ก่อนมีอาการ",
    }),
    selection: "multi",
    options: [
      {
        id: "sleeping",
        labels: L("睡覺", {
          en: "Sleeping",
          vi: "Đang ngủ",
          id: "Tidur",
          ja: "睡眠中",
          ko: "수면 중",
          fil: "Natutulog",
          th: "นอนหลับ",
        }),
      },
      {
        id: "resting",
        labels: L("休息", {
          en: "Resting",
          vi: "Đang nghỉ",
          id: "Istirahat",
          ja: "安静にしていた",
          ko: "휴식 중",
          fil: "Nagpapahinga",
          th: "พักผ่อน",
        }),
      },
      {
        id: "walking",
        labels: L("走路", {
          en: "Walking",
          vi: "Đang đi bộ",
          id: "Berjalan",
          ja: "歩いていた",
          ko: "걷는 중",
          fil: "Naglalakad",
          th: "เดิน",
        }),
      },
      {
        id: "working",
        labels: L("工作／勞動", {
          en: "Working / labor",
          vi: "Đang làm việc",
          id: "Bekerja / kerja fisik",
          ja: "仕事・作業中",
          ko: "근무/노동 중",
          fil: "Nagtatrabaho",
          th: "ทำงาน/ใช้แรง",
        }),
      },
      {
        id: "driving",
        labels: L("開車／搭車", {
          en: "Driving / riding",
          vi: "Đang lái / đi xe",
          id: "Mengemudi / naik kendaraan",
          ja: "運転・乗車中",
          ko: "운전/탑승 중",
          fil: "Nagmamaneho / sakay",
          th: "ขับรถ/โดยสาร",
        }),
      },
      {
        id: "eating",
        labels: L("吃飯", {
          en: "Eating",
          vi: "Đang ăn",
          id: "Makan",
          ja: "食事中",
          ko: "식사 중",
          fil: "Kumakain",
          th: "กินอาหาร",
        }),
      },
      {
        id: "exercise",
        labels: L("運動", {
          en: "Exercise",
          vi: "Đang tập",
          id: "Olahraga",
          ja: "運動中",
          ko: "운동 중",
          fil: "Nag-eehersisyo",
          th: "ออกกำลังกาย",
        }),
      },
      {
        id: "emotional",
        labels: L("情緒激動／爭吵", {
          en: "Upset / argument",
          vi: "Bực tức / cãi nhau",
          id: "Emosi / bertengkar",
          ja: "興奮・口論",
          ko: "흥분/다툼",
          fil: "Nagalit / nag-away",
          th: "โมโห/ทะเลาะ",
        }),
      },
      {
        id: "during_trauma",
        labels: L("外傷當下", {
          en: "During trauma",
          vi: "Khi bị thương",
          id: "Saat cedera",
          ja: "受傷時",
          ko: "외상 당시",
          fil: "Nang masugatan",
          th: "ตอนบาดเจ็บ",
        }),
      },
      { id: "other", labels: OTHER, opensNote: true },
      { id: "unknown_option", labels: UNKNOWN, exclusive: true },
    ],
  },
  {
    id: "intake",
    title: L("吃（上一餐）", {
      en: "Last oral intake",
      vi: "Bữa ăn gần nhất",
      id: "Makan terakhir",
      ja: "最後の食事",
      ko: "마지막 식사",
      fil: "Huling kain",
      th: "มื้อล่าสุด",
    }),
    selection: "single",
    options: [
      {
        id: "within_1h",
        labels: L("1 小時內", {
          en: "Within 1 hour",
          vi: "Trong 1 giờ",
          id: "Dalam 1 jam",
          ja: "1時間以内",
          ko: "1시간 이내",
          fil: "Sa loob ng 1 oras",
          th: "ภายใน 1 ชั่วโมง",
        }),
      },
      {
        id: "1_to_4h",
        labels: L("1–4 小時", {
          en: "1–4 hours ago",
          vi: "1–4 giờ trước",
          id: "1–4 jam lalu",
          ja: "1〜4時間前",
          ko: "1–4시간 전",
          fil: "1–4 oras na ang nakalipas",
          th: "1–4 ชั่วโมงที่แล้ว",
        }),
      },
      {
        id: "over_4h",
        labels: L("超過 4 小時", {
          en: "Over 4 hours ago",
          vi: "Hơn 4 giờ",
          id: "Lebih dari 4 jam",
          ja: "4時間以上前",
          ko: "4시간 이상 전",
          fil: "Mahigit 4 oras na",
          th: "เกิน 4 ชั่วโมง",
        }),
      },
      {
        id: "no_food_today",
        labels: L("今天沒吃", {
          en: "Nothing today",
          vi: "Hôm nay chưa ăn",
          id: "Hari ini belum makan",
          ja: "今日は食べていない",
          ko: "오늘 안 먹음",
          fil: "Wala pang kain ngayon",
          th: "วันนี้ยังไม่กิน",
        }),
      },
      { id: "other", labels: OTHER, opensNote: true },
      { id: "unknown_option", labels: UNKNOWN, exclusive: true },
    ],
  },
  {
    id: "past_history",
    title: L("過（過去疾病）", {
      en: "Past history",
      vi: "Bệnh cũ",
      id: "Riwayat penyakit",
      ja: "既往歴",
      ko: "과거 병력",
      fil: "Nakaraang sakit",
      th: "โรคประจำตัว",
    }),
    selection: "multi",
    options: [
      {
        id: "hypertension",
        labels: L("高血壓", {
          en: "Hypertension",
          vi: "Cao huyết áp",
          id: "Hipertensi",
          ja: "高血圧",
          ko: "고혈압",
          fil: "High blood",
          th: "ความดันสูง",
        }),
      },
      {
        id: "diabetes",
        labels: L("糖尿病", {
          en: "Diabetes",
          vi: "Tiểu đường",
          id: "Diabetes",
          ja: "糖尿病",
          ko: "당뇨",
          fil: "Diabetes",
          th: "เบาหวาน",
        }),
      },
      {
        id: "heart_disease",
        labels: L("心臟病", {
          en: "Heart disease",
          vi: "Bệnh tim",
          id: "Penyakit jantung",
          ja: "心臓病",
          ko: "심장병",
          fil: "Sakit sa puso",
          th: "โรคหัวใจ",
        }),
      },
      {
        id: "asthma",
        labels: L("氣喘", {
          en: "Asthma",
          vi: "Hen suyễn",
          id: "Asma",
          ja: "喘息",
          ko: "천식",
          fil: "Hika",
          th: "หอบหืด",
        }),
      },
      {
        id: "stroke",
        labels: L("中風", {
          en: "Stroke",
          vi: "Đột quỵ",
          id: "Stroke",
          ja: "脳卒中",
          ko: "뇌졸중",
          fil: "Stroke",
          th: "โรคหลอดเลือดสมอง",
        }),
      },
      {
        id: "epilepsy",
        labels: L("癲癇", {
          en: "Epilepsy",
          vi: "Động kinh",
          id: "Epilepsi",
          ja: "てんかん",
          ko: "뇌전증",
          fil: "Epilepsy",
          th: "โรคลมชัก",
        }),
      },
      { id: "none", labels: NONE, exclusive: true },
      { id: "other", labels: OTHER, opensNote: true },
      { id: "unknown_option", labels: UNKNOWN, exclusive: true },
    ],
  },
  {
    id: "medications",
    title: L("藥（服用藥物）", {
      en: "Medications",
      vi: "Thuốc đang dùng",
      id: "Obat",
      ja: "服薬",
      ko: "복용 약물",
      fil: "Gamot",
      th: "ยาที่กิน",
    }),
    selection: "multi",
    options: [
      {
        id: "antihypertensive",
        labels: L("降血壓藥", {
          en: "Blood pressure meds",
          vi: "Thuốc huyết áp",
          id: "Obat darah tinggi",
          ja: "血圧の薬",
          ko: "혈압약",
          fil: "Gamot sa high blood",
          th: "ยาความดัน",
        }),
      },
      {
        id: "diabetes_meds",
        labels: L("降血糖藥／胰島素", {
          en: "Diabetes meds / insulin",
          vi: "Thuốc tiểu đường / insulin",
          id: "Obat diabetes / insulin",
          ja: "糖尿病薬・インスリン",
          ko: "당뇨약/인슐린",
          fil: "Gamot sa diabetes / insulin",
          th: "ยาเบาหวาน/อินซูลิน",
        }),
      },
      {
        id: "anticoagulant",
        labels: L("抗凝血藥", {
          en: "Blood thinners",
          vi: "Thuốc chống đông",
          id: "Pengencer darah",
          ja: "抗凝固薬",
          ko: "항응고제",
          fil: "Pampanipis ng dugo",
          th: "ยาละลายลิ่มเลือด",
        }),
      },
      {
        id: "heart_meds",
        labels: L("心臟病藥", {
          en: "Heart medications",
          vi: "Thuốc tim",
          id: "Obat jantung",
          ja: "心臓の薬",
          ko: "심장약",
          fil: "Gamot sa puso",
          th: "ยาโรคหัวใจ",
        }),
      },
      {
        id: "painkillers",
        labels: L("止痛藥", {
          en: "Painkillers",
          vi: "Thuốc giảm đau",
          id: "Pereda nyeri",
          ja: "痛み止め",
          ko: "진통제",
          fil: "Pampawala ng sakit",
          th: "ยาแก้ปวด",
        }),
      },
      { id: "none", labels: NONE, exclusive: true },
      { id: "other", labels: OTHER, opensNote: true },
      { id: "unknown_option", labels: UNKNOWN, exclusive: true },
    ],
  },
  {
    id: "allergies",
    title: L("敏（過敏）", {
      en: "Allergies",
      vi: "Dị ứng",
      id: "Alergi",
      ja: "アレルギー",
      ko: "알레르기",
      fil: "Alerdyi",
      th: "แพ้",
    }),
    selection: "multi",
    options: [
      {
        id: "drug_allergy",
        labels: L("藥物過敏", {
          en: "Drug allergy",
          vi: "Dị ứng thuốc",
          id: "Alergi obat",
          ja: "薬のアレルギー",
          ko: "약 알레르기",
          fil: "Alerdyi sa gamot",
          th: "แพ้ยา",
        }),
        opensNote: true,
      },
      {
        id: "food_allergy",
        labels: L("食物過敏", {
          en: "Food allergy",
          vi: "Dị ứng thức ăn",
          id: "Alergi makanan",
          ja: "食物アレルギー",
          ko: "음식 알레르기",
          fil: "Alerdyi sa pagkain",
          th: "แพ้อาหาร",
        }),
        opensNote: true,
      },
      {
        id: "none",
        labels: L("無已知過敏", {
          en: "No known allergies",
          vi: "Không dị ứng",
          id: "Tidak ada alergi diketahui",
          ja: "アレルギーなし",
          ko: "알려진 알레르기 없음",
          fil: "Walang alam na alerdyi",
          th: "ไม่ทราบว่าแพ้อะไร",
        }),
        exclusive: true,
      },
      { id: "other", labels: OTHER, opensNote: true },
      { id: "unknown_option", labels: UNKNOWN, exclusive: true },
    ],
  },
];

export function getHistoryCatalog(
  step: HistoryStepId,
): HistoryStepCatalog | undefined {
  return HISTORY_BLOCK.find((s) => s.id === step);
}

export function isHistoryStep(step: string): step is HistoryStepId {
  return (HISTORY_STEP_ORDER as readonly string[]).includes(step);
}

export function nextHistoryStep(
  step: HistoryStepId,
): HistoryStepId | "other_symptoms" {
  const index = HISTORY_STEP_ORDER.indexOf(step);
  if (index < 0 || index >= HISTORY_STEP_ORDER.length - 1) {
    return "other_symptoms";
  }
  return HISTORY_STEP_ORDER[index + 1]!;
}

export function previousHistoryStep(
  step: HistoryStepId,
): HistoryStepId | "chief_complaint_2" {
  const index = HISTORY_STEP_ORDER.indexOf(step);
  if (index <= 0) return "chief_complaint_2";
  return HISTORY_STEP_ORDER[index - 1]!;
}
