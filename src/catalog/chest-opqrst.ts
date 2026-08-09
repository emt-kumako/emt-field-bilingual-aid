import { L, type BilingualText } from "./labels.js";

export type LabeledId = {
  id: string;
  labels: BilingualText;
  exclusive?: boolean;
};

export const OPQRST_ONSET: LabeledId[] = [
  {
    id: "sudden",
    labels: L("突然發生", {
      en: "Sudden onset",
      vi: "Xuất hiện đột ngột",
      id: "Muncul tiba-tiba",
      ja: "突然始まった",
      ko: "갑자기 시작",
      fil: "Biglaang pagsisimula",
      th: "เกิดฉับพลัน",
      de: "Plötzlicher Beginn",
      fr: "Apparition soudaine",
      es: "Inicio súbito",
    }),
  },
  {
    id: "gradual",
    labels: L("發生一陣子", {
      en: "Gradual / for a while",
      vi: "Xuất hiện dần / một lúc",
      id: "Bertahap / sudah beberapa saat",
      ja: "しばらく続いていた",
      ko: "조금씩/한동안",
      fil: "Unti-unti / sandali na",
      th: "ค่อยเป็นค่อยไป/ระยะหนึ่ง",
      de: "Allmählich / seit einer Weile",
      fr: "Progressif / depuis un moment",
      es: "Gradual / desde hace un rato",
    }),
  },
];

export const OPQRST_PROVOCATION: LabeledId[] = [
  {
    id: "position_helps",
    labels: L("改變姿勢會緩解", {
      en: "Position change helps",
      vi: "Đổi tư thế thì đỡ",
      id: "Ubah posisi meredakan",
      ja: "姿勢を変えると楽",
      ko: "자세 바꾸면 완화",
      fil: "Gumagaan kapag nagpalit ng postura",
      th: "เปลี่ยนท่าแล้วดีขึ้น",
      de: "Lagewechsel lindert",
      fr: "Changer de position soulage",
      es: "Cambiar de postura alivia",
    }),
  },
  {
    id: "position_no_help",
    labels: L("姿勢無法緩解", {
      en: "Position does not help",
      vi: "Đổi tư thế không đỡ",
      id: "Ubah posisi tidak meredakan",
      ja: "姿勢を変えても楽にならない",
      ko: "자세 바꿔도 안 나아짐",
      fil: "Hindi gumagaan sa pagpapalit ng postura",
      th: "เปลี่ยนท่าแล้วไม่ดีขึ้น",
      de: "Lagewechsel lindert nicht",
      fr: "Changer de position ne soulage pas",
      es: "Cambiar de postura no alivia",
    }),
  },
  {
    id: "meds_help",
    labels: L("服藥會緩解", {
      en: "Medication helps",
      vi: "Uống thuốc thì đỡ",
      id: "Obat meredakan",
      ja: "薬で楽になる",
      ko: "약 먹으면 완화",
      fil: "Gumagaan sa gamot",
      th: "กินยาแล้วดีขึ้น",
      de: "Medikamente lindern",
      fr: "Les médicaments soulagent",
      es: "La medicación alivia",
    }),
  },
  {
    id: "meds_no_help",
    labels: L("服藥無法緩解", {
      en: "Medication does not help",
      vi: "Uống thuốc không đỡ",
      id: "Obat tidak meredakan",
      ja: "薬でも楽にならない",
      ko: "약 먹어도 안 나아짐",
      fil: "Hindi gumagaan sa gamot",
      th: "กินยาแล้วไม่ดีขึ้น",
      de: "Medikamente lindern nicht",
      fr: "Les médicaments ne soulagent pas",
      es: "La medicación no alivia",
    }),
  },
];

export const OPQRST_QUALITY: LabeledId[] = [
  {
    id: "tearing",
    labels: L("撕裂痛", {
      en: "Tearing / ripping",
      vi: "Đau xé",
      id: "Nyeri seperti robek",
      ja: "裂けるような痛み",
      ko: "찢어지는 통증",
      fil: "Parang napunit",
      th: "เจ็บเหมือนฉีก",
      de: "Reißend",
      fr: "Déchirante",
      es: "Desgarrante",
    }),
  },
  {
    id: "pressure",
    labels: L("壓痛／壓迫感", {
      en: "Pressure / crushing",
      vi: "Đau tức / đè",
      id: "Nyeri tekan / berat",
      ja: "圧迫感",
      ko: "압박감",
      fil: "Paninikip / diin",
      th: "แน่น/กดเจ็บ",
      de: "Druck / Enge",
      fr: "Pression / oppression",
      es: "Presión / opresión",
    }),
  },
  {
    id: "stabbing",
    labels: L("刺痛", {
      en: "Stabbing",
      vi: "Đau nhói",
      id: "Nyeri tusuk",
      ja: "刺すような痛み",
      ko: "찌르는 통증",
      fil: "Tusok-tusok",
      th: "เจ็บแปลบ",
      de: "Stechend",
      fr: "En coup de poignard",
      es: "Punzante",
    }),
  },
  {
    id: "colicky",
    labels: L("絞痛", {
      en: "Colicky / cramping",
      vi: "Đau quặn",
      id: "Nyeri mulas",
      ja: "締めつけ・疝痛",
      ko: "쥐어짜는 통증",
      fil: "Kirot / pulikat",
      th: "ปวดบิด",
      de: "Kolikartig",
      fr: "Colique / crampe",
      es: "Cólico",
    }),
  },
];

