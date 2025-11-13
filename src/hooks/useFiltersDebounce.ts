import { useCallback, useState } from "react";
import useCashingState from "./useCashingState";
import useDebouncedValue from "./useDebouncedValue";

const defaultDebounceFiltersDef = {};

export default function useFiltersDebounce(
  name,
  defaultDebounceFilters = defaultDebounceFiltersDef,
  delay = 1000,
  onChange,
  { cashing = true } = {}
) {
  const state = useState(defaultDebounceFilters);

  const cashingState = useCashingState(
    `${name}DebounceFilters`,
    defaultDebounceFilters
  );

  const [debounceFilters, setDebounceFilters] = cashing ? cashingState : state;

  const filterDebounced = useDebouncedValue(debounceFilters, delay, onChange);

  const handleDebounceFiltersChange = useCallback(
    (e) => {
      const name = e.target.name;
      const value = e.target.value;

      setDebounceFilters({ ...debounceFilters, [name]: value || undefined });
    },
    [debounceFilters, setDebounceFilters]
  );

  return {
    debounceFilters,
    setDebounceFilters,
    handleDebounceFiltersChange,
    filterDebounced,
  };
}
