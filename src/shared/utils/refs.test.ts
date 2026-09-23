import { describe, expect, it, vi } from "vitest";
import { mergeRefs } from "./refs";
import { JsonHelper } from "./json-helper";
import { SyntheticEvent } from "./events";

describe("refs utils", () => {
  it("calls function refs and assigns object refs", () => {
    const fnRef = vi.fn();
    const objectRef = { current: null };

    const merged = mergeRefs(fnRef, objectRef, null);

    const node = document.createElement("div");

    merged(node);

    expect(fnRef).toHaveBeenCalledWith(node);
    expect(objectRef.current).toBe(node);
  });
});

describe("JsonHelper", () => {
  it("parses valid json", () => {
    expect(JsonHelper.parse('{"a":1}')).toEqual({ a: 1 });
  });

  it("returns null for invalid json", () => {
    expect(JsonHelper.parse("{oops")).toBeNull();
  });

  it("stringifies values", () => {
    expect(JsonHelper.stringify({ a: 1 })).toBe('{"a":1}');
  });

  it("returns null when stringification fails", () => {
    const circular: Record<string, unknown> = {};

    circular.self = circular;

    expect(JsonHelper.stringify(circular)).toBeNull();
  });
});

describe("SyntheticEvent", () => {
  it("exposes a target with the name and value", () => {
    const event = new SyntheticEvent("title", "x");

    expect(event.target).toEqual({ name: "title", value: "x" });
  });

  it("carries the checked flag", () => {
    const event = new SyntheticEvent("active", true, true);

    expect(event.target.checked).toBe(true);
  });
});
