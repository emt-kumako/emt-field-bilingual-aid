import { L, type BilingualText } from "./labels.js";

export type TraumaTrafficRelated = "traffic" | "non_traffic";

export type LabeledOption = {
  id: string;
  labels: BilingualText;
};

export const TRAUMA_TRAFFIC_OPTIONS: {
  id: TraumaTrafficRelated;
  labels: BilingualText;
}[] = [
  {
    id: "traffic",
    labels: L("因交通事故", {
      en: "Traffic-related",
      vi: "Liên quan giao thông",
      id: "Terkait lalu lintas",
      ja: "交通事故による",
      ko: "교통사고 관련",
      fil: "Kaugnay sa trapiko",
      th: "เกี่ยวกับอุบัติเหตุจราจร",
      de: "Verkehrsunfall",
      fr: "Lié à la circulation",
      es: "Relacionado con el tráfico",
    }),
  },
  {
    id: "non_traffic",
    labels: L("非交通事故", {
      en: "Non-traffic",
      vi: "Không liên quan giao thông",
      id: "Bukan lalu lintas",
      ja: "交通事故以外",
      ko: "비교통",
      fil: "Hindi trapiko",
      th: "ไม่ใช่อุบัติเหตุจราจร",
      de: "Kein Verkehrsunfall",
      fr: "Hors circulation",
      es: "No relacionado con el tráfico",
    }),
  },
];

/** Traffic branch only — four vehicle classes. */
export const TRAUMA_VEHICLE_OPTIONS: LabeledOption[] = [
  {
    id: "car",
    labels: L("汽車", {
      en: "Car",
      vi: "Ô tô",
      id: "Mobil",
      ja: "自動車",
      ko: "자동차",
      fil: "Kotse",
      th: "รถยนต์",
      de: "Pkw",
      fr: "Voiture",
      es: "Coche",
    }),
  },
  {
    id: "motorcycle",
    labels: L("機車", {
      en: "Motorcycle",
      vi: "Xe máy",
      id: "Motor",
      ja: "バイク",
      ko: "오토바이",
      fil: "Motorsiklo",
      th: "รถจักรยานยนต์",
      de: "Motorrad",
      fr: "Moto",
      es: "Moto",
    }),
  },
  {
    id: "bicycle",
    labels: L("腳踏車", {
      en: "Bicycle",
      vi: "Xe đạp",
      id: "Sepeda",
      ja: "自転車",
      ko: "자전거",
      fil: "Bisikleta",
      th: "จักรยาน",
      de: "Fahrrad",
      fr: "Vélo",
      es: "Bicicleta",
    }),
  },
  {
    id: "pedestrian",
    labels: L("行人", {
      en: "Pedestrian",
      vi: "Người đi bộ",
      id: "Pejalan kaki",
      ja: "歩行者",
      ko: "보행자",
      fil: "Pedestrian",
      th: "คนเดินเท้า",
      de: "Fußgänger",
      fr: "Piéton",
      es: "Peatón",
    }),
  },
];

export type TraumaInjuryOption = LabeledOption & {
  /** Show fall-height meters field when selected. */
  asksFallHeight?: boolean;
};

