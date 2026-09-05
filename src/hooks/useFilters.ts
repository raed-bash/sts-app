import { useCallback, useState } from "react";
import { useCacheState } from "./useCacheState";

const defaultObj: Record<string, any> = {};

export function useFilters(
  name: string,
  defaultFilters: Record<string, any> = defaultObj,
  onChange: ((e: any) => void) | null = null,
  { cashing = true } = {},
) {
  const state = useState(defaultFilters);

  const cacheState = useCacheState(`${name}Filters`, defaultFilters);

  const [filters, setFilters] = cashing ? cacheState : state;

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
