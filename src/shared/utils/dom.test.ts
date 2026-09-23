import { afterEach, describe, expect, it } from "vitest";
import { boundPosition, clampToViewport } from "./dom";

afterEach(() => {
  Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });
  Object.defineProperty(window, "innerHeight", { value: 768, writable: true });
});

describe("dom utils", () => {
  describe("clampToViewport", () => {
    it("clamps an overflowing element to the right edge", () => {
      const element = {
        offsetLeft: 0,
        offsetTop: 10,
        getBoundingClientRect: () =>
          ({
            left: 900,
            right: 1100,
            top: 10,
            bottom: 40,
            width: 200,
            height: 30,
          }) as DOMRect,
      } as HTMLElement;

      Object.defineProperty(window, "innerWidth", { value: 1000 });

      expect(clampToViewport(element)).toEqual({ left: 800, top: 10 });
    });

    it("clamps a negative offset to the viewport origin", () => {
      const element = {
        offsetLeft: 0,
        offsetTop: 0,
        getBoundingClientRect: () =>
          ({
            left: -50,
            right: 150,
            top: -20,
            bottom: 10,
            width: 200,
            height: 30,
          }) as DOMRect,
      } as HTMLElement;

      expect(clampToViewport(element)).toEqual({ left: 0, top: 0 });
    });

    it("keeps in-view elements where they are", () => {
      const element = {
        offsetLeft: 42,
        offsetTop: 24,
        getBoundingClientRect: () =>
          ({
            left: 42,
            right: 142,
            top: 24,
            bottom: 44,
            width: 100,
            height: 20,
          }) as DOMRect,
      } as HTMLElement;

      expect(clampToViewport(element)).toEqual({ left: 42, top: 24 });
    });
  });

  describe("boundPosition", () => {
    const element = { clientWidth: 10, clientHeight: 20 } as HTMLElement;
    const windowSize = { width: 100, height: 100 };

    it("keeps positions inside the window", () => {
      expect(boundPosition({ x: 50, y: 50 }, element, windowSize)).toEqual({
        x: 50,
        y: 50,
      });
    });

    it("clamps positions to the window bounds", () => {
      expect(boundPosition({ x: 200, y: 200 }, element, windowSize)).toEqual({
        x: 90,
        y: 80,
      });
      expect(boundPosition({ x: -10, y: -10 }, element, windowSize)).toEqual({
        x: 0,
        y: 0,
      });
    });
  });
});
