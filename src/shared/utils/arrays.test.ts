import { describe, expect, it } from "vitest";
import { isBeforeLastIndex, isLastIndex, wrapInArrayIf } from "./arrays";

describe("arrays utils", () => {
  describe("isLastIndex", () => {
    it("detects the last index", () => {
      expect(isLastIndex(4, 5)).toBe(true);
      expect(isLastIndex(3, 5)).toBe(false);
    });
  });

  describe("isBeforeLastIndex", () => {
    it("detects the index before the last", () => {
      expect(isBeforeLastIndex(3, 5)).toBe(true);
      expect(isBeforeLastIndex(4, 5)).toBe(false);
    });
  });

  describe("wrapInArrayIf", () => {
    it("wraps the object when the condition is true", () => {
      const result = wrapInArrayIf(true, { id: 1 });

      expect(result).toEqual([{ id: 1 }]);
    });

    it("returns an empty array when the condition is false", () => {
      const result = wrapInArrayIf(false, { id: 1 });

      expect(result).toEqual([]);
    });
  });
});
