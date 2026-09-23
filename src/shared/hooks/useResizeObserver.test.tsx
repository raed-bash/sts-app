import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { useResizeObserver } from "./useResizeObserver";

class SpyObserver {
  static instance: SpyObserver | null = null;

  observed: Element[] = [];

  constructor(public callback: ResizeObserverCallback) {
    SpyObserver.instance = this;
  }

  observe(element: Element) {
    this.observed.push(element);
  }

  unobserve() {}

  disconnect() {}
}

(globalThis as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
  SpyObserver as unknown as typeof ResizeObserver;

function Box({ onResize }: { onResize: ResizeObserverCallback }) {
  const { ref } = useResizeObserver({ onResize });

  return <div ref={ref} data-testid="box" />;
}

describe("useResizeObserver", () => {
  it("observes the attached element", () => {
    const { getByTestId } = render(<Box onResize={vi.fn()} />);

    expect(SpyObserver.instance?.observed).toEqual([getByTestId("box")]);
  });

  it("forwards resize entries to the callback", () => {
    const onResize = vi.fn();

    render(<Box onResize={onResize} />);

    const entries = [
      { target: document.body },
    ] as unknown as ResizeObserverEntry[];
    SpyObserver.instance?.callback(
      entries,
      SpyObserver.instance as unknown as ResizeObserver,
    );

    expect(onResize).toHaveBeenCalledWith(entries, expect.anything());
  });
});
