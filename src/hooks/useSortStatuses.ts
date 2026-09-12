import { useCallback, useState } from "react";
import type { SortButtonStatus } from "@/shared/components/custom/buttons/SortButton";
import { useCachedState } from "./useCachedState";

export type UseSortStatusesOptions = {
  multi?: boolean;
  caching?: boolean;
};

export type DefaultSortStatuses<T extends string> = {
  [P in T]?: SortButtonStatus;
};

const DEFAULT_SORT_STATUSES: DefaultSortStatuses<string> = {};

export function useSortStatuses<T extends string>(
  name: string,
  defaultSortStatuses: DefaultSortStatuses<T> = DEFAULT_SORT_STATUSES,
  { multi = false, caching = true }: UseSortStatusesOptions = {},
) {
  const state = useState(defaultSortStatuses);

  const cacheState = useCachedState(`${name}Sort`, defaultSortStatuses);

  const [sortStatuses, setSortStatuses] = caching ? cacheState : state;

  const handleSortChange = useCallback(
    (name: string, sortStatus: SortButtonStatus) => {
      setSortStatuses(
        multi
          ? { ...sortStatuses, [name]: sortStatus }
          : ({ [name]: sortStatus } as DefaultSortStatuses<T>),
      );
    },
    [setSortStatuses, sortStatuses, multi],
  );

  return { sortStatuses, handleSortChange };
}
