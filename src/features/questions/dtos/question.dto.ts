import { pick } from "lodash";

export type QuestionType = "CHOOSE" | "DRAG_DROP" | "COMPLETE";

export class QuestionDto {
  id!: number;
  text!: string;
  type!: QuestionType;
  points!: number;
  completeQuestion?: { id: number; text: string } | null;
  answers?: {
    id: number;
    text: string;
    isCorrect: boolean;
    order: number;
    correctIndex?: number | null;
  }[];
  createdAt!: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  /** detail only */
  tests?: { id: number; name: string; period: number }[];
  /** detail only: >0 means students answered it (answers locked) */
  answeredCount?: number;

  constructor(question: QuestionDto) {
    Object.assign(
      this,
      pick(question, [
        "id",
        "text",
        "type",
        "points",
        "completeQuestion",
        "answers",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "tests",
        "answeredCount",
      ]),
    );
  }
}
