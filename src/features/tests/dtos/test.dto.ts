import { pick } from "lodash";
import type { QuestionDto } from "@/features/questions/dtos/question.dto";

export class TestDto {
  id!: number;
  name!: string;
  period!: number;
  createdAt!: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  questionsCount?: number;
  subjects?: { id: number; name: string }[];
  /** detail only */
  questions?: { question: QuestionDto }[];

  constructor(test: TestDto) {
    Object.assign(
      this,
      pick(test, [
        "id",
        "name",
        "period",
        "createdAt",
        "updatedAt",
        "deletedAt",
        "questionsCount",
        "subjects",
        "questions",
      ]),
    );
  }
}
