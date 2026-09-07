import * as React from "react";

export type UseResizeObserverOptions = {
  onResize: ResizeObserverCallback;
};

export function useResizeObserver({ onResize }: UseResizeObserverOptions) {
  const observerRef = React.useRef<ResizeObserver | null>(null);
  const elRef = React.useRef<HTMLElement>(null);

  const ref = (node: HTMLElement | null) => {
    if (observerRef.current && elRef.current) {
      observerRef.current.unobserve(elRef.current);
    }

    elRef.current = node;

    if (!node) return;

    if (!observerRef.current) {
      observerRef.current = new ResizeObserver(onResize);
    }

    const targetElement = node;
    observerRef.current.observe(targetElement);
  };

  React.useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { ref };
}
