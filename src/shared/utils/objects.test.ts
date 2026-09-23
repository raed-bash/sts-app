import { describe, expect, it } from "vitest";
import {
  getChangedFields,
  getObjectValue,
  removeEmptyNull,
  reverseObject,
  switchObjectKeys,
} from "./objects";

describe("objects utils", () => {
  describe("reverseObject", () => {
    it("swaps string keys and values", () => {
      expect(reverseObject({ a: "1", b: "2" })).toEqual({ 1: "a", 2: "b" });
    });

    it("swaps non-string values via their __name__", () => {
      const role = { __name__: "admin" };

      expect(reverseObject({ a: role as unknown as string })).toEqual({
        admin: "a",
      });
    });
  });

  describe("switchObjectKeys", () => {
    it("renames keys through the mapping object", () => {
      expect(switchObjectKeys({ a: 1 }, { a: "b" })).toEqual({ b: 1 });
    });
  });

  describe("getChangedFields", () => {
    it("returns only the fields that differ", () => {
      const original = { a: 1, b: 2 };
      const updated = { a: 1, b: 5 };

      expect(getChangedFields(original, updated)).toEqual({ b: 5 });
    });
  });

  describe("getObjectValue", () => {
    it("returns the value for a dot path", () => {
      expect(getObjectValue({ a: { b: "x" } }, "a.b")).toBe("x");
    });

    it("returns the value for an array path", () => {
      expect(getObjectValue({ a: { b: "x" } }, ["a", "b"])).toBe("x");
    });

    it("returns the raw value when the path is empty", () => {
      expect(getObjectValue("raw", "")).toBe("raw");
    });

    it("handles undefined input", () => {
      expect(getObjectValue(undefined, "a.b")).toBeUndefined();
    });
  });

  describe("removeEmptyNull", () => {
    it("keeps truthy primitives", () => {
      expect(removeEmptyNull("x")).toBe("x");
      expect(removeEmptyNull(0)).toBe(0);
    });

    it("removes empty and null values", () => {
      expect(removeEmptyNull("")).toBeUndefined();
      expect(removeEmptyNull(null)).toBeUndefined();
    });

    it("recursively strips empties from objects", () => {
      expect(removeEmptyNull({ a: "x", b: "", c: null })).toEqual({ a: "x" });
    });

    it("filters empty entries from arrays", () => {
      expect(removeEmptyNull([1, "", null])).toEqual([1]);
    });

    it("returns undefined for empty arrays", () => {
      expect(removeEmptyNull([])).toBeUndefined();
    });
  });
});
