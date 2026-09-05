import { useCallback, useState } from "react";
import { useCacheState } from "./useCacheState";
import { useDebouncedValue } from "./useDebouncedValue";
import type { EventTarget } from "@/utils";

const defaultDebounceFiltersDefault: Record<string, any> = {};

export function useFiltersDebounce(
  name: string,
  defaultDebounceFilters = defaultDebounceFiltersDefault,
  delay?: number,
  onChange?: (value: any) => void,
  { cashing = true } = {},
) {
  const state = useState(defaultDebounceFilters);

  const cacheState = useCacheState(
    `${name}DebounceFilters`,
    defaultDebounceFilters,
  );

  const [filtersDebounce, setFiltersDebounce] = cashing ? cacheState : state;

  const filterDebounced = useDebouncedValue(filtersDebounce, delay, onChange);

  const handleFiltersDebounceChange = useCallback(
    (e: EventTarget) => {
      const name = e.target.name;
      const value = e.target.value;

      setFiltersDebounce({
        ...filtersDebounce,
        [name ?? ""]: value,
      });
    },
    [filtersDebounce, setFiltersDebounce],
  );

  return {
    filtersDebounce,
    setFiltersDebounce,
    handleFiltersDebounceChange,
    filterDebounced,
  };
}
