import { env } from "@/config/env";
import { useRef } from "react";

const DEBOUNCE_DELAY = env.DEBOUNCE_DELAY;

export function useDebounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number = DEBOUNCE_DELAY,
) {
  const timerId = useRef<number>(0);

  const debounce = (...args: Parameters<T>) => {
    clearTimeout(timerId.current);

    timerId.current = setTimeout(() => {
      func(...args);
    }, delay);
  };

  if (!(typeof func === "function")) throw Error("func must be a function");
  if (!(typeof delay === "number")) throw Error("delay must be a number");

  return debounce;
}
