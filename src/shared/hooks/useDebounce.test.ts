import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  it("only calls the function once within the delay", () => {
    vi.useFakeTimers();

    const fn = vi.fn();

    const { result } = renderHook(() => useDebounce(fn, 100));

    act(() => {
      result.current("first");
      result.current("second");
      vi.advanceTimersByTime(100);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith("second");

    vi.useRealTimers();
  });

  it("passes the latest arguments along", () => {
    vi.useFakeTimers();

    const fn = vi.fn();

    const { result } = renderHook(() => useDebounce(fn, 50));

    act(() => {
      result.current("a");
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(fn).toHaveBeenCalledWith("a");

    vi.useRealTimers();
  });

  it("throws when no function is provided", () => {
    expect(() => renderHook(() => useDebounce("nope" as never))).toThrow(
      "func must be a function",
    );
  });
});
