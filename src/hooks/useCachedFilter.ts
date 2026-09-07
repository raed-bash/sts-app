import { useCallback, useState } from "react";
import { useCachedState } from "./useCachedState";
import type { SyntheticEvent } from "@/shared/utils";
import { useDebouncedValue } from "@/shared/hooks";

const defaultDebounceFiltersDefault: Record<string, any> = {};

export function useFiltersDebounce(
  name: string,
  defaultDebounceFilters = defaultDebounceFiltersDefault,
  delay?: number,
  onChange?: (value: any) => void,
  { caching = true } = {},
) {
  const state = useState(defaultDebounceFilters);

  const cacheState = useCachedState(
    `${name}DebounceFilters`,
    defaultDebounceFilters,
  );

  const [filtersDebounce, setFiltersDebounce] = caching ? cacheState : state;

  const filterDebounced = useDebouncedValue(filtersDebounce, delay, onChange);

  const handleFiltersDebounceChange = useCallback(
    (e: SyntheticEvent) => {
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
