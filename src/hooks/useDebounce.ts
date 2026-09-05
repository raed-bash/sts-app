import { useRef } from "react";

const VITE_DEBOUNCE_DELAY = import.meta.env.VITE_DEBOUNCE_DELAY;
const DEBOUNCE_DELAY = !isNaN(VITE_DEBOUNCE_DELAY)
  ? parseFloat(VITE_DEBOUNCE_DELAY)
  : 300;

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
