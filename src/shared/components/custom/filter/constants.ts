import type { FilterFieldProps } from "./types";
import type { FilterOperation } from "./types";

export const filterOperations = {
  equals: "filter.operators.equals",
  notEquals: "filter.operators.notEquals",
  contains: "filter.operators.contains",
  notContains: "filter.operators.notContains",
  startsWith: "filter.operators.startsWith",
  endsWith: "filter.operators.endsWith",
  gt: "filter.operators.gt",
  lt: "filter.operators.lt",
  gte: "filter.operators.gte",
  lte: "filter.operators.lte",
  in: "filter.operators.in",
  notIn: "filter.operators.notIn",
  isNull: "filter.operators.isNull",
  isNotNull: "filter.operators.isNotNull",
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
  Record<FilterFieldProps["type"], FilterOperation[]>
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
