import type {
  filterOperations,
  selectFilterOperations,
  textFilterOperations,
} from "./constants";
import type { LabeledFieldProps } from "../inputs/LabeledField";

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

export type FilterFieldProps<
  Option = any,
  Multiple extends boolean | undefined = false,
> = LabeledFieldProps<Option, Multiple> &
  (
    | FilterTextOperationsWithTypes
    | FilterSelectOperationsWithTypes
    | FilterNumberOperationsWithTypes
    | FilterDateOperationsWithTypes
  );

/** A filterable field descriptor consumed by filter UI components. */
export type FilterField = {
  /** Unique key of the field (e.g. backend query param name) */
  name: string | number;

  /** Human-readable label; may be a raw i18n key resolved via translateDynamic */
  label?: string;

  /** Controls which input widget + operations the value editor renders */
  filterProps?: FilterFieldProps;
};
