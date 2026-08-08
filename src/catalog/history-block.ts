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
  /** Mutually exclusive within this group only (e.g. dialysis side). */
  mutexGroup?: string;
  /** Optional UI grouping key (e.g. yesterday / today for intake). */
  group?: string;
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
      de: "Sonstiges",
      fr: "Autre",
      es: "Otro",
    });
const UNKNOWN = L("不知道", {
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
    });
const NONE = L("無", {
  en: "None",
  vi: "Không",
  id: "Tidak ada",
  ja: "なし",
  ko: "없음",
  fil: "Wala",
  th: "ไม่มี",
      de: "Keine",
      fr: "Aucun",
      es: "Ninguno",
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
      de: "Vor Beginn",
      fr: "Avant le début",
      es: "Antes del inicio",
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
      de: "Im Schlaf",
      fr: "En dormant",
      es: "Durmiendo",
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
      de: "In Ruhe",
      fr: "Au repos",
      es: "En reposo",
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
      de: "Beim Gehen",
      fr: "En marchant",
      es: "Caminando",
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
      de: "Bei der Arbeit",
      fr: "Au travail",
      es: "Trabajando",
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
      de: "Autofahren / Mitfahren",
      fr: "Conduite / trajet",
      es: "Conduciendo / en vehículo",
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
      de: "Beim Essen",
      fr: "En mangeant",
      es: "Comiendo",
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
      de: "Sport / Anstrengung",
      fr: "Sport / effort",
      es: "Ejercicio",
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
      de: "Streit / Aufregung",
      fr: "Dispute / émotion",
      es: "Discusión / altercado",
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
      de: "Beim Unfall / Trauma",
      fr: "Pendant le traumatisme",
      es: "Durante el trauma",
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
      de: "Letzte Mahlzeit",
      fr: "Dernière prise alimentaire",
      es: "Última comida",
    }),
    selection: "single",
    options: [
      {
        id: "yesterday_breakfast",
        group: "yesterday",
        labels: L("早餐", {
          en: "Breakfast",
          vi: "Bữa sáng",
          id: "Sarapan",
          ja: "朝食",
          ko: "아침",
          fil: "Almusal",
          th: "อาหารเช้า",
      de: "Frühstück",
      fr: "Petit-déjeuner",
      es: "Desayuno",
    }),
      },
      {
        id: "yesterday_lunch",
        group: "yesterday",
        labels: L("午餐", {
          en: "Lunch",
          vi: "Bữa trưa",
          id: "Makan siang",
          ja: "昼食",
          ko: "점심",
          fil: "Tanghalian",
          th: "อาหารกลางวัน",
      de: "Mittagessen",
      fr: "Déjeuner",
      es: "Almuerzo",
    }),
      },
      {
        id: "yesterday_dinner",
        group: "yesterday",
        labels: L("晚餐", {
          en: "Dinner",
          vi: "Bữa tối",
          id: "Makan malam",
          ja: "夕食",
          ko: "저녁",
          fil: "Hapunan",
          th: "อาหารเย็น",
      de: "Abendessen",
      fr: "Dîner",
      es: "Cena",
    }),
      },
      {
        id: "today_breakfast",
        group: "today",
        labels: L("早餐", {
          en: "Breakfast",
          vi: "Bữa sáng",
          id: "Sarapan",
          ja: "朝食",
          ko: "아침",
          fil: "Almusal",
          th: "อาหารเช้า",
      de: "Frühstück",
      fr: "Petit-déjeuner",
      es: "Desayuno",
    }),
      },
      {
        id: "today_lunch",
        group: "today",
        labels: L("午餐", {
          en: "Lunch",
          vi: "Bữa trưa",
          id: "Makan siang",
          ja: "昼食",
          ko: "점심",
          fil: "Tanghalian",
          th: "อาหารกลางวัน",
      de: "Mittagessen",
      fr: "Déjeuner",
      es: "Almuerzo",
    }),
      },
      {
        id: "today_dinner",
        group: "today",
        labels: L("晚餐", {
          en: "Dinner",
          vi: "Bữa tối",
          id: "Makan malam",
          ja: "夕食",
          ko: "저녁",
          fil: "Hapunan",
          th: "อาหารเย็น",
      de: "Abendessen",
      fr: "Dîner",
      es: "Cena",
    }),
      },
      { id: "other", labels: OTHER, opensNote: true },
      { id: "unknown_option", labels: UNKNOWN, exclusive: true },
    ],
  },
  {
    id: "past_history",
    title: L("過（過去病史）", {
      en: "Past history",
      vi: "Tiền sử bệnh",
      id: "Riwayat penyakit",
      ja: "既往歴",
      ko: "과거 병력",
      fil: "Nakaraang kasaysayan",
      th: "ประวัติโรคประจำตัว",
      de: "Vorgeschichte",
      fr: "Antécédents",
      es: "Antecedentes",
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
      de: "Bluthochdruck",
      fr: "Hypertension",
      es: "Hipertensión",
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
      de: "Diabetes",
      fr: "Diabète",
      es: "Diabetes",
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
      de: "Herzkrankheit",
      fr: "Maladie cardiaque",
      es: "Enfermedad del corazón",
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
      de: "Asthma",
      fr: "Asthme",
      es: "Asma",
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
      de: "Schlaganfall",
      fr: "AVC",
      es: "Derrame / ACV",
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
      de: "Epilepsie",
      fr: "Épilepsie",
      es: "Epilepsia",
    }),
      },
      {
        id: "dialysis_left",
        mutexGroup: "dialysis",
        labels: L("洗腎（左手）", {
          en: "Dialysis (left arm)",
          vi: "Chạy thận (tay trái)",
          id: "Cuci darah (lengan kiri)",
          ja: "透析（左手）",
          ko: "투석(왼손)",
          fil: "Dialysis (kaliwang kamay)",
          th: "ฟอกไต (มือซ้าย)",
      de: "Dialyse (linker Arm)",
      fr: "Dialyse (bras gauche)",
      es: "Diálisis (brazo izquierdo)",
    }),
      },
      {
        id: "dialysis_right",
        mutexGroup: "dialysis",
        labels: L("洗腎（右手）", {
          en: "Dialysis (right arm)",
          vi: "Chạy thận (tay phải)",
          id: "Cuci darah (lengan kanan)",
          ja: "透析（右手）",
          ko: "투석(오른손)",
          fil: "Dialysis (kanang kamay)",
          th: "ฟอกไต (มือขวา)",
      de: "Dialyse (rechter Arm)",
      fr: "Dialyse (bras droit)",
      es: "Diálisis (brazo derecho)",
    }),
      },
      {
        id: "mental_illness",
        labels: L("精神疾病", {
          en: "Mental illness",
          vi: "Bệnh tâm thần",
          id: "Penyakit jiwa",
          ja: "精神疾患",
          ko: "정신 질환",
          fil: "Sakit sa pag-iisip",
          th: "โรคทางจิต",
      de: "Psychische Erkrankung",
      fr: "Maladie mentale",
      es: "Enfermedad mental",
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
      de: "Medikamente",
      fr: "Médicaments",
      es: "Medicamentos",
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
      de: "Blutdruckmedikamente",
      fr: "Médicaments pour la tension",
      es: "Medicamentos para la presión",
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
      de: "Diabetesmedikamente / Insulin",
      fr: "Médicaments diabète / insuline",
      es: "Medicina diabetes / insulina",
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
      de: "Blutverdünner",
      fr: "Anticoagulants",
      es: "Anticoagulantes",
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
      de: "Herzmedikamente",
      fr: "Médicaments cardiaques",
      es: "Medicamentos para el corazón",
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
      de: "Schmerzmittel",
      fr: "Antalgiques",
      es: "Analgésicos",
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
      de: "Allergien",
      fr: "Allergies",
      es: "Alergias",
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
      de: "Medikamentenallergie",
      fr: "Allergie médicamenteuse",
      es: "Alergia a medicamentos",
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
      de: "Nahrungsmittelallergie",
      fr: "Allergie alimentaire",
      es: "Alergia alimentaria",
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
      de: "Keine bekannten Allergien",
      fr: "Pas d'allergie connue",
      es: "Sin alergias conocidas",
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
): HistoryStepId | "chief_complaint_duration" {
  const index = HISTORY_STEP_ORDER.indexOf(step);
  if (index <= 0) return "chief_complaint_duration";
  return HISTORY_STEP_ORDER[index - 1]!;
}
