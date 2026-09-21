export type QuestionType = "CHOOSE" | "DRAG_DROP" | "COMPLETE";

export const QUESTION_TYPE_TITLES = {
  CHOOSE: "common:questionTypes.choose",
  DRAG_DROP: "common:questionTypes.dragDrop",
  COMPLETE: "common:questionTypes.complete",
} as const satisfies Record<QuestionType, string>;
