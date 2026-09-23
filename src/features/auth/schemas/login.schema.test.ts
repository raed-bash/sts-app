import { describe, expect, it } from "vitest";
import type { AppTFunction } from "@/i18next";
import { loginSchema } from "./login.schema";

const t = ((key: string) => key) as unknown as AppTFunction;

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema(t).safeParse({
      username: "basha",
      password: "12345678",
    });

    expect(result.success).toBe(true);
  });

  it("trims the username", () => {
    const result = loginSchema(t).parse({
      username: "  basha  ",
      password: "12345678",
    });

    expect(result.username).toBe("basha");
  });

  it("rejects an empty username", () => {
    const result = loginSchema(t).safeParse({
      username: "   ",
      password: "12345678",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["username"],
        message: "common:errors.usernameRequired",
      });
    }
  });

  it("rejects a short password", () => {
    const result = loginSchema(t).safeParse({
      username: "basha",
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
});
