import * as React from "react";
import { useDrag } from "./useDrag";
import { useResizeObserver } from "./useResizeObserver";
import { clampToViewport, mergeRefs } from "../utils";
import useDebouncedValue from "@/hooks/useDebouncedValue";

export function useMoveablePopover() {
  const [isReleased, setIsReleased] = React.useState(false);

  const [isGrabbing, setIsGrabbing] = React.useState(false);

  const move = useDrag({
    onMouseDown() {
      setIsGrabbing(true);

      setIsReleased(true);
    },
    onMouseUp() {
      setIsGrabbing(false);
    },
  });

  const observer = useResizeObserver({
    onResize: (entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLDivElement;

        const { left, top } = clampToViewport(el);

        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
      });
    },
  });

  const resetReleaseOnClose = (isOpen: boolean) => {
    if (!isOpen) setIsReleased(false);
  };

  const ref = mergeRefs(move.ref, observer.ref);

  const isReleasedDebounce = useDebouncedValue(isReleased, 100);

  return {
    ref,
    isGrabbing,
    // delay isRelease on close by 100ms
    isReleased: isReleased || isReleasedDebounce,
    onPopoverOpenChange: resetReleaseOnClose,
    onGrab: move.onMouseDown,
  };
}
