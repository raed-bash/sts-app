import { pick } from "lodash";

export class CreateAnswerDto {
  text!: string;

  isCorrect!: boolean;

  order!: number;

  correctIndex!: number;

  questionId!: number;

  constructor(
    answer: {
      text: string;
      isCorrect: boolean;
      order: number;
      correctIndex: number;
    },
    questionId: number,
  ) {
    Object.assign(
      this,
      pick(answer, ["text", "isCorrect", "order", "correctIndex"]),
    );
    this.questionId = questionId;
  }
}