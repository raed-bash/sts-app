import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTimer } from "./useTimer";

describe("useTimer", () => {
  it("calls the callback on each interval", async () => {
    const callback = vi.fn();

    renderHook(() => useTimer(callback, 5));

    await vi.waitFor(() => {
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    const callsAfterFirstTick = callback.mock.calls.length;

    await vi.waitFor(() => {
      expect(callback.mock.calls.length).toBeGreaterThan(callsAfterFirstTick);
    });
  });

  it("stops calling the callback while paused", async () => {
    const callback = vi.fn();

    const { rerender } = renderHook(
      ({ pause }) => useTimer(callback, 5, pause),
      { initialProps: { pause: false } },
    );

    await vi.waitFor(() => {
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    const callsWhileRunning = callback.mock.calls.length;

    rerender({ pause: true });

    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(callback.mock.calls.length).toBe(callsWhileRunning);
  });

  it("stops the interval when the delay becomes non-positive", async () => {
    const callback = vi.fn();

    const { rerender } = renderHook(
      ({ delay }) => useTimer(callback, delay, false),
      { initialProps: { delay: 5 } },
    );

    await vi.waitFor(() => {
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    rerender({ delay: 0 });

    const callsBeforePause = callback.mock.calls.length;

    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(callback.mock.calls.length).toBe(callsBeforePause);
  });
});
