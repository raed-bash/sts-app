import { useCallback, useState } from "react";
import useCashingState from "./useCashingState";

export type UseSortStatus = "asc" | "desc" | null;

export type UseSortOptions = {
  multi?: boolean;
  cashing?: boolean;
};

const defaultSortsDefault = {};

export type DefaultSorts<T extends string> = { [P in T]?: UseSortStatus };

export default function useSorts<T extends string>(
  name: string,
  defaultSorts: DefaultSorts<T> = defaultSortsDefault,
  { multi = false, cashing = true }: UseSortOptions = {},
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
        } as DefaultSorts<T>);
      }
    },
    [setSorts, sorts, multi],
  );

  return { sorts, setSorts, handleSortChange };
}