/** R region／radiation sites shown as one flat multi-select list. */
export const OPQRST_REGIONS: LabeledId[] = [
  {
    id: "jaw_neck",
    labels: L("下巴／脖子", {
      en: "Jaw / neck",
      vi: "Hàm / cổ",
      id: "Rahang / leher",
      ja: "あご／首",
      ko: "턱/목",
      fil: "Panga / leeg",
      th: "คาง/คอ",
      de: "Kiefer / Hals",
      fr: "Mâchoire / cou",
      es: "Mandíbula / cuello",
    }),
  },
  {
    id: "chest_left",
    labels: L("左側胸", {
      en: "Left chest",
      vi: "Ngực trái",
      id: "Dada kiri",
      ja: "左胸",
      ko: "왼쪽 가슴",
      fil: "Kaliwang dibdib",
      th: "หน้าอกซ้าย",
      de: "Linke Brust",
      fr: "Poitrine gauche",
      es: "Pecho izquierdo",
    }),
  },
  {
    id: "chest_right",
    labels: L("右側胸", {
      en: "Right chest",
      vi: "Ngực phải",
      id: "Dada kanan",
      ja: "右胸",
      ko: "오른쪽 가슴",
      fil: "Kanang dibdib",
      th: "หน้าอกขวา",
      de: "Rechte Brust",
      fr: "Poitrine droite",
      es: "Pecho derecho",
    }),
  },
  {
    id: "epigastrium",
    labels: L("上腹", {
      en: "Upper abdomen",
      vi: "Thượng vị",
      id: "Ulu hati",
      ja: "みぞおち／上腹部",
      ko: "상복부",
      fil: "Itaas ng tiyan",
      th: "ท้องส่วนบน",
      de: "Oberbauch",
      fr: "Épigastre",
      es: "Epigastrio",
    }),
  },
  {
    id: "shoulder",
    labels: L("肩膀", {
      en: "Shoulder",
      vi: "Vai",
      id: "Bahu",
      ja: "肩",
      ko: "어깨",
      fil: "Balikat",
      th: "ไหล่",
      de: "Schulter",
      fr: "Épaule",
      es: "Hombro",
    }),
  },
  {
    id: "lower_back",
    labels: L("下背", {
      en: "Lower back",
      vi: "Lưng dưới",
      id: "Pinggang bawah",
      ja: "腰／下背部",
      ko: "허리/아래등",
      fil: "Ibaba ng likod",
      th: "หลังส่วนล่าง",
      de: "Unterer Rücken",
      fr: "Bas du dos",
      es: "Zona lumbar",
    }),
  },
  {
    id: "none",
    exclusive: true,
    labels: L("無", {
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
    }),
  },
];

/** @deprecated Radiation sites folded into OPQRST_REGIONS; kept empty for imports. */
export const OPQRST_RADIATION_SITES: LabeledId[] = [];

export const OPQRST_TIME_PATTERN: LabeledId[] = [
  {
    id: "intermittent",
    labels: L("一陣一陣", {
      en: "Comes and goes",
      vi: "Từng cơn",
      id: "Hilang timbul",
      ja: "波がある／断続的",
      ko: "왔다 갔다",
      fil: "Pumapasok-labas",
      th: "เป็น ๆ หาย ๆ",
      de: "Wellenförmig",
      fr: "Par crises",
      es: "Intermitente",
    }),
  },
  {
    id: "continuous",
    labels: L("一直持續", {
      en: "Continuous",
      vi: "Liên tục",
      id: "Terus-menerus",
      ja: "ずっと続く",
      ko: "계속됨",
      fil: "Tuloy-tuloy",
      th: "ต่อเนื่อง",
      de: "Durchgehend",
      fr: "Continu",
      es: "Continuo",
    }),
  },
];

