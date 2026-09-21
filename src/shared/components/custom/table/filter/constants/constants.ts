import type { FilterFieldProps } from "../FilterBoard";
import type { FilterOperation } from "../types";

export const filterOperations = {
  equals: "table.operators.equals",
  notEquals: "table.operators.notEquals",
  contains: "table.operators.contains",
  notContains: "table.operators.notContains",
  startsWith: "table.operators.startsWith",
  endsWith: "table.operators.endsWith",
  gt: "table.operators.gt",
  lt: "table.operators.lt",
  gte: "table.operators.gte",
  lte: "table.operators.lte",
  in: "table.operators.in",
  notIn: "table.operators.notIn",
  isNull: "table.operators.isNull",
  isNotNull: "table.operators.isNotNull",
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
