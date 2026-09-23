import { describe, expect, it } from "vitest";
import { TABLE_DENSITIES, getTableDensityPadding } from "./table-density";

describe("table-density", () => {
  it("defines the three densities in display order", () => {
    expect(TABLE_DENSITIES.map((option) => option.value)).toEqual([
      "compact",
      "comfortable",
      "roomy",
    ]);
  });

  it("maps each density to its padding", () => {
    expect(getTableDensityPadding("compact")).toBe("py-1 px-2");
    expect(getTableDensityPadding("comfortable")).toBe("py-3 px-4");
    expect(getTableDensityPadding("roomy")).toBe("py-5 px-5");
  });

  it("falls back to the comfortable padding for unknown densities", () => {
    expect(getTableDensityPadding("unknown" as never)).toBe("py-3 px-4");
  });
});
