import { describe, expect, it } from "vitest";
import { AnswerDto } from "./answer.dto";
import { CreateAnswerDto } from "./create-answer.dto";
import { UpdateAnswerDto } from "./update-answer.dto";
import { QueryAnswerDto } from "./query-answer.dto";

const answer = {
  text: "4",
  isCorrect: true,
  order: 2,
  correctIndex: 3,
} as never;

describe("answer DTOs", () => {
  it("builds an AnswerDto from the allowed fields", () => {
    const dto = new AnswerDto({
      id: 1,
      text: "4",
      isCorrect: true,
      order: 2,
      extra: "dropped",
    } as unknown as AnswerDto);

    expect(dto).toEqual({ id: 1, text: "4", isCorrect: true, order: 2 });
  });

  it("keeps a nullable correctIndex", () => {
    const dto = new AnswerDto({
      id: 1,
      text: "4",
      correctIndex: null,
    } as unknown as AnswerDto);

    expect(dto.correctIndex).toBeNull();
  });

  it("attaches the question id on a CreateAnswerDto", () => {
    const dto = new CreateAnswerDto(answer, 9);

    expect(dto).toEqual({
      text: "4",
      isCorrect: true,
      order: 2,
      correctIndex: 3,
      questionId: 9,
    });
  });

  it("builds an UpdateAnswerDto", () => {
    expect(new UpdateAnswerDto(answer)).toEqual({
      text: "4",
      isCorrect: true,
      order: 2,
      correctIndex: 3,
    });
  });
});

describe("QueryAnswerDto", () => {
  it("defaults to id ordering, desc direction and the first page", () => {
    const dto = new QueryAnswerDto({});

    expect(dto.orderBy).toBe("id");
    expect(dto.orderDir).toBe("desc");
    expect(dto.page).toBe(1);
  });

  it("passes filters through", () => {
    const dto = new QueryAnswerDto({ text: "4", questionId: 1 });

    expect(dto.text).toBe("4");
    expect(dto.questionId).toBe(1);
  });

  it("applies the first sort to orderBy and orderDir", () => {
    const dto = new QueryAnswerDto({ sorts: { text: "asc" } as never });

    expect(dto.orderBy).toBe("text");
    expect(dto.orderDir).toBe("asc");
  });
});
