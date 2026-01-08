export type ExamType = "BECE" | "WASSCE";
export type QuestionType = "mcq" | "essay";
export type SessionType = "mcq" | "essay" | "mixed";
export type Difficulty = "easy" | "medium" | "hard";

export const SUBJECTS: Record<ExamType, string[]> = {
  BECE: [
    "Mathematics",
    "English",
    "Science",
    "Social Studies",
    "ICT",
    "French",
    "Religious and Moral Education",
    "Ghanaian Language",
    "Creative Arts",
  ],
  WASSCE: [
    "Mathematics",
    "English",
    "Integrated Science",
    "Social Studies",
    "Biology",
    "Economics",
    "Physics",
    "Chemistry",
    "Literature",
    "Government",
    "Geography",
    "History",
    "Accounting",
    "Business Management",
    "ICT",
  ],
};
