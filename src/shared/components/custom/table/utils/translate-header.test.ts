import { describe, expect, it } from "vitest";
import { translateHeader } from "./translate-header";

describe("translateHeader", () => {
  it("translates a known i18n key", () => {
    expect(translateHeader("common:actions.edit")).toBe("Edit");
  });

  it("passes unknown keys through unchanged", () => {
    expect(translateHeader("table.unknownHeader")).toBe("table.unknownHeader");
  });
});
