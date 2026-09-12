import type { FilterFieldProps } from "../FilterBoard";
import type { FilterOperation } from "../types";

export const filterOperations = {
  equals: "Equals",
  notEquals: "Not equals",
  contains: "Contains",
  notContains: "Not contains",
  startsWith: "Starts with",
  endsWith: "Ends with",
  gt: "Greater than",
  lt: "Less than",
  gte: "Greater than or equal",
  lte: "Less than or equal",
  in: "In",
  notIn: "Not in",
  isNull: "Is null",
  isNotNull: "is not null",
} as const;

export const textFilterOperations = [
  "contains",
  "notContains",
  "startsWith",
  "endsWith",
  "equals",
  "notEquals",
  "in",
  "notIn",
  "isNull",
  "isNotNull",
] satisfies FilterOperation[];

export const selectFilterOperations = [
  "in",
  "notIn",
  "isNull",
  "isNotNull",
] satisfies FilterOperation[];

export const numberFilterOperations = [
  "equals",
  "notEquals",
  "gt",
  "lt",
  "gte",
  "lte",
  "isNull",
  "isNotNull",
] satisfies FilterOperation[];

export const dateFilterOperations = [
  "equals",
  "notEquals",
  "gt",
  "lt",
  "gte",
  "lte",
  "isNull",
  "isNotNull",
] satisfies FilterOperation[];

export const FILTER_OPERATIONS_BY_TYPE: Partial<
  Record<FilterFieldProps<any>["type"], FilterOperation[]>
> = {
  text: textFilterOperations,
  nativeSelect: selectFilterOperations,
  select: selectFilterOperations,
  selectApi: selectFilterOperations,
  combobox: selectFilterOperations,
  comboboxApi: selectFilterOperations,
  date: dateFilterOperations,
  number: numberFilterOperations,
};
