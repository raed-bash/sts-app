import * as React from "react";
import { boundPosition } from "../utils";

export type UseDragOptions<T extends HTMLElement> = {
  onMouseDown?: (e: React.MouseEvent<T>, element: T) => void;
  onMouseMove?: (e: MouseEvent, element: T) => void;
  onMouseUp?: (e: MouseEvent, element: T) => void;
};
export function useDrag<T extends HTMLElement>({
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: UseDragOptions<T>) {
  const dragRef = React.useRef({ isMouseDown: false, offsetX: 0, offsetY: 0 });
  const elRef = React.useRef<T>(null);

  const ref = (node: T | null) => {
    elRef.current = node;
  };

  const moveElement = React.useEffectEvent((x: number, y: number) => {
    const element = elRef.current;

    if (element) {
      const { x: boundedX, y: boundedY } = boundPosition({ x, y }, element, {
        width: window.innerWidth,
        height: window.innerHeight,
      });

      element.style.position = "fixed";
      element.style.top = `${boundedY}px`;
      element.style.left = `${boundedX}px`;
    }
  });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isMouseDown || !elRef.current) return;

      const x = e.clientX - dragRef.current.offsetX;
      const y = e.clientY - dragRef.current.offsetY;

      onMouseMove?.(e, elRef.current);

      moveElement(x, y);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (dragRef.current.isMouseDown) {
        dragRef.current.isMouseDown = false;
      }

      if (!elRef.current) return;

      onMouseUp?.(e, elRef.current);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onMouseMove, onMouseUp, elRef]);

  const handleMouseDown = (e: React.MouseEvent<T>) => {
    const element = elRef.current;
    if (!element) return;

    onMouseDown?.(e, element);

    const rect = element.getBoundingClientRect();

    dragRef.current = {
      isMouseDown: true,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };

    moveElement(
      e.clientX - dragRef.current.offsetX,
      e.clientY - dragRef.current.offsetY,
    );
  };

  return {
    onMouseDown: handleMouseDown,
    ref,
  };
}
