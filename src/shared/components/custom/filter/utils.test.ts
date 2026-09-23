import { describe, expect, it } from "vitest";
import { getAvailableFilterOps, resolveFieldLabel } from "./utils";

const TEXT_OPS = [
  "contains",
  "notContains",
  "startsWith",
  "endsWith",
  "equals",
  "notEquals",
  "in",
  "notIn",
  "isNull",
  "isNotNull",
] as const;

const SELECT_OPS = ["in", "notIn", "isNull", "isNotNull"] as const;

const EQ_GT_OPS = [
  "equals",
  "notEquals",
  "gt",
  "lt",
  "gte",
  "lte",
  "isNull",
  "isNotNull",
] as const;

describe("getAvailableFilterOps", () => {
  it("returns text operations by default", () => {
    expect(getAvailableFilterOps()).toEqual(TEXT_OPS);
    expect(getAvailableFilterOps("text")).toEqual(TEXT_OPS);
  });

  it("returns select operations for select-like types", () => {
    for (const type of [
      "select",
      "nativeSelect",
      "selectApi",
      "combobox",
      "comboboxApi",
    ] as const) {
      expect(getAvailableFilterOps(type)).toEqual(SELECT_OPS);
    }
  });

  it("returns comparison operations for number and date types", () => {
    expect(getAvailableFilterOps("number")).toEqual(EQ_GT_OPS);
    expect(getAvailableFilterOps("date")).toEqual(EQ_GT_OPS);
  });

  it("returns an empty list for unknown types", () => {
    expect(getAvailableFilterOps("unknown" as never)).toEqual([]);
  });

  it("removes omitted operations from the base set", () => {
    const result = getAvailableFilterOps("text", {
      omittedOps: ["contains", "in"],
    });

    expect(result).not.toContain("contains");
    expect(result).not.toContain("in");
    expect(result).toContain("equals");
  });

  it("treats selectedOps as an exclusion list", () => {
    const result = getAvailableFilterOps("text", { selectedOps: ["equals"] });

    expect(result).not.toContain("equals");
  });

  it("returns the full base set when options are empty arrays", () => {
    expect(
      getAvailableFilterOps("text", { selectedOps: [], omittedOps: [] }),
    ).toEqual(TEXT_OPS);
  });
});

describe("resolveFieldLabel", () => {
  it("returns an empty string for an empty label", () => {
    expect(resolveFieldLabel("")).toBe("");
  });

  it("resolves an i18n key to its translation", () => {
    expect(resolveFieldLabel("common:actions.edit")).toBe("Edit");
  });

  it("returns the key unchanged when it is not a known key", () => {
    expect(resolveFieldLabel("some.raw.label")).toBe("some.raw.label");
  });
});
