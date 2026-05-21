import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";

export default function useDebouncedValue<T>(
  value: T,
  delay: number,
  onChange?: (value: T) => void
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const handleDebounceValueChange = (value: T) => {
    if (onChange) {
      onChange(value);
    }

    setDebouncedValue(value);
  };

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
