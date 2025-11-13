import { useCallback, useState } from "react";
import useCashingState from "./useCashingState";

const defaultObj = {};

export default function useFilters(
  name,
  defaultFilters = defaultObj,
  onChange,
  { cashing = true } = {}
) {
  const state = useState(defaultFilters);

  const cashingState = useCashingState(`${name}Filters`, defaultFilters);

  const [filters, setFilters] = cashing ? cashingState : state;

  const handleFiltersChange = useCallback(
    (e) => {
      const name = e.target.name;
      const value = e.target.value;

      if (onChange) {
        onChange(e);
      }

      setFilters({ ...filters, [name]: value || undefined });
    },
    [filters, setFilters, onChange]
  );

  const handleResetFilter = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters, defaultFilters]);

  return { handleFiltersChange, handleResetFilter, filters, setFilters };
}
