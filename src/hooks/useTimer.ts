import { useEffect, useRef } from "react";

export default function useTimer(execute, delay = 1000, pause = false) {
  const timeIdRef = useRef(null);
  const savedCallback = useRef(execute);

  useEffect(() => {
    if (typeof execute === "function") {
      savedCallback.current = execute;
    }
  }, [execute]);

  useEffect(() => {
    if (pause || typeof savedCallback.current !== "function" || delay <= 0) {
      return clearInterval(timeIdRef.current);
    }

    timeIdRef.current = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(timeIdRef.current);
  }, [pause, delay]);
}
