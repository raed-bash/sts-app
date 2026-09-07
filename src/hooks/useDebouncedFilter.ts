import { useCallback, useState } from "react";
import { useCachedState } from "./useCachedState";
import type { SyntheticEvent } from "@/shared/utils";
import { useDebouncedValue } from "@/shared/hooks";

const defaultDebouncedFiltersDefault: Record<string, any> = {};

export function useDebouncedFilter(
  name: string,
  defaultDebouncedFilters = defaultDebouncedFiltersDefault,
  delay?: number,
  onChange?: (value: any) => void,
  { caching = true } = {},
) {
  const state = useState(defaultDebouncedFilters);

  const cacheState = useCachedState(
    `${name}DebouncedFilters`,
    defaultDebouncedFilters,
  );

  const [filters, setFilters] = caching ? cacheState : state;

  const filterDebounced = useDebouncedValue(filters, delay, onChange);

  const handleFiltersChange = useCallback(
    (e: SyntheticEvent) => {
      const name = e.target.name;
      const value = e.target.value;

      setFilters({
        ...filters,
        [name]: value,
      });
    },
    [filters, setFilters],
  );

  return {
    filters,
    setFilters,
    handleFiltersChange,
    filterDebounced,
  };
}
