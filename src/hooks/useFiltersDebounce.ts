import { useCallback, useState } from "react";
import useCashingState from "./useCashingState";
import useDebouncedValue from "./useDebouncedValue";
import type { EventTarget } from "src/utils/EventTarget";

const defaultDebounceFiltersDefault: Record<string, any> = {};

export default function useFiltersDebounce(
  name: string,
  defaultDebounceFilters = defaultDebounceFiltersDefault,
  delay = 1000,
  onChange?: (value: any) => void,
  { cashing = true } = {},
) {
  const state = useState(defaultDebounceFilters);

  const cashingState = useCashingState(
    `${name}DebounceFilters`,
    defaultDebounceFilters,
  );

  const [debounceFilters, setDebounceFilters] = cashing ? cashingState : state;

  const filterDebounced = useDebouncedValue(debounceFilters, delay, onChange);

  const handleDebounceFiltersChange = useCallback(
    (e: EventTarget) => {
      const name = e.target.name;
      const value = e.target.value;

      setDebounceFilters({
        ...debounceFilters,
        [name || ""]: value || undefined,
      });
    },
    [debounceFilters, setDebounceFilters],
  );

  return {
    debounceFilters,
    setDebounceFilters,
    handleDebounceFiltersChange,
    filterDebounced,
  };
}
