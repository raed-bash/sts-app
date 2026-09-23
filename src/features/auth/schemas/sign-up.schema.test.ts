import { describe, expect, it } from "vitest";
import type { AppTFunction } from "@/i18next";
import { signUpSchema } from "./sign-up.schema";

const t = ((key: string) => key) as unknown as AppTFunction;

describe("signUpSchema", () => {
  const valid = {
    username: "basha",
    password: "12345678",
    fullName: "Basha Student",
    gender: "MALE",
    isNameViewed: true,
  };

  it("accepts valid sign-up data", () => {
    expect(signUpSchema(t).safeParse(valid).success).toBe(true);
  });

  it("trims username and full name", () => {
    const result = signUpSchema(t).parse({
      ...valid,
      username: "  basha  ",
      fullName: "  Basha Student  ",
    });

    expect(result.username).toBe("basha");
    expect(result.fullName).toBe("Basha Student");
  });

  it("rejects a short password", () => {
    const result = signUpSchema(t).safeParse({ ...valid, password: "1234" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["password"],
        message: "common:errors.passwordShort",
      });
    }
  });

  it("rejects a missing gender", () => {
    const result = signUpSchema(t).safeParse({ ...valid, gender: undefined });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["gender"],
        message: "auth:errors.genderRequired",
      });
    }
  });

  it("rejects an unknown gender", () => {
    const result = signUpSchema(t).safeParse({ ...valid, gender: "OTHER" });

    expect(result.success).toBe(false);
  });

  it("rejects a missing isNameViewed flag", () => {
    const result = signUpSchema(t).safeParse({
      ...valid,
      isNameViewed: undefined,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["isNameViewed"],
        message: "auth:errors.viewNameRequired",
      });
    }
  });
});
