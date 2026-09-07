import { useCallback, useState } from "react";
import { useCachedState } from "./useCachedState";

export type UseSortStatus = "asc" | "desc" | null;

export type UseSortOptions = {
  multi?: boolean;
  caching?: boolean;
};

const defaultSortsDefault = {};

export type DefaultSorts<T extends string> = { [P in T]?: UseSortStatus };

export function useSorts<T extends string>(
  name: string,
  defaultSorts: DefaultSorts<T> = defaultSortsDefault,
  { multi = false, caching = true }: UseSortOptions = {},
) {
  const state = useState(defaultSorts);

  const cacheState = useCachedState(`${name}Sort`, defaultSorts);

  const [sorts, setSorts] = caching ? cacheState : state;

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
