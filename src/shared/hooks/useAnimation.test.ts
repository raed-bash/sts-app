import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAnimation } from "./useAnimation";

describe("useAnimation", () => {
  it("keeps the element mounted during the closing animation", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ isOpen }) => useAnimation({ isOpen }),
      { initialProps: { isOpen: false } },
    );

    expect(result.current.show).toBe(false);
    expect(result.current.showAnimation).toBe(false);

    rerender({ isOpen: true });

    expect(result.current.show).toBe(true);
    expect(result.current.showAnimation).toBe(true);

    rerender({ isOpen: false });

    expect(result.current.show).toBe(true);
    expect(result.current.showAnimation).toBe(false);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.show).toBe(false);

    vi.useRealTimers();
  });
});
