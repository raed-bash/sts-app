import { pick } from "lodash";
import type { QuestionType } from "@/constants/question-type";

export class CreateQuestionDto {
  text!: string;

  type!: QuestionType;

  points!: number;

  testIds!: number[];

  completeQuestion?: string;

  constructor(
    question: {
      text: string;
      type: QuestionType;
      points: number;
      completeQuestion?: string;
      tests: { id: number }[];
    },
  ) {
    Object.assign(this, pick(question, ["text", "type", "points"]));
    this.testIds = question.tests.map((test) => test.id);
    this.completeQuestion =
      question.type === "COMPLETE" ? question.completeQuestion : undefined;
  }
}