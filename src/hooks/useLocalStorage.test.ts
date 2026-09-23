import { describe, expect, it, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns the stored value when present", () => {
    localStorage.setItem("theme", "dark");

    const { result } = renderHook(() => useLocalStorage("theme", "light"));

    expect(result.current[0]).toBe("dark");
  });

  it("stores the default value when nothing is stored", () => {
    renderHook(() => useLocalStorage("theme", "light"));

    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("persists and returns updates", () => {
    const { result } = renderHook(() => useLocalStorage("theme", "light"));

    act(() => {
      result.current[1]("dark");
    });

    expect(result.current[0]).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("uses the serializers provided in options", () => {
    localStorage.setItem("theme", '{"mode":"light"}');

    const { result } = renderHook(() =>
      useLocalStorage(
        "theme",
        { mode: "light" },
        {
          onStore: (value) => JSON.stringify(value),
          onGet: (value) => JSON.parse(value),
        },
      ),
    );

    act(() => {
      result.current[1]({ mode: "dark" });
    });

    expect(localStorage.getItem("theme")).toBe('{"mode":"dark"}');
    expect(result.current[0]).toEqual({ mode: "dark" });
  });
});
