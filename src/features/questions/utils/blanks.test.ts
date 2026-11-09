import { describe, expect, it } from "vitest";
import { fromStored, parseBlanks, toApiTemplate } from "./blanks";

describe("parseBlanks", () => {
  it("splits text and blanks", () => {
    expect(parseBlanks("Area is [π] × [r²]")).toEqual({
      segments: ["Area is ", " × ", ""],
      blanks: ["π", "r²"],
    });
  });

  it("flags missing, empty, unbalanced and nested blanks", () => {
    expect(parseBlanks("no blanks").error).toBe("none");
    expect(parseBlanks("a [ ] b").error).toBe("empty");
    expect(parseBlanks("a [b").error).toBe("unbalanced");
    expect(parseBlanks("a b]").error).toBe("unbalanced");
    expect(parseBlanks("a [b [c]]").error).toBe("nested");
    expect(parseBlanks("a ;; b").error).toBe("reserved");
  });
});

describe("toApiTemplate / fromStored", () => {
  it("converts brackets to the API syntax", () => {
    expect(toApiTemplate("[-2] < [0]")).toBe(";;-2;; < ;;0;;");
  });

  it("round-trips a stored question", () => {
    const stored = fromStored(";;;; < ;;;;", [
      { text: "0", correctIndex: 2 },
      { text: "-2", correctIndex: 1 },
    ]);
    expect(stored).toBe("[-2] < [0]");
    expect(toApiTemplate(stored)).toBe(";;-2;; < ;;0;;");
  });
});
