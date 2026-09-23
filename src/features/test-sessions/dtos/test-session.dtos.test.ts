import { describe, expect, it } from "vitest";
import { TestSessionDto } from "./test-session.dto";
import { CreateTestSessionDto } from "./create-test-session.dto";
import { UpdateTestSessionDto } from "./update-test-session.dto";
import { StudentTestSessionDto } from "./student-test-session.dto";
import { SessionStudentResultDto } from "./session-student-result.dto";
import { ExamTestSessionDto, ExamQuestionDto } from "./exam-test-session.dto";
import {
  ResultTestSessionDto,
  ResultQuestionDto,
} from "./result-test-session.dto";
import { QueryTestSessionDto } from "./query-test-session.dto";

describe("test-session DTOs", () => {
  it("builds a TestSessionDto from the allowed fields", () => {
    const dto = new TestSessionDto({
      id: 1,
      status: "STARTED",
      startDate: new Date("2026-09-24"),
      finishDate: new Date("2026-09-24"),
      test: { id: 1, name: "Midterm", period: 60 },
      extra: "dropped",
    } as unknown as TestSessionDto);

    expect(dto).toEqual({
      id: 1,
      status: "STARTED",
      startDate: new Date("2026-09-24"),
      finishDate: new Date("2026-09-24"),
      test: { id: 1, name: "Midterm", period: 60 },
    });
  });

  it("serializes the start date on a CreateTestSessionDto", () => {
    const dto = new CreateTestSessionDto({
      startAt: "2026-09-24T08:00:00",
      period: 60,
      test: { id: 1 },
      subject: { id: 2 },
    });

    expect(dto.startDate).toBe(new Date("2026-09-24T08:00:00").toISOString());
    expect(dto.testId).toBe(1);
    expect(dto.subjectId).toBe(2);
    expect(dto.period).toBe(60);
  });

  it("uses zero for missing test and subject on a CreateTestSessionDto", () => {
    const dto = new CreateTestSessionDto({
      startAt: "2026-09-24T08:00:00",
      period: 60,
      test: null,
      subject: null,
    });

    expect(dto.testId).toBe(0);
    expect(dto.subjectId).toBe(0);
  });

  it("omits period when it is not positive", () => {
    const dto = new CreateTestSessionDto({
      startAt: "2026-09-24T08:00:00",
      period: 0,
      test: { id: 1 },
      subject: { id: 2 },
    });

    expect(dto.period).toBeUndefined();
  });

  it("serializes both dates on an UpdateTestSessionDto", () => {
    const dto = new UpdateTestSessionDto(7, {
      startAt: "2026-09-24T08:00:00",
      endAt: "2026-09-24T09:00:00",
    });

    expect(dto.id).toBe(7);
    expect(dto.startAt).toBe(new Date("2026-09-24T08:00:00").toISOString());
    expect(dto.endAt).toBe(new Date("2026-09-24T09:00:00").toISOString());
  });

  it("builds a StudentTestSessionDto from the allowed fields", () => {
    const dto = new StudentTestSessionDto({
      status: "PENDING",
      registeredAt: new Date("2026-09-24"),
      studentId: 4,
      testSessionId: 7,
      extra: "dropped",
    } as unknown as StudentTestSessionDto);

    expect(dto).toEqual({
      status: "PENDING",
      registeredAt: new Date("2026-09-24"),
      studentId: 4,
      testSessionId: 7,
    });
  });

  it("builds a SessionStudentResultDto from the allowed fields", () => {
    const dto = new SessionStudentResultDto({
      id: 1,
      username: "basha",
      fullName: "Basha Student",
      status: "FINISHED",
      points: 10,
      studentPoints: 8,
      percentage: 80,
      extra: "dropped",
    } as unknown as SessionStudentResultDto);

    expect(dto).toEqual({
      id: 1,
      username: "basha",
      fullName: "Basha Student",
      status: "FINISHED",
      points: 10,
      studentPoints: 8,
      percentage: 80,
    });
  });

  it("builds an ExamQuestionDto with its answers", () => {
    const question = new ExamQuestionDto({
      id: 1,
      text: "Q",
      type: "CHOOSE",
      points: 5,
      answers: [{ id: 1, text: "A", order: 0 }],
    });

    expect(question.answers).toEqual([{ id: 1, text: "A", order: 0 }]);
  });

  it("builds an ExamTestSessionDto keeping questions and subject", () => {
    const dto = new ExamTestSessionDto({
      id: 1,
      status: "STARTED",
      finishDate: new Date("2026-09-24"),
      test: { id: 1, name: "Midterm", period: 60 },
      subject: { id: 2, name: "Math", createdAt: new Date("2026-01-01") },
      questions: [],
    });

    expect(dto.subject.name).toBe("Math");
    expect(dto.test.id).toBe(1);
    expect(dto.questions).toEqual([]);
  });

  it("builds a ResultTestSessionDto keeping points", () => {
    const dto = new ResultTestSessionDto({
      subject: {
        id: 2,
        name: "Math",
        createdAt: new Date("2026-01-01"),
      },
      studentTestSession: {} as never,
      questions: [],
      points: 10,
      studentPoints: 8,
    });

    expect(dto.points).toBe(10);
    expect(dto.studentPoints).toBe(8);
  });

  it("builds a ResultQuestionDto with its student answers", () => {
    const dto = new ResultQuestionDto({
      id: 1,
      text: "Q",
      type: "CHOOSE",
      points: 5,
      studentAnswers: [],
      studentPoints: 5,
    });

    expect(dto.studentPoints).toBe(5);
    expect(dto.studentAnswers).toEqual([]);
  });
});

describe("QueryTestSessionDto", () => {
  it("defaults to id ordering, desc direction and non-deleted sessions", () => {
    const dto = new QueryTestSessionDto({});

    expect(dto.orderBy).toBe("id");
    expect(dto.orderDir).toBe("desc");
    expect(dto.isDeleted).toBe(false);
  });

  it("passes filters through", () => {
    const dto = new QueryTestSessionDto({ status: "STARTED", testId: 3 });

    expect(dto.status).toBe("STARTED");
    expect(dto.testId).toBe(3);
  });

  it("applies the first sort to orderBy and orderDir", () => {
    const dto = new QueryTestSessionDto({
      sorts: { startDate: "asc" } as never,
    });

    expect(dto.orderBy).toBe("startDate");
    expect(dto.orderDir).toBe("asc");
  });
});
