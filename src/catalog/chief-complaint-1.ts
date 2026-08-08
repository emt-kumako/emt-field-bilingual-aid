import { L, type BilingualText } from "./labels.js";

export type ComplaintTypeOption = {
  id: string;
  localized: boolean;
  labels: BilingualText;
};

export type BodySubregionOption = {
  id: string;
  labels: BilingualText;
};

export type BodyRegionOption = {
  id: string;
  labels: BilingualText;
  subregions: BodySubregionOption[];
};

export const COMPLAINT_TYPES: ComplaintTypeOption[] = [
  {
    id: "pain",
    localized: true,
    labels: L("疼痛", {
      en: "Pain",
      vi: "Đau",
      id: "Nyeri",
      ja: "痛み",
      ko: "통증",
      fil: "Sakit",
      th: "ปวด",
    }),
  },
  {
    id: "breathing",
    localized: true,
    labels: L("呼吸不順／喘", {
      en: "Breathing difficulty",
      vi: "Khó thở",
      id: "Sesak napas",
      ja: "息苦しさ",
      ko: "호흡곤란",
      fil: "Hirap huminga",
      th: "หายใจลำบาก",
    }),
  },
  {
    id: "bleeding",
    localized: true,
    labels: L("出血", {
      en: "Bleeding",
      vi: "Chảy máu",
      id: "Pendarahan",
      ja: "出血",
      ko: "출혈",
      fil: "Pagdurugo",
      th: "เลือดออก",
    }),
  },
  {
    id: "trauma",
    localized: true,
    labels: L("外傷／撞傷", {
      en: "Trauma / injury",
      vi: "Chấn thương",
      id: "Cedera",
      ja: "外傷・けが",
      ko: "외상/부상",
      fil: "Pinsala",
      th: "บาดเจ็บ",
    }),
  },
  {
    id: "weakness",
    localized: false,
    labels: L("無力／全身虛弱", {
      en: "Weakness",
      vi: "Yếu toàn thân",
      id: "Lemah",
      ja: "脱力・だるさ",
      ko: "전신 쇠약",
      fil: "Mahina ang katawan",
      th: "อ่อนแรง",
    }),
  },
  {
    id: "dizziness",
    localized: false,
    labels: L("暈眩", {
      en: "Dizziness",
      vi: "Chóng mặt",
      id: "Pusing",
      ja: "めまい",
      ko: "어지러움",
      fil: "Nahihilo",
      th: "เวียนศีรษะ",
    }),
  },
  {
    id: "seizure",
    localized: false,
    labels: L("抽搐", {
      en: "Seizure",
      vi: "Co giật",
      id: "Kejang",
      ja: "けいれん",
      ko: "경련",
      fil: "Kombulsyon",
      th: "ชัก",
    }),
  },
  {
    id: "nausea",
    localized: false,
    labels: L("噁心／嘔吐", {
      en: "Nausea / vomiting",
      vi: "Buồn nôn / nôn",
      id: "Mual / muntah",
      ja: "吐き気・嘔吐",
      ko: "메스꺼움/구토",
      fil: "Nasusuka / pagsusuka",
      th: "คลื่นไส้/อาเจียน",
    }),
  },
  {
    id: "other_complaint",
    localized: true,
    labels: L("其他", {
      en: "Other",
      vi: "Khác",
      id: "Lainnya",
      ja: "その他",
      ko: "기타",
      fil: "Iba pa",
      th: "อื่นๆ",
    }),
  },
];

