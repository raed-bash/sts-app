import { pick } from "lodash";

export class UpdateAnswerDto {
  text!: string;

  isCorrect!: boolean;

  order!: number;

  correctIndex!: number;

  constructor(answer: {
    text: string;
    isCorrect: boolean;
    order: number;
    correctIndex: number;
  }) {
    Object.assign(
      this,
      pick(answer, ["text", "isCorrect", "order", "correctIndex"]),
    );
  }
}