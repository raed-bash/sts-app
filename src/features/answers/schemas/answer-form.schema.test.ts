import { describe, expect, it } from "vitest";
import type { AppTFunction } from "@/i18next";
import { answerFormSchema } from "./answer-form.schema";

const t = ((key: string) => key) as unknown as AppTFunction;

describe("answerFormSchema", () => {
  const valid = {
    text: "4",
    isCorrect: true,
    order: 1,
    correctIndex: 0,
    question: { id: 1, text: "Q", type: "CHOOSE", points: 5, tests: [] },
  };

  it("accepts a valid answer with a question", () => {
    expect(answerFormSchema(t).safeParse(valid).success).toBe(true);
  });

  it("accepts a nullable question", () => {
    expect(
      answerFormSchema(t).safeParse({ ...valid, question: null }).success,
    ).toBe(true);
  });

  it("rejects a missing question", () => {
    const result = answerFormSchema(t).safeParse({
      text: "4",
      isCorrect: true,
      order: 1,
      correctIndex: 0,
      question: undefined,
    });

    expect(result.success).toBe(false);
  });

  it("trims the text", () => {
    const result = answerFormSchema(t).parse({ ...valid, text: "  4  " });

    expect(result.text).toBe("4");
  });

  it("rejects an empty text", () => {
    const result = answerFormSchema(t).safeParse({ ...valid, text: "" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["text"],
        message: "common:errors.textRequired",
      });
    }
  });

  it("rejects a non-boolean isCorrect", () => {
    const result = answerFormSchema(t).safeParse({
      ...valid,
      isCorrect: "yes",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({ path: ["isCorrect"] });
    }
  });

  it("rejects a non-numeric order", () => {
    const result = answerFormSchema(t).safeParse({ ...valid, order: "first" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({ path: ["order"] });
    }
  });
});
