import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMouseUp } from "./useMouseUp";

describe("useMouseUp", () => {
  it("listens for mouseup events on the window", () => {
    const onMouseUp = vi.fn();

    renderHook(() => useMouseUp(onMouseUp));

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onMouseUp).toHaveBeenCalledTimes(1);
  });

  it("stops listening after unmount", () => {
    const onMouseUp = vi.fn();

    const { unmount } = renderHook(() => useMouseUp(onMouseUp));

    unmount();

    window.dispatchEvent(new MouseEvent("mouseup"));

    expect(onMouseUp).not.toHaveBeenCalled();
  });
});
