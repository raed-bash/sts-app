import i18n from "@/i18n";
import type { FilterFieldProps, FilterOperation } from "./types";
import { translateDynamic } from "@/shared/lib/translate-dynamic";
import { FILTER_OPERATIONS_BY_TYPE } from "./constants";

export const getAvailableFilterOps = <
  T extends FilterOperation = FilterOperation,
>(
  type: FilterFieldProps["type"] = "text",
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

export const resolveFieldLabel = (label: string): string => {
  if (!label) return "";
  return translateDynamic((key, options) => i18n.t(key, options), label);
};
