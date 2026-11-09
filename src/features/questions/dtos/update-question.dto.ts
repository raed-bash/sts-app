import type { QuestionType } from "@/constants/question-type";
import type { QuestionFormValues } from "../schemas/question-form.schema";
import { contentOf } from "./create-question.dto";

export class UpdateQuestionDto {
  text!: string;

  points!: number;

  testIds!: number[];

  type?: QuestionType;

  completeQuestion?: string;

  answers?: { text: string; isCorrect: boolean }[];

  /** `lockContent`: students already answered — send only text/points/tests. */
  constructor(values: QuestionFormValues, lockContent = false) {
    this.text = values.text.trim();
    this.points = values.points;
    this.testIds = values.tests.map((test) => test.id);

    if (!lockContent) {
      this.type = values.type;
      Object.assign(this, contentOf(values));
    }
  }
}
