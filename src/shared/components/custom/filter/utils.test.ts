import { describe, expect, it } from "vitest";
import { getAvailableFilterOps, resolveFieldLabel } from "./utils";

describe("getAvailableFilterOps", () => {
  it("returns the text operations by default", () => {
    expect(getAvailableFilterOps()).toEqual([
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
    ]);
  });

  it("returns the select operations for select-like types", () => {
    expect(getAvailableFilterOps("select")).toEqual([
      "in",
      "notIn",
      "isNull",
      "isNotNull",
    ]);
    expect(getAvailableFilterOps("combobox")).toEqual([
      "in",
      "notIn",
      "isNull",
      "isNotNull",
    ]);
  });

  it("returns the number operations for the number type", () => {
    expect(getAvailableFilterOps("number")).toEqual([
      "equals",
      "notEquals",
      "gt",
      "lt",
      "gte",
      "lte",
      "isNull",
      "isNotNull",
    ]);
  });

  it("returns no operations for unsupported types", () => {
    expect(getAvailableFilterOps("textarea" as never)).toEqual([]);
  });

  it("excludes the operations listed as selectedOps", () => {
    expect(
      getAvailableFilterOps("text", { selectedOps: ["contains", "isNull"] }),
    ).toEqual([
      "notContains",
      "startsWith",
      "endsWith",
      "equals",
      "notEquals",
      "in",
      "notIn",
      "isNotNull",
    ]);
  });

  it("excludes the operations listed as omittedOps", () => {
    expect(
      getAvailableFilterOps("number", { omittedOps: ["gt", "lt"] }),
    ).toEqual(["equals", "notEquals", "gte", "lte", "isNull", "isNotNull"]);
  });

  it("combines selectedOps and omittedOps exclusions", () => {
    expect(
      getAvailableFilterOps("number", {
        selectedOps: ["isNull"],
        omittedOps: ["equals"],
      }),
    ).toEqual(["notEquals", "gt", "lt", "gte", "lte", "isNotNull"]);
  });
});

describe("resolveFieldLabel", () => {
  it("translates a known i18n key", () => {
    expect(resolveFieldLabel("common:table.username")).toBe("Username");
  });

  it("passes plain strings and unknown keys through unchanged", () => {
    expect(resolveFieldLabel("Age")).toBe("Age");
    expect(resolveFieldLabel("table.unknownHeader")).toBe(
      "table.unknownHeader",
    );
  });

  it("returns an empty string for an empty label", () => {
    expect(resolveFieldLabel("")).toBe("");
  });
});
