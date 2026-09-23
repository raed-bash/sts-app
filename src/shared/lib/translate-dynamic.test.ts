import { describe, expect, it, vi } from "vitest";
import { translateDynamic } from "./translate-dynamic";

describe("translateDynamic", () => {
  it("calls the translator with the key and a default fallback", () => {
    const t = vi.fn((key: string, options: { defaultValue: string }) => {
      expect(options.defaultValue).toBe(key);

      return key;
    });

    expect(translateDynamic(t, "department")).toBe("department");
    expect(t).toHaveBeenCalledWith("department", {
      defaultValue: "department",
    });
  });
});