/** Letter gloss shown as `O […]` — second-language string only. */
export const OPQRST_LETTER_GLOSS = {
  O: L("發作狀況", {
    en: "Onset",
    vi: "Khởi phát",
    id: "Awal mula",
    ja: "発症様式",
    ko: "발병 상황",
    fil: "Simula",
    th: "การเริ่มต้น",
    de: "Beginn",
    fr: "Début",
    es: "Inicio",
  }),
  P: L("誘發與緩解因子", {
    en: "Provocation/Palliation",
    vi: "Yếu tố kích thích/giảm",
    id: "Pemicu / pereda",
    ja: "増悪・寛解因子",
    ko: "유발·완화 요인",
    fil: "Nakakapukaw / nakakapaginhawa",
    th: "ปัจจัยกระตุ้น/บรรเทา",
    de: "Auslöser/Linderung",
    fr: "Provocation/Soulagement",
    es: "Provocación/Alivio",
  }),
  Q: L("性質", {
    en: "Quality",
    vi: "Tính chất",
    id: "Kualitas",
    ja: "性質",
    ko: "양상",
    fil: "Katangian",
    th: "ลักษณะ",
    de: "Qualität",
    fr: "Qualité",
    es: "Calidad",
  }),
  R: L("部位與放射痛", {
    en: "Region/Radiation",
    vi: "Vị trí / lan tỏa",
    id: "Lokasi / radiasi",
    ja: "部位・放散",
    ko: "부위·방사통",
    fil: "Lugar / radiation",
    th: "ตำแหน่ง/ปวดร้าว",
    de: "Region/Ausstrahlung",
    fr: "Siège/Irradiation",
    es: "Región/Irradiación",
  }),
  S: L("嚴重程度", {
    en: "Severity",
    vi: "Mức độ",
    id: "Keparahan",
    ja: "重症度",
    ko: "심각도",
    fil: "Tindi",
    th: "ความรุนแรง",
    de: "Schweregrad",
    fr: "Intensité",
    es: "Severidad",
  }),
  T: L("時間軸", {
    en: "Time",
    vi: "Thời gian",
    id: "Waktu",
    ja: "時間経過",
    ko: "시간축",
    fil: "Oras",
    th: "เวลา",
    de: "Zeitverlauf",
    fr: "Temps",
    es: "Tiempo",
  }),
} as const satisfies Record<string, BilingualText>;

export const OPQRST_TIME_UNKNOWN_LABELS = L("時間不詳", {
  en: "Time unknown",
  vi: "Không rõ thời gian",
  id: "Waktu tidak jelas",
  ja: "時間がわからない",
  ko: "시간 불명",
  fil: "Hindi alam ang oras",
  th: "ไม่ทราบเวลา",
  de: "Zeit unklar",
  fr: "Temps inconnu",
  es: "Tiempo desconocido",
});

export const OPQRST_RADIATION_TOGGLE_LABELS = L("有延伸／轉移", {
  en: "Radiates / moves",
  vi: "Lan / di chuyển",
  id: "Menjalar",
  ja: "放散・移動する",
  ko: "방사/전이",
  fil: "May radiation",
  th: "ร้าว/ย้ายที่",
  de: "Ausstrahlung",
  fr: "Irradiation",
  es: "Irradia",
});

/** Faces cropped from the Pain Assessment Tool chart (public/pain-faces). */
export const PAIN_FACE_ASSETS: {
  file: string;
  label: string;
  start: number;
  end: number;
}[] = [
  { file: "face-0.png", label: "0", start: 0, end: 0 },
  { file: "face-1-3.png", label: "1–3", start: 1, end: 3 },
  { file: "face-4-6.png", label: "4–6", start: 4, end: 6 },
  { file: "face-7-9.png", label: "7–9", start: 7, end: 9 },
  { file: "face-10.png", label: "10", start: 10, end: 10 },
];

export const PAIN_SCALE_SOURCE_URL =
  "https://medicalxpress.com/news/2022-07-emoji-shown-effective-numerical-pain.html";

export const PAIN_SCALE_SOURCE_NOTE = L(
  "參考來源：疼痛評估尺表情圖（點選 0–10）",
  {
    en: "Source: pain assessment faces (tap 0–10)",
    vi: "Nguồn: thang đau mặt (chọn 0–10)",
    id: "Sumber: wajah skala nyeri (ketuk 0–10)",
    ja: "出典：ペインフェイス図（0–10を選択）",
    ko: "출처: 통증 얼굴 척도(0–10 선택)",
    fil: "Pinagmulan: pain face scale (pindutin 0–10)",
    th: "ที่มา: หน้า pain scale (แตะ 0–10)",
    de: "Quelle: Schmerzgesichter (0–10 tippen)",
    fr: "Source : visages douleur (toucher 0–10)",
    es: "Fuente: caras de dolor (tocar 0–10)",
  },
);
