import type { QuestionType } from "@/constants/question-type";
import {
  filledChoices,
  type QuestionFormValues,
} from "../schemas/question-form.schema";
import { toApiTemplate } from "../utils/blanks";

export type QuestionContent = {
  completeQuestion?: string;
  answers?: { text: string; isCorrect: boolean }[];
};

/** Answers payload for the question's type (CHOOSE options or ;;blanks;; sentence). */
export function contentOf(values: QuestionFormValues): QuestionContent {
  return values.type === "CHOOSE"
    ? {
        answers: filledChoices(values.choices).map(({ text, isCorrect }) => ({
          text: text.trim(),
          isCorrect,
        })),
      }
    : { completeQuestion: toApiTemplate(values.sentence) };
}

export class CreateQuestionDto {
  text!: string;

  type!: QuestionType;

  points!: number;

  testIds!: number[];

  completeQuestion?: string;

  answers?: { text: string; isCorrect: boolean }[];

  constructor(values: QuestionFormValues) {
    this.text = values.text.trim();
    this.type = values.type;
    this.points = values.points;
    this.testIds = values.tests.map((test) => test.id);
    Object.assign(this, contentOf(values));
  }
}
