import type { FilterOperation } from "../types";
import type { FilterFieldProps } from "../FilterBoard";
import { FILTER_OPERATIONS_BY_TYPE } from "../constants/constants";

export const getAvailableFilterOps = <
  T extends FilterOperation = FilterOperation,
>(
  type: FilterFieldProps<any>["type"],
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
