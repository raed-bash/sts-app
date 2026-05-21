import { useEffect, useRef } from "react";

export default function useTimer(
  execute: () => void,
  delay = 1000,
  pause = false,
) {
  const timeIdRef = useRef<number | null>(null);
  const savedCallback = useRef(execute);

  useEffect(() => {
    if (typeof execute === "function") {
      savedCallback.current = execute;
    }
  }, [execute]);

  useEffect(() => {
    if (
      timeIdRef.current &&
      (pause || typeof savedCallback.current !== "function" || delay <= 0)
    ) {
      return clearInterval(timeIdRef.current);
    }

    timeIdRef.current = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => {
      if (timeIdRef.current) {
        clearInterval(timeIdRef.current);
      }
    };
  }, [pause, delay]);
}
