import type {
  filterOperations,
  selectFilterOperations,
  textFilterOperations,
} from "./constants/constants";

export type FilterOperation = keyof typeof filterOperations;

export type FilterOperationOptions<T extends FilterOperation> = {
  selectOps?: T[];

  omitOps?: T[];
};

export type FilterTextOperationsWithTypes = FilterOperationOptions<
  (typeof textFilterOperations)[number]
> & {
  type: "text";
};

export type FilterSelectOperationsWithTypes = FilterOperationOptions<
  (typeof selectFilterOperations)[number]
> & {
  type: "select" | "nativeSelect" | "selectApi" | "combobox" | "comboboxApi";
};

export type FilterNumberOperationsWithTypes = FilterOperationOptions<
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

export type FilterDateOperationsWithTypes = FilterOperationOptions<
  "equals" | "notEquals" | "gt" | "lt" | "gte" | "lte" | "isNull" | "isNotNull"
> & {
  type: "date";
};
