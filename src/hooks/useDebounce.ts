import { useRef } from "react";

export function useDebounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
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
