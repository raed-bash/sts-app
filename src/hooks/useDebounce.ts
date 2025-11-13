import { useCallback, useRef } from "react";

/**
 * @param {Function} func
 * @param {number} delay
 * @returns
 */
export function useDebounce(func, delay) {
  const timerId = useRef(null);
  const debounce = useCallback(
    function (...args) {
      clearTimeout(timerId.current);
      timerId.current = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    },
    [delay, func]
  );

  if (!(typeof func === "function")) throw Error("func must be a function");
  if (!(typeof delay === "number")) throw Error("delay must be a number");

  return debounce;
}
