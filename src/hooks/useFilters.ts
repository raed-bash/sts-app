import { useCallback, useState } from "react";
import useCashingState from "./useCashingState";

const defaultObj: Record<string, any> = {};

export default function useFilters(
  name: string,
  defaultFilters: Record<string, any> = defaultObj,
  onChange: ((e: any) => void) | null = null,
  { cashing = true } = {},
) {
  const state = useState(defaultFilters);

  const cashingState = useCashingState(`${name}Filters`, defaultFilters);

  const [filters, setFilters] = cashing ? cashingState : state;

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
