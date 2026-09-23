import { describe, expect, it } from "vitest";
import type { AppTFunction } from "@/i18next";
import { testFormSchema } from "./test-form.schema";

const t = ((key: string) => key) as unknown as AppTFunction;

describe("testFormSchema", () => {
  const valid = {
    name: "Midterm",
    period: 60,
    subjects: [{ id: 1, name: "Math" }],
  };

  it("accepts valid test data", () => {
    expect(testFormSchema(t).safeParse(valid).success).toBe(true);
  });

  it("trims the name", () => {
    const result = testFormSchema(t).parse({ ...valid, name: "  Midterm  " });

    expect(result.name).toBe("Midterm");
  });

  it("coerces a numeric string period", () => {
    const result = testFormSchema(t).parse({ ...valid, period: "60" });

    expect(result.period).toBe(60);
  });

  it("rejects a blank period", () => {
    const result = testFormSchema(t).safeParse({ ...valid, period: "" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["period"],
        message: "tests:errors.periodNumber",
      });
    }
  });

  it("rejects a non-numeric period", () => {
    const result = testFormSchema(t).safeParse({ ...valid, period: "abc" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["period"],
        message: "tests:errors.periodNumber",
      });
    }
  });

  it("rejects a fractional period", () => {
    const result = testFormSchema(t).safeParse({ ...valid, period: 5.5 });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["period"],
        message: "tests:errors.periodWhole",
      });
    }
  });

  it("rejects a non-positive period", () => {
    const result = testFormSchema(t).safeParse({ ...valid, period: -1 });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["period"],
        message: "tests:errors.periodPositive",
      });
    }
  });

  it("rejects no subjects", () => {
    const result = testFormSchema(t).safeParse({ ...valid, subjects: [] });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["subjects"],
        message: "tests:errors.subjectsMin",
      });
    }
  });

  it("rejects an empty name", () => {
    const result = testFormSchema(t).safeParse({ ...valid, name: "" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["name"],
        message: "common:errors.nameRequired",
      });
    }
  });
});
