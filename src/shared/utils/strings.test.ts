import { describe, expect, it } from "vitest";
import { formatLabelList, ms, toCapitalize, type LabelType } from "./strings";

describe("strings utils", () => {
  describe("ms", () => {
    it("concatenates strings and numbers", () => {
      expect(ms("a", "b", 1, 0)).toBe("ab10");
    });

    it("skips falsy strings", () => {
      expect(ms("a", "", "b")).toBe("ab");
    });
  });

  describe("toCapitalize", () => {
    it("capitalizes the first letter and lowercases the rest", () => {
      expect(toCapitalize("raed")).toBe("Raed");
      expect(toCapitalize("RAED")).toBe("Raed");
    });
  });

  describe("formatLabelList", () => {
    it("formats label pairs into a comma separated list", () => {
      expect(
        formatLabelList([
          ["key1", "value1"],
          ["key2", "value2"],
        ]),
      ).toBe("key1: value1, key2: value2");
    });

    it("drops pairs without a value", () => {
      expect(
        formatLabelList([
          ["key1", ""],
          ["key2", "value2"],
        ]),
      ).toBe("key2: value2");
    });

    it("prints the value only when the label is undefined", () => {
      expect(
        formatLabelList([[undefined, "value"] as unknown as LabelType]),
      ).toBe("value");
    });
  });
});
