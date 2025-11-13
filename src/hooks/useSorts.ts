import { useCallback, useState } from "react";
import useCashingState from "./useCashingState";

const defaultSortsDef = {};

export default function useSorts(
  name,
  defaultSorts = defaultSortsDef,
  { multi = false, cashing = true } = {}
) {
  const state = useState(defaultSorts);

  const cashingState = useCashingState(`${name}Sort`, defaultSorts);

  const [sorts, setSorts] = cashing ? cashingState : state;

  const handleSortChange = useCallback(
    (name, sortStatus) => {
      if (multi) {
        setSorts({
          ...sorts,
          [name]: sortStatus,
        });
      } else {
        setSorts({
          [name]: sortStatus,
        });
      }
    },
    [setSorts, sorts, multi]
  );

  return { sorts, setSorts, handleSortChange };
}