/** Non-traffic injury types (OHCA is a separate top toggle). */
export const TRAUMA_INJURY_OPTIONS: TraumaInjuryOption[] = [
  {
    id: "fall",
    labels: L("摔跌傷", {
      en: "Fall / slip",
      vi: "Ngã / trượt",
      id: "Jatuh / terpeleset",
      ja: "転倒・転落（低所）",
      ko: "미끄러짐/낙상",
      fil: "Nadulas / nahulog",
      th: "ลื่นล้ม",
      de: "Sturz",
      fr: "Chute",
      es: "Caída / resbalón",
    }),
  },
  {
    id: "fall_from_height",
    asksFallHeight: true,
    labels: L("墜落傷", {
      en: "Fall from height",
      vi: "Ngã từ cao",
      id: "Jatuh dari ketinggian",
      ja: "高所からの墜落",
      ko: "고소 추락",
      fil: "Nahulog mula sa taas",
      th: "ตกจากที่สูง",
      de: "Sturz aus der Höhe",
      fr: "Chute de hauteur",
      es: "Caída desde altura",
    }),
  },
  {
    id: "drowning",
    labels: L("溺水", {
      en: "Drowning",
      vi: "Đuối nước",
      id: "Tenggelam",
      ja: "溺水",
      ko: "익수",
      fil: "Nalunod",
      th: "จมน้ำ",
      de: "Ertrinken",
      fr: "Noyade",
      es: "Ahogamiento",
    }),
  },
  {
    id: "penetrating",
    labels: L("穿刺傷", {
      en: "Penetrating injury",
      vi: "Vết thương xuyên thấu",
      id: "Luka tembus",
      ja: "刺し傷・貫通傷",
      ko: "관통상",
      fil: "Tusok / penetrating",
      th: "แผลทะลุ/แทง",
      de: "Penetrierende Verletzung",
      fr: "Blessure pénétrante",
      es: "Herida penetrante",
    }),
  },
  {
    id: "burn",
    labels: L("燒燙傷", {
      en: "Burn",
      vi: "Bỏng",
      id: "Luka bakar",
      ja: "熱傷・やけど",
      ko: "화상",
      fil: "Paso / burn",
      th: "แผลไหม้",
      de: "Verbrühung / Verbrennung",
      fr: "Brûlure",
      es: "Quemadura",
    }),
  },
  {
    id: "electrocution",
    labels: L("電擊傷", {
      en: "Electrocution",
      vi: "Điện giật",
      id: "Sengatan listrik",
      ja: "感電",
      ko: "감전",
      fil: "Na-shock",
      th: "ไฟดูด",
      de: "Stromunfall",
      fr: "Électrocution",
      es: "Electrocución",
    }),
  },
  {
    id: "bite_sting",
    labels: L("生物咬螫傷", {
      en: "Animal / insect bite or sting",
      vi: "Cắn / đốt",
      id: "Gigitan / sengatan",
      ja: "動物・昆虫による咬刺",
      ko: "동물/곤충 교상",
      fil: "Kagat / kagat ng insekto",
      th: "สัตว์/แมลงกัดต่อย",
      de: "Biss / Stich",
      fr: "Morsure / piqûre",
      es: "Mordedura / picadura",
    }),
  },
  {
    id: "other_injury",
    labels: L("其他外傷", {
      en: "Other trauma",
      vi: "Chấn thương khác",
      id: "Trauma lain",
      ja: "その他の外傷",
      ko: "기타 외상",
      fil: "Ibang trauma",
      th: "บาดเจ็บอื่น",
      de: "Sonstiges Trauma",
      fr: "Autre traumatisme",
      es: "Otro trauma",
    }),
  },
];

export const TRAUMA_OHCA_LABELS = L("創傷 OHCA（到院前心肺功能停止）", {
  en: "Trauma OHCA",
  vi: "OHCA do chấn thương",
  id: "OHCA trauma",
  ja: "外傷性 OHCA",
  ko: "외상 OHCA",
  fil: "Trauma OHCA",
  th: "OHCA จากบาดเจ็บ",
  de: "Trauma-OHCA",
  fr: "OHCA traumatique",
  es: "OHCA traumático",
});

export function getTraumaInjury(id: string): TraumaInjuryOption | undefined {
  return TRAUMA_INJURY_OPTIONS.find((o) => o.id === id);
}

/** Meters are canonical; show feet+inches for bilingual confirm. */
export function metersToImperial(meters: number): {
  feet: number;
  inches: number;
} {
  if (!Number.isFinite(meters) || meters < 0) {
    return { feet: 0, inches: 0 };
  }
  const totalInches = meters * 39.37007874;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  if (inches === 12) {
    return { feet: feet + 1, inches: 0 };
  }
  return { feet, inches };
}

export function formatMetersWithImperial(meters: number, lang: "zh" | "en"): string {
  const { feet, inches } = metersToImperial(meters);
  if (lang === "zh") {
    return `約 ${meters} 公尺（約 ${feet} 英尺 ${inches} 英寸）`;
  }
  return `about ${meters} m (about ${feet} ft ${inches} in)`;
}
