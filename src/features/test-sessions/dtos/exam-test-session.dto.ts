import { pick } from "lodash";
import type { SubjectDto } from "@/features/subjects/dtos/subject.dto";
import type { QuestionType } from "@/constants/question-type";
import type { TestSessionStatus } from "@/constants/test-session-status";

export class ExamAnswerDto {
  id!: number;

  text!: string;

  order!: number;

  constructor(examAnswer: ExamAnswerDto) {
    Object.assign(this, pick(examAnswer, ["id", "text", "order"]));
  }
}

export class ExamQuestionDto {
  id!: number;

  text!: string;

  type!: QuestionType;

  points!: number;

  completeQuestion?: { id: number; text: string } | null;

  answers!: ExamAnswerDto[];

  constructor(examQuestion: ExamQuestionDto) {
    Object.assign(
      this,
      pick(examQuestion, ["id", "text", "type", "points", "completeQuestion", "answers"]),
    );
  }
}

export class ExamTestSessionDto {
  id!: number;

  status!: TestSessionStatus;

  startedAt?: Date | null;

  finishDate!: Date;

  test!: { id: number; name: string; period: number };

  subject!: SubjectDto;

  questions!: ExamQuestionDto[];

  constructor(examTestSession: ExamTestSessionDto) {
    Object.assign(
      this,
      pick(examTestSession, [
        "id",
        "status",
        "startedAt",
        "finishDate",
        "test",
        "subject",
        "questions",
      ]),
    );
  }
}