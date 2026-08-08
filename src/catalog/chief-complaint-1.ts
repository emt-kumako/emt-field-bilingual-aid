import { L, type BilingualText } from "./labels.js";

export type ComplaintTypeOption = {
  id: string;
  /** When true, body map / drill-down applies. */
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
    labels: L("疼痛", "Pain", "Đau", "Nyeri"),
  },
  {
    id: "breathing",
    localized: true,
    labels: L(
      "呼吸不順／喘",
      "Breathing difficulty",
      "Khó thở",
      "Sesak napas",
    ),
  },
  {
    id: "bleeding",
    localized: true,
    labels: L("出血", "Bleeding", "Chảy máu", "Pendarahan"),
  },
  {
    id: "trauma",
    localized: true,
    labels: L("外傷／撞傷", "Trauma / injury", "Chấn thương", "Cedera"),
  },
  {
    id: "weakness",
    localized: false,
    labels: L("無力／全身虛弱", "Weakness", "Yếu toàn thân", "Lemah"),
  },
  {
    id: "dizziness",
    localized: false,
    labels: L("暈眩", "Dizziness", "Chóng mặt", "Pusing"),
  },
  {
    id: "seizure",
    localized: false,
    labels: L("抽搐", "Seizure", "Co giật", "Kejang"),
  },
  {
    id: "nausea",
    localized: false,
    labels: L(
      "噁心／嘔吐",
      "Nausea / vomiting",
      "Buồn nôn / nôn",
      "Mual / muntah",
    ),
  },
  {
    id: "other_complaint",
    localized: true,
    labels: L("其他", "Other", "Khác", "Lainnya"),
  },
];

export const BODY_REGIONS: BodyRegionOption[] = [
  {
    id: "head",
    labels: L("頭", "Head", "Đầu", "Kepala"),
    subregions: [
      {
        id: "head_front",
        labels: L("臉／前額", "Face / forehead", "Mặt / trán", "Wajah / dahi"),
      },
      {
        id: "head_side",
        labels: L("側頭", "Side of head", "Bên đầu", "Samping kepala"),
      },
      {
        id: "head_back",
        labels: L("後腦", "Back of head", "Sau đầu", "Belakang kepala"),
      },
    ],
  },
  {
    id: "neck",
    labels: L("頸", "Neck", "Cổ", "Leher"),
    subregions: [],
  },
  {
    id: "chest",
    labels: L("胸", "Chest", "Ngực", "Dada"),
    subregions: [
      {
        id: "chest_left",
        labels: L("左胸", "Left chest", "Ngực trái", "Dada kiri"),
      },
      {
        id: "chest_center",
        labels: L(
          "胸口正中",
          "Center chest",
          "Giữa ngực",
          "Tengah dada",
        ),
      },
      {
        id: "chest_right",
        labels: L("右胸", "Right chest", "Ngực phải", "Dada kanan"),
      },
    ],
  },
  {
    id: "abdomen",
    labels: L("腹", "Abdomen", "Bụng", "Perut"),
    subregions: [
      {
        id: "abdomen_upper",
        labels: L("上腹", "Upper abdomen", "Thượng vị", "Perut atas"),
      },
      {
        id: "abdomen_lower",
        labels: L("下腹", "Lower abdomen", "Hạ vị", "Perut bawah"),
      },
      {
        id: "abdomen_left",
        labels: L("左腹", "Left abdomen", "Bụng trái", "Perut kiri"),
      },
      {
        id: "abdomen_right",
        labels: L("右腹", "Right abdomen", "Bụng phải", "Perut kanan"),
      },
    ],
  },
  {
    id: "back",
    labels: L("背", "Back", "Lưng", "Punggung"),
    subregions: [
      {
        id: "back_upper",
        labels: L("上背", "Upper back", "Lưng trên", "Punggung atas"),
      },
      {
        id: "back_lower",
        labels: L("下背／腰", "Lower back", "Lưng dưới", "Punggung bawah"),
      },
    ],
  },
  {
    id: "left_arm",
    labels: L(
      "左臂／左手",
      "Left arm / hand",
      "Tay trái",
      "Lengan / tangan kiri",
    ),
    subregions: [],
  },
  {
    id: "right_arm",
    labels: L(
      "右臂／右手",
      "Right arm / hand",
      "Tay phải",
      "Lengan / tangan kanan",
    ),
    subregions: [],
  },
  {
    id: "pelvis",
    labels: L(
      "骨盆／跨下",
      "Pelvis / groin",
      "Khung chậu / bẹn",
      "Panggul / selangkangan",
    ),
    subregions: [],
  },
  {
    id: "left_leg",
    labels: L(
      "左腿／左腳",
      "Left leg / foot",
      "Chân trái",
      "Kaki kiri",
    ),
    subregions: [],
  },
  {
    id: "right_leg",
    labels: L(
      "右腿／右腳",
      "Right leg / foot",
      "Chân phải",
      "Kaki kanan",
    ),
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