export const BODY_REGIONS: BodyRegionOption[] = [
  {
    id: "head",
    labels: L("頭", {
      en: "Head",
      vi: "Đầu",
      id: "Kepala",
      ja: "頭",
      ko: "머리",
      fil: "Ulo",
      th: "ศีรษะ",
    }),
    subregions: [
      {
        id: "head_front",
        labels: L("臉／前額", {
          en: "Face / forehead",
          vi: "Mặt / trán",
          id: "Wajah / dahi",
          ja: "顔・額",
          ko: "얼굴/이마",
          fil: "Mukha / noo",
          th: "หน้า/หน้าผาก",
        }),
      },
      {
        id: "head_side",
        labels: L("側頭", {
          en: "Side of head",
          vi: "Bên đầu",
          id: "Samping kepala",
          ja: "側頭部",
          ko: "옆머리",
          fil: "Gilid ng ulo",
          th: "ขมับ/ข้างศีรษะ",
        }),
      },
      {
        id: "head_back",
        labels: L("後腦", {
          en: "Back of head",
          vi: "Sau đầu",
          id: "Belakang kepala",
          ja: "後頭部",
          ko: "뒷머리",
          fil: "Likod ng ulo",
          th: "ท้ายทอย",
        }),
      },
    ],
  },
  {
    id: "neck",
    labels: L("頸", {
      en: "Neck",
      vi: "Cổ",
      id: "Leher",
      ja: "首",
      ko: "목",
      fil: "Leeg",
      th: "คอ",
    }),
    subregions: [],
  },
  {
    id: "chest",
    labels: L("胸", {
      en: "Chest",
      vi: "Ngực",
      id: "Dada",
      ja: "胸",
      ko: "가슴",
      fil: "Dibdib",
      th: "อก",
    }),
    subregions: [
      {
        id: "chest_left",
        labels: L("左胸", {
          en: "Left chest",
          vi: "Ngực trái",
          id: "Dada kiri",
          ja: "左胸",
          ko: "왼쪽 가슴",
          fil: "Kaliwang dibdib",
          th: "อกซ้าย",
        }),
      },
      {
        id: "chest_center",
        labels: L("胸口正中", {
          en: "Center chest",
          vi: "Giữa ngực",
          id: "Tengah dada",
          ja: "胸の中央",
          ko: "가슴 중앙",
          fil: "Gitna ng dibdib",
          th: "กลางอก",
        }),
      },
      {
        id: "chest_right",
        labels: L("右胸", {
          en: "Right chest",
          vi: "Ngực phải",
          id: "Dada kanan",
          ja: "右胸",
          ko: "오른쪽 가슴",
          fil: "Kanang dibdib",
          th: "อกขวา",
        }),
      },
    ],
  },
  {
    id: "abdomen",
    labels: L("腹", {
      en: "Abdomen",
      vi: "Bụng",
      id: "Perut",
      ja: "お腹",
      ko: "배",
      fil: "Tiyan",
      th: "ท้อง",
    }),
    subregions: [
      {
        id: "abdomen_upper",
        labels: L("上腹", {
          en: "Upper abdomen",
          vi: "Thượng vị",
          id: "Perut atas",
          ja: "上腹部",
          ko: "상복부",
          fil: "Itaas ng tiyan",
          th: "ท้องส่วนบน",
        }),
      },
      {
        id: "abdomen_lower",
        labels: L("下腹", {
          en: "Lower abdomen",
          vi: "Hạ vị",
          id: "Perut bawah",
          ja: "下腹部",
          ko: "하복부",
          fil: "Ibaba ng tiyan",
          th: "ท้องส่วนล่าง",
        }),
      },
      {
        id: "abdomen_left",
        labels: L("左腹", {
          en: "Left abdomen",
          vi: "Bụng trái",
          id: "Perut kiri",
          ja: "左腹",
          ko: "왼쪽 배",
          fil: "Kaliwang tiyan",
          th: "ท้องซ้าย",
        }),
      },
      {
        id: "abdomen_right",
        labels: L("右腹", {
          en: "Right abdomen",
          vi: "Bụng phải",
          id: "Perut kanan",
          ja: "右腹",
          ko: "오른쪽 배",
          fil: "Kanang tiyan",
          th: "ท้องขวา",
        }),
      },
    ],
  },
  {
    id: "back",
    labels: L("背", {
      en: "Back",
      vi: "Lưng",
      id: "Punggung",
      ja: "背中",
      ko: "등",
      fil: "Likod",
      th: "หลัง",
    }),
    subregions: [
      {
        id: "back_upper",
        labels: L("上背", {
          en: "Upper back",
          vi: "Lưng trên",
          id: "Punggung atas",
          ja: "上背部",
          ko: "윗등",
          fil: "Itaas ng likod",
          th: "หลังส่วนบน",
        }),
      },
      {
        id: "back_lower",
        labels: L("下背／腰", {
          en: "Lower back",
          vi: "Lưng dưới",
          id: "Punggung bawah",
          ja: "腰・下背部",
          ko: "허리/아랫등",
          fil: "Baywang / ibabang likod",
          th: "หลังส่วนล่าง/เอว",
        }),
      },
    ],
  },
  {
    id: "left_arm",
    labels: L("左臂／左手", {
      en: "Left arm / hand",
      vi: "Tay trái",
      id: "Lengan / tangan kiri",
      ja: "左腕・左手",
      ko: "왼팔/왼손",
      fil: "Kaliwang braso / kamay",
      th: "แขน/มือซ้าย",
    }),
    subregions: [],
  },
  {
    id: "right_arm",
    labels: L("右臂／右手", {
      en: "Right arm / hand",
      vi: "Tay phải",
      id: "Lengan / tangan kanan",
      ja: "右腕・右手",
      ko: "오른팔/오른손",
      fil: "Kanang braso / kamay",
      th: "แขน/มือขวา",
    }),
    subregions: [],
  },
  {
    id: "pelvis",
    labels: L("骨盆／跨下", {
      en: "Pelvis / groin",
      vi: "Khung chậu / bẹn",
      id: "Panggul / selangkangan",
      ja: "骨盤・股",
      ko: "골반/사타구니",
      fil: "Balakang / singit",
      th: "เชิงกราน/ขาหนีบ",
    }),
    subregions: [],
  },
  {
    id: "left_leg",
    labels: L("左腿／左腳", {
      en: "Left leg / foot",
      vi: "Chân trái",
      id: "Kaki kiri",
      ja: "左脚・左足",
      ko: "왼다리/왼발",
      fil: "Kaliwang binti / paa",
      th: "ขา/เท้าซ้าย",
    }),
    subregions: [],
  },
  {
    id: "right_leg",
    labels: L("右腿／右腳", {
      en: "Right leg / foot",
      vi: "Chân phải",
      id: "Kaki kanan",
      ja: "右脚・右足",
      ko: "오른다리/오른발",
      fil: "Kanang binti / paa",
      th: "ขา/เท้าขวา",
    }),
    subregions: [],
  },
];

export function getComplaintType(id: string): ComplaintTypeOption | undefined {
  return COMPLAINT_TYPES.find((c) => c.id === id);
}

export function getBodyRegion(id: string): BodyRegionOption | undefined {
  return BODY_REGIONS.find((r) => r.id === id);
}

export function complaintTypesNeedBody(complaintTypeIds: string[]): boolean {
  if (complaintTypeIds.length === 0) return false;
  return complaintTypeIds.some((id) => getComplaintType(id)?.localized === true);
}
