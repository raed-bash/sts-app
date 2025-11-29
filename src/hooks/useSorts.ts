import { useCallback, useState } from "react";
import useCashingState from "./useCashingState";

export type UseSortStatus = "ASC" | "DESC" | null;

export type UseSortOptions = {
  multi?: boolean;
  cashing?: boolean;
};

const defaultSortsDef = {};

export default function useSorts(
  name: string,
  defaultSorts = defaultSortsDef,
  { multi = false, cashing = true }: UseSortOptions = {}
) {
  const state = useState(defaultSorts);

  const cashingState = useCashingState(`${name}Sort`, defaultSorts);

  const [sorts, setSorts] = cashing ? cashingState : state;

  const handleSortChange = useCallback(
    (name: string, sortStatus: UseSortStatus) => {
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
