import type { FilterInputProps } from "../FilterInput";
import type { FilterOperation } from "../types";
import { textFilterOperations } from "./filterConstants";

export const FILTER_OPERATIONS_BY_TYPE: Partial<
  Record<FilterInputProps["type"], FilterOperation[]>
> = {
  text: textFilterOperations,
};

export const getAvailableFilterOps = <
  T extends FilterOperation = FilterOperation,
>(
  type: FilterInputProps["type"],
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
