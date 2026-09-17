export type QuestionType = "CHOOSE" | "DRAG_DROP" | "COMPLETE";

export const QUESTION_TYPE_TITLES: Record<QuestionType, string> = {
  CHOOSE: "Choose",
  DRAG_DROP: "Drag & Drop",
  COMPLETE: "Complete",
};
