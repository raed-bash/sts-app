import { describe, expect, it } from "vitest";
import type { AppTFunction } from "@/i18next";
import { questionFormSchema } from "./question-form.schema";

const t = ((key: string) => key) as unknown as AppTFunction;

describe("questionFormSchema", () => {
  const valid = {
    text: "What is 2+2?",
    type: "CHOOSE",
    points: 5,
    tests: [{ id: 1, name: "Midterm" }],
  };

  it("accepts a valid question", () => {
    expect(questionFormSchema(t).safeParse(valid).success).toBe(true);
  });

  it("accepts a drag-drop question without complete text", () => {
    expect(
      questionFormSchema(t).safeParse({ ...valid, type: "DRAG_DROP" }).success,
    ).toBe(true);
  });

  it("accepts a complete question with an answer text", () => {
    const result = questionFormSchema(t).safeParse({
      ...valid,
      type: "COMPLETE",
      completeQuestion: "The sky is blue",
    });

    expect(result.success).toBe(true);
  });

  it("requires an answer text for COMPLETE questions", () => {
    const result = questionFormSchema(t).safeParse({
      ...valid,
      type: "COMPLETE",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["completeQuestion"],
        message: "questions:errors.completeTextRequired",
      });
    }
  });

  it("rejects a blank answer text for COMPLETE questions", () => {
    const result = questionFormSchema(t).safeParse({
      ...valid,
      type: "COMPLETE",
      completeQuestion: "   ",
    });

    expect(result.success).toBe(false);
  });

  it("trims the text", () => {
    const result = questionFormSchema(t).parse({ ...valid, text: "  Q?  " });

    expect(result.text).toBe("Q?");
  });

  it("rejects non-positive points", () => {
    const result = questionFormSchema(t).safeParse({ ...valid, points: 0 });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["points"],
        message: "questions:errors.pointsPositive",
      });
    }
  });

  it("rejects an unknown type", () => {
    const result = questionFormSchema(t).safeParse({ ...valid, type: "ESSAY" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({ path: ["type"] });
    }
  });

  it("rejects an empty text", () => {
    const result = questionFormSchema(t).safeParse({ ...valid, text: " " });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["text"],
        message: "common:errors.textRequired",
      });
    }
  });
});
