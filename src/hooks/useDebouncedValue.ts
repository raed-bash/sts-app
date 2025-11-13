import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export default function useDebouncedValue(value, delay, onChange) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const handleDebounceValueChange = useCallback(
    (...args) => {
      if (onChange) {
        onChange(...args);
      }

      setDebouncedValue(...args);
    },
    [onChange]
  );

  const setDebouncedValueDebounce = useDebounce(
    handleDebounceValueChange,
    delay
  );

  useEffect(() => {
    if (debouncedValue === value) return;

    setDebouncedValueDebounce(value);
    // eslint-disable-next-line
  }, [value, setDebouncedValueDebounce]);

  return debouncedValue;
}
