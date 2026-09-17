import { pick } from "lodash";

export class AnswerDto {
  id!: number;

  text!: string;

  isCorrect?: boolean;

  order?: number;

  correctIndex?: number | null;

  constructor(answer: AnswerDto) {
    Object.assign(
      this,
      pick(answer, ["id", "text", "isCorrect", "order", "correctIndex"]),
    );
  }
}
