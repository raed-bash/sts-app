import { describe, expect, it } from "vitest";
import { QuestionDto } from "./question.dto";
import { CreateQuestionDto } from "./create-question.dto";
import { UpdateQuestionDto } from "./update-question.dto";
import { QueryQuestionDto } from "./query-question.dto";

const question = {
  text: "What is 2+2?",
  type: "CHOOSE",
  points: 5,
  tests: [{ id: 1 }, { id: 2 }],
} as never;

describe("question DTOs", () => {
  it("builds a QuestionDto from the allowed fields", () => {
    const dto = new QuestionDto({
      id: 1,
      text: "Q",
      type: "CHOOSE",
      points: 5,
      createdAt: new Date("2026-01-01"),
      extra: "dropped",
    } as unknown as QuestionDto);

    expect(dto).toEqual({
      id: 1,
      text: "Q",
      type: "CHOOSE",
      points: 5,
      createdAt: new Date("2026-01-01"),
    });
  });

  it("maps test ids on a CreateQuestionDto", () => {
    const dto = new CreateQuestionDto(question);

    expect(dto.testIds).toEqual([1, 2]);
    expect(dto.text).toBe("What is 2+2?");
    expect(dto.type).toBe("CHOOSE");
    expect(dto.points).toBe(5);
  });

  it("omits completeQuestion for non-COMPLETE question types", () => {
    const dto = new CreateQuestionDto(question);

    expect(dto.completeQuestion).toBeUndefined();
  });

  it("keeps completeQuestion for COMPLETE question types", () => {
    const dto = new CreateQuestionDto({
      text: "Fill the blank",
      type: "COMPLETE",
      points: 10,
      completeQuestion: "The sky is ___",
      tests: [{ id: 1 }],
    });

    expect(dto.completeQuestion).toBe("The sky is ___");
  });

  it("maps test ids on an UpdateQuestionDto", () => {
    const dto = new UpdateQuestionDto(question);

    expect(dto.testIds).toEqual([1, 2]);
  });
});

describe("QueryQuestionDto", () => {
  it("defaults to id ordering, desc direction and deleted-only filter", () => {
    const dto = new QueryQuestionDto({});

    expect(dto.orderBy).toBe("id");
    expect(dto.orderDir).toBe("desc");
    expect(dto.isDeleted).toBe(true);
  });

  it("passes filters through", () => {
    const dto = new QueryQuestionDto({ type: "CHOOSE", testIds: [1] });

    expect(dto.type).toBe("CHOOSE");
    expect(dto.testIds).toEqual([1]);
  });

  it("applies the first sort to orderBy and orderDir", () => {
    const dto = new QueryQuestionDto({ sorts: { text: "asc" } as never });

    expect(dto.orderBy).toBe("text");
    expect(dto.orderDir).toBe("asc");
  });
});
