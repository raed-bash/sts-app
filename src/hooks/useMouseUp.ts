import { useEffect } from "react";

export default function useMouseUp(onMouseUp: (e: MouseEvent) => void) {
  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);

    return () => window.removeEventListener("mouseup", onMouseUp);
  }, [onMouseUp]);
}
