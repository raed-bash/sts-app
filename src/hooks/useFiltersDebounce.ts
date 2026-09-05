import { useCallback, useState } from "react";
import useCashingState from "./useCashingState";
import useDebouncedValue from "./useDebouncedValue";
import type { EventTarget } from "src/utils/EventTarget";

const defaultDebounceFiltersDefault: Record<string, any> = {};

export default function useFiltersDebounce(
  name: string,
  defaultDebounceFilters = defaultDebounceFiltersDefault,
  delay?: number,
  onChange?: (value: any) => void,
  { cashing = true } = {},
) {
  const state = useState(defaultDebounceFilters);

  const cashingState = useCashingState(
    `${name}DebounceFilters`,
    defaultDebounceFilters,
  );

  const [filtersDebounce, setFiltersDebounce] = cashing ? cashingState : state;

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
