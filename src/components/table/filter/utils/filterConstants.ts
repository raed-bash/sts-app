import type { FilterOperation } from "../types";

export const filterOperations = {
  equals: "equals",
  notEquals: "notEquals",
  contains: "contains",
  notContains: "notContains",
  startsWith: "startsWith",
  endsWith: "endsWith",
  gt: "gt",
  lt: "lt",
  gte: "gte",
  lte: "lte",
  in: "in",
  notIn: "notIn",
  isNull: "isNull",
  isNotNull: "isNotNull",
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
