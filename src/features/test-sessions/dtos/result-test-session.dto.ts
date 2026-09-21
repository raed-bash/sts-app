import { pick } from "lodash";
import type { SubjectDto } from "@/features/subjects/dtos/subject.dto";
import type { QuestionType } from "@/constants/question-type";
import type { StudentTestSessionDto } from "./student-test-session.dto";

export class ResultAnswerDto {
  id!: number;

  answerIndex?: number | null;

  answeredAt!: Date;

  points!: number;

  answer?: {
    id: number;
    text: string;
    isCorrect?: boolean;
    order?: number;
    correctIndex?: number | null;
  } | null;

  constructor(resultAnswer: ResultAnswerDto) {
    Object.assign(
      this,
      pick(resultAnswer, [
        "id",
        "answerIndex",
        "answeredAt",
        "points",
        "answer",
      ]),
    );
  }
}

export class ResultQuestionDto {
  id!: number;

  text!: string;

  type!: QuestionType;

  points!: number;

  completeQuestion?: { id: number; text: string } | null;

  answers?: {
    id: number;
    text: string;
    isCorrect?: boolean;
    order?: number;
    correctIndex?: number | null;
  }[];

  studentAnswers!: ResultAnswerDto[];

  studentPoints!: number;

  constructor(resultQuestion: ResultQuestionDto) {
    Object.assign(
      this,
      pick(resultQuestion, [
        "id",
        "text",
        "type",
        "points",
        "completeQuestion",
        "answers",
        "studentAnswers",
        "studentPoints",
      ]),
    );
  }
}

export class ResultTestSessionDto {
  subject!: SubjectDto;

  studentTestSession!: StudentTestSessionDto;

  questions!: ResultQuestionDto[];

  points!: number;

  studentPoints!: number;

  constructor(resultTestSession: ResultTestSessionDto) {
    Object.assign(
      this,
      pick(resultTestSession, [
        "subject",
        "studentTestSession",
        "questions",
        "points",
        "studentPoints",
      ]),
    );
  }
}
