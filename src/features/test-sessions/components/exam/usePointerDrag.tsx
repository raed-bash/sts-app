import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";

type Pending<T> = {
  item: T;
  label: string;
  startX: number;
  startY: number;
  started: boolean;
};

export type DragState<T> = {
  item: T;
  label: string;
  x: number;
  y: number;
  /** `data-drop` value of the target under the pointer */
  over: string | null;
};

const THRESHOLD = 6; // px before a press becomes a drag, so taps stay clicks
const EDGE = 80; // px from the viewport edge that auto-scrolls

const targetAt = (x: number, y: number) =>
  (
    document
      .elementFromPoint(x, y)
      ?.closest("[data-drop]") as HTMLElement | null
  )?.dataset.drop ?? null;

/**
 * Drag & drop on pointer events: one code path for mouse, touch and pen
 * (native HTML5 drag does not work on touch screens). Drop targets are any
 * element with a `data-drop` attribute.
 */
export function usePointerDrag<T>(
  onDrop: (item: T, target: string | null) => void,
) {
  const [drag, setDrag] = useState<DragState<T> | null>(null);
  const pending = useRef<Pending<T> | null>(null);
  const suppressClick = useRef(false);
  const onDropRef = useRef(onDrop);

  useEffect(() => {
    onDropRef.current = onDrop;
  }, [onDrop]);

  useEffect(() => {
    const move = (e: globalThis.PointerEvent) => {
      const p = pending.current;
      if (!p) return;

      if (!p.started) {
        if (Math.hypot(e.clientX - p.startX, e.clientY - p.startY) < THRESHOLD)
          return;
        p.started = true;
      }

      if (e.clientY < EDGE) window.scrollBy(0, -12);
      else if (e.clientY > window.innerHeight - EDGE) window.scrollBy(0, 12);

      setDrag({
        item: p.item,
        label: p.label,
        x: e.clientX,
        y: e.clientY,
        over: targetAt(e.clientX, e.clientY),
      });
    };

    const end = (e: globalThis.PointerEvent, drop: boolean) => {
      const p = pending.current;
      pending.current = null;
      if (!p?.started) return;

      // the click that follows pointerup must not also act as a tap
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);

      setDrag(null);
      if (drop) onDropRef.current(p.item, targetAt(e.clientX, e.clientY));
    };

    const up = (e: globalThis.PointerEvent) => end(e, true);
    const cancel = (e: globalThis.PointerEvent) => end(e, false);
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && pending.current?.started) {
        pending.current = null;
        setDrag(null);
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", escape);
    };
  }, []);

  /** Props for a draggable element. */
  const draggable = (item: T, label: string) => ({
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      pending.current = {
        item,
        label,
        startX: e.clientX,
        startY: e.clientY,
        started: false,
      };
    },
    onClickCapture: (e: React.MouseEvent) => {
      if (suppressClick.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    // keep the page from scrolling while a finger drags the chip
    style: { touchAction: "none" as const },
  });

  const ghost =
    drag &&
    createPortal(
      <div
        aria-hidden
        className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-primary bg-card px-3 py-1.5 text-sm font-medium shadow-xl ring-2 ring-primary/30"
        style={{ left: drag.x, top: drag.y }}
      >
        {drag.label}
      </div>,
      document.body,
    );

  return { drag, draggable, ghost };
}
