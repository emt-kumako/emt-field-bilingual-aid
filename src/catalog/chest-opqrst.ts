import { L, type BilingualText } from "./labels.js";

export type LabeledId = { id: string; labels: BilingualText };

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
];

export const OPQRST_QUALITY: LabeledId[] = [
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

export const OPQRST_REGIONS: LabeledId[] = [
  {
    id: "chest_front",
    labels: L("胸前", {
      en: "Front of chest",
      vi: "Trước ngực",
      id: "Depan dada",
      ja: "胸の前",
      ko: "앞가슴",
      fil: "Harap ng dibdib",
      th: "หน้าอกด้านหน้า",
      de: "Brust vorn",
      fr: "Devant la poitrine",
      es: "Pecho frontal",
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
    id: "back",
    labels: L("背部", {
      en: "Back",
      vi: "Lưng",
      id: "Punggung",
      ja: "背中",
      ko: "등",
      fil: "Likod",
      th: "หลัง",
      de: "Rücken",
      fr: "Dos",
      es: "Espalda",
    }),
  },
];

export const OPQRST_RADIATION_SITES: LabeledId[] = [
  {
    id: "jaw",
    labels: L("下顎", {
      en: "Jaw",
      vi: "Hàm",
      id: "Rahang",
      ja: "あご",
      ko: "턱",
      fil: "Panga",
      th: "คาง/ขากรรไกร",
      de: "Kiefer",
      fr: "Mâchoire",
      es: "Mandíbula",
    }),
  },
  {
    id: "left_arm",
    labels: L("左臂", {
      en: "Left arm",
      vi: "Cánh tay trái",
      id: "Lengan kiri",
      ja: "左腕",
      ko: "왼팔",
      fil: "Kaliwang braso",
      th: "แขนซ้าย",
      de: "Linker Arm",
      fr: "Bras gauche",
      es: "Brazo izquierdo",
    }),
  },
  {
    id: "rad_back",
    labels: L("背部", {
      en: "Back",
      vi: "Lưng",
      id: "Punggung",
      ja: "背中",
      ko: "등",
      fil: "Likod",
      th: "หลัง",
      de: "Rücken",
      fr: "Dos",
      es: "Espalda",
    }),
  },
  {
    id: "rad_epigastrium",
    labels: L("上腹", {
      en: "Upper abdomen",
      vi: "Thượng vị",
      id: "Ulu hati",
      ja: "みぞおち",
      ko: "상복부",
      fil: "Itaas ng tiyan",
      th: "ท้องส่วนบน",
      de: "Oberbauch",
      fr: "Épigastre",
      es: "Epigastrio",
    }),
  },
  {
    id: "rad_other",
    labels: L("其他放射處", {
      en: "Other radiation site",
      vi: "Chỗ lan khác",
      id: "Menjalar ke tempat lain",
      ja: "その他の放散",
      ko: "다른 방사 부위",
      fil: "Ibang lugar ng radiation",
      th: "ร้าวไปที่อื่น",
      de: "Andere Ausstrahlung",
      fr: "Autre irradiation",
      es: "Otra irradiación",
    }),
  },
];

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

/** Emoji pain-scale reference (faces are visual aids, not a second control). */
export const PAIN_SCALE_SOURCE_URL =
  "https://medicalxpress.com/news/2022-07-emoji-shown-effective-numerical-pain.html";

export const PAIN_SCALE_SOURCE_NOTE = L(
  "參考來源：emoji 疼痛尺研究（點選 0–10）",
  {
    en: "Source: emoji pain-scale research (tap 0–10)",
    vi: "Nguồn: thang đau emoji (chọn 0–10)",
    id: "Sumber: skala nyeri emoji (ketuk 0–10)",
    ja: "出典：絵文字ペインスケール研究（0–10を選択）",
    ko: "출처: 이모지 통증 척도 연구(0–10 선택)",
    fil: "Pinagmulan: emoji pain scale (pindutin 0–10)",
    th: "ที่มา: งานวิจัย pain scale แบบอีโมจิ (แตะ 0–10)",
    de: "Quelle: Emoji-Schmerzskala-Studie (0–10 tippen)",
    fr: "Source : échelle emoji (toucher 0–10)",
    es: "Fuente: escala emoji (tocar 0–10)",
  },
);
