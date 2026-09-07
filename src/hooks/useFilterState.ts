import { useCallback, useState } from "react";
import { useCachedState } from "./useCachedState";

const defaultObj: Record<string, any> = {};

export function useFilterState(
  name: string,
  defaultFilters: Record<string, any> = defaultObj,
  onChange: ((e: any) => void) | null = null,
  { caching = true } = {},
) {
  const state = useState(defaultFilters);

  const cacheState = useCachedState(`${name}Filters`, defaultFilters);

  const [filters, setFilters] = caching ? cacheState : state;

  const handleFiltersChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name;
      const value = e.target.value;

      if (onChange) {
        onChange(e);
      }

      setFilters({ ...filters, [name]: value || undefined });
    },
    [filters, setFilters, onChange],
  );

  const handleResetFilter = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters, defaultFilters]);

  return { handleFiltersChange, handleResetFilter, filters, setFilters };
}
