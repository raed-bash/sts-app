import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

type ChangeListener = () => void;

let changeListeners: ChangeListener[] = [];

function mockMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: () => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: (_: string, listener: ChangeListener) => {
        changeListeners.push(listener);
      },
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe("useIsMobile", () => {
  beforeEach(() => {
    changeListeners = [];
    mockMatchMedia();
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1024,
    });
  });

  it("is false on a desktop viewport", () => {
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it("turns true when the viewport shrinks below the breakpoint", () => {
    const { result } = renderHook(() => useIsMobile());

    act(() => {
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: 500,
      });

      changeListeners.forEach((listener) => listener());
    });

    expect(result.current).toBe(true);
  });
});
