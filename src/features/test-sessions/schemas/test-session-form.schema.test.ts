import { describe, expect, it } from "vitest";
import type { AppTFunction } from "@/i18next";
import {
  createTestSessionFormSchema,
  editTestSessionFormSchema,
} from "./test-session-form.schema";

const t = ((key: string) => key) as unknown as AppTFunction;

describe("createTestSessionFormSchema", () => {
  const valid = {
    startAt: "2026-09-24T08:00",
    period: 60,
    test: { id: 1, name: "Midterm", period: 60, subjects: [] },
    subject: null,
  };

  it("accepts valid session data", () => {
    expect(createTestSessionFormSchema(t).safeParse(valid).success).toBe(true);
  });

  it("accepts a null test and a null subject", () => {
    const result = createTestSessionFormSchema(t).safeParse({
      ...valid,
      test: null,
      subject: null,
    });

    expect(result.success).toBe(true);
  });

  it("rejects a missing start date", () => {
    const result = createTestSessionFormSchema(t).safeParse({
      ...valid,
      startAt: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["startAt"],
        message: "testSessions:errors.startDateRequired",
      });
    }
  });

  it("rejects a non-positive period", () => {
    const result = createTestSessionFormSchema(t).safeParse({
      ...valid,
      period: 0,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["period"],
        message: "testSessions:errors.positiveNumber",
      });
    }
  });

  it("rejects a string period", () => {
    const result = createTestSessionFormSchema(t).safeParse({
      ...valid,
      period: "60",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a missing test", () => {
    const result = createTestSessionFormSchema(t).safeParse({
      startAt: "2026-09-24T08:00",
      period: 60,
      subject: null,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({ path: ["test"] });
    }
  });

  it("rejects a missing subject", () => {
    const result = createTestSessionFormSchema(t).safeParse({
      startAt: "2026-09-24T08:00",
      period: 60,
      test: { id: 1, name: "Midterm", period: 60, subjects: [] },
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({ path: ["subject"] });
    }
  });
});

describe("editTestSessionFormSchema", () => {
  it("accepts a valid range", () => {
    expect(
      editTestSessionFormSchema(t).safeParse({
        startAt: "2026-09-24T08:00",
        endAt: "2026-09-24T09:00",
      }).success,
    ).toBe(true);
  });

  it("rejects a missing end date", () => {
    const result = editTestSessionFormSchema(t).safeParse({
      startAt: "2026-09-24T08:00",
      endAt: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["endAt"],
        message: "testSessions:errors.endDateRequired",
      });
    }
  });
});
