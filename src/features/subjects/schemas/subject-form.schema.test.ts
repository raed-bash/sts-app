import { describe, expect, it } from "vitest";
import type { AppTFunction } from "@/i18next";
import { subjectFormSchema } from "./subject-form.schema";

const t = ((key: string) => key) as unknown as AppTFunction;

describe("subjectFormSchema", () => {
  it("accepts a valid subject name", () => {
    expect(subjectFormSchema(t).safeParse({ name: "Math" }).success).toBe(true);
  });

  it("trims the name", () => {
    const result = subjectFormSchema(t).parse({ name: "  Math  " });

    expect(result.name).toBe("Math");
  });

  it("rejects an empty name", () => {
    const result = subjectFormSchema(t).safeParse({ name: "   " });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]).toMatchObject({
        path: ["name"],
        message: "common:errors.nameRequired",
      });
    }
  });
});
