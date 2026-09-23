import { describe, expect, it } from "vitest";
import { ep } from "./endpoints";

describe("endpoints", () => {
  it("joins endpoint segments", () => {
    expect(ep("users", 1, "tests")).toBe("users/1/tests");
  });

  it("joins a single segment", () => {
    expect(ep("login")).toBe("login");
  });
});
