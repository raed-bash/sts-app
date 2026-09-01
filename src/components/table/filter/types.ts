import type { filterOperations } from "./utils/filterConstants";

export type FilterOperation = keyof typeof filterOperations;

export type FilterOmitOperations<T extends FilterOperation> = {
  omitOps?: T[];

  selectOps?: never;
};

export type FilterSelectOperations<T extends FilterOperation> = {
  selectOps?: T[];

  omitOps?: never;
};

export type FilterOperationOptions<T extends FilterOperation> =
  FilterOmitOperations<T> | FilterSelectOperations<T>;

export type FilterNumberProps = FilterOperationOptions<
  | "equals"
  | "notEquals"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "in"
  | "notIn"
  | "isNull"
  | "isNotNull"
> & {
  type: "number";
};

export type FilterSelectProps = FilterOperationOptions<
  "in" | "notIn" | "isNull" | "isNotNull"
> & {
  type: "select";

  options: { value: string | number | boolean; label: string }[];
};

export type FilterSelectApiProps = FilterOperationOptions<
  "in" | "notIn" | "isNull" | "isNotNull"
> & {
  type: "selectApi";
};

export type FilterDateProps = FilterOperationOptions<
  "equals" | "notEquals" | "gt" | "lt" | "gte" | "lte" | "isNull" | "isNotNull"
> & {
  type: "date";
};
