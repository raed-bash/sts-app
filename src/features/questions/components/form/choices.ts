import type { TestDto } from "@/features/tests/dtos/test.dto";
import type { QuestionFormValues } from "../../schemas/question-form.schema";

export type Choice = { key: string; text: string; isCorrect: boolean };

let nextKey = 0;
export const newChoice = (text = "", isCorrect = false): Choice => ({
  key: `c${nextKey++}`,
  text,
  isCorrect,
});

export const emptyQuestionValues = (
  tests: TestDto[] = [],
): QuestionFormValues => ({
  text: "",
  type: "CHOOSE",
  points: 1,
  tests,
  sentence: "",
  choices: [newChoice("", true), newChoice(), newChoice()],
});
