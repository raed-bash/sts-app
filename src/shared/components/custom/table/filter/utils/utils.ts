import type { FilterOperation } from "../types";
import {
  selectFilterOperations,
  textFilterOperations,
} from "../constants/constants";
import type { FilterFilter } from "../FilterBoard";

export const FILTER_OPERATIONS_BY_TYPE: Partial<
  Record<FilterFilter<any>["type"], FilterOperation[]>
> = {
  text: textFilterOperations,
  nativeSelect: selectFilterOperations,
  select: selectFilterOperations,
  selectApi: selectFilterOperations,
  combobox: selectFilterOperations,
  comboboxApi: selectFilterOperations,
};

export const getAvailableFilterOps = <
  T extends FilterOperation = FilterOperation,
>(
  type: FilterFilter<any>["type"],
  options: { selectedOps?: T[]; omittedOps?: T[] } = {},
): T[] => {
  const baseOps = (FILTER_OPERATIONS_BY_TYPE[type] ?? []) as T[];

  const { selectedOps, omittedOps } = options;

  if (!selectedOps?.length && !omittedOps?.length) {
    return baseOps;
  }

  return baseOps.filter((op) => {
    if (selectedOps?.includes(op)) return false;
    if (omittedOps?.includes(op)) return false;
    return true;
  });
};
