import { L, type BilingualText } from "./labels.js";

export const UI_COPY = {
  cc1Title: L(
    "哪裡／怎麼了？",
    "Where / what is wrong?",
    "Đau ở đâu / chuyện gì?",
    "Di mana / ada apa?",
  ),
  cc1What: L("怎麼了", "What is wrong?", "Chuyện gì?", "Ada apa?"),
  cc1Where: L("哪裡", "Where?", "Ở đâu?", "Di mana?"),
  cc1WhereOptional: L(
    "（此主訴類型可不選部位）",
    "(Body map optional for this complaint)",
    "(Loại này có thể bỏ qua vị trí)",
    "(Peta tubuh opsional untuk keluhan ini)",
  ),
  cc2Title: L(
    "怎麼不舒服／多久了？",
    "How does it feel / how long?",
    "Cảm giác thế nào / bao lâu?",
    "Rasanya bagaimana / sudah berapa lama?",
  ),
  cc2Quality: L("性質", "Quality", "Tính chất", "Sifat keluhan"),
  cc2Duration: L("多久了 · 時長", "How long · Duration", "Bao lâu", "Durasi"),
  cc2Period: L("或時段", "Or period", "Hoặc khoảng thời gian", "Atau periode"),
  cc2Pain: L(
    "疼痛指數 · Pain 1–10",
    "Pain score 1–10",
    "Mức đau 1–10",
    "Skala nyeri 1–10",
  ),
  senseTitle: L(
    "還有其他不舒服嗎？",
    "Any other discomfort?",
    "Còn khó chịu nào khác?",
    "Ada keluhan lain?",
  ),
  senseLead: L(
    "一輪二次掃描",
    "One extra pass",
    "Chỉ hỏi thêm một lần",
    "Satu kali pemeriksaan tambahan",
  ),
  senseSymptoms: L(
    "伴隨症狀",
    "Accompanying",
    "Triệu chứng kèm theo",
    "Gejala penyerta",
  ),
  senseBody: L(
    "可再指部位",
    "Optional body scan",
    "Có thể chỉ thêm vị trí",
    "Boleh tunjuk bagian tubuh lagi",
  ),
} as const satisfies Record<string, BilingualText>;
