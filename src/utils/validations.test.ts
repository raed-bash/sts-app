import { describe, expect, it } from "vitest";
import { isValidFileType } from "./validations";

describe("isValidFileType", () => {
  it("throws for types without a registered extension list", () => {
    expect(() => isValidFileType("avatar.png", "images")).toThrow();
  });
});
