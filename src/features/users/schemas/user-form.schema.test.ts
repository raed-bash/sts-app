import { describe, expect, it } from "vitest";
import type { AppTFunction } from "@/i18next";
import {
  changePasswordSchema,
  createUserFormSchema,
  editUserFormSchema,
} from "./user-form.schema";

const t = ((key: string) => key) as unknown as AppTFunction;

describe("createUserFormSchema", () => {
  const valid = {
    username: "basha",
    password: "12345678",
    role: "STUDENT",
    status: "ACTIVE",
  };

  it("accepts valid user data", () => {
    expect(createUserFormSchema(t).safeParse(valid).success).toBe(true);
  });

  it("trims username and password", () => {
    const result = createUserFormSchema(t).parse({
      ...valid,
      username: "  basha  ",
      password: "  12345678  ",
    });

    expect(result.username).toBe("basha");
    expect(result.password).toBe("12345678");
  });

  it("rejects a short password", () => {
    const result = createUserFormSchema(t).safeParse({
      ...valid,
      password: "1234567",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["password"],
        message: "common:errors.passwordShort",
      });
    }
  });

  it("rejects an invalid role", () => {
    const result = createUserFormSchema(t).safeParse({
      ...valid,
      role: "ADMIN",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({ path: ["role"] });
    }
  });

  it("rejects an invalid status", () => {
    const result = createUserFormSchema(t).safeParse({
      ...valid,
      status: "DELETED",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({ path: ["status"] });
    }
  });
});

describe("editUserFormSchema", () => {
  const valid = {
    username: "basha",
    role: "TEACHER",
    status: "PENDING",
  };

  it("accepts valid user data without a password", () => {
    expect(editUserFormSchema(t).safeParse(valid).success).toBe(true);
  });

  it("rejects a password field", () => {
    const result = editUserFormSchema(t).safeParse({ ...valid, password: "x" });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid role", () => {
    const result = editUserFormSchema(t).safeParse({ ...valid, role: "GUEST" });

    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("accepts a valid password", () => {
    expect(
      changePasswordSchema(t).safeParse({ password: "12345678" }).success,
    ).toBe(true);
  });

  it("rejects a short password", () => {
    const result = changePasswordSchema(t).safeParse({ password: "1234567" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({ path: ["password"] });
    }
  });

  it("rejects a whitespace-only password", () => {
    const result = changePasswordSchema(t).safeParse({ password: "        " });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.message === "common:errors.passwordShort",
        ),
      ).toBe(true);
    }
  });
});
