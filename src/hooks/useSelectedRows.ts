import { useState } from "react";
import { useCachedState } from "./useCachedState";
import type { TableRowItem } from "@/shared/components/custom/table/Table";

export type UseSelectedRowsOptions = {
  caching?: boolean;
};

const DEFAULT_SELECTED_ROWS: Map<string | number, TableRowItem> = new Map<
  string | number,
  TableRowItem
>();

export function useSelectedRows(
  name: string,
  defaultSelectedRows: Map<
    string | number,
    TableRowItem
  > = DEFAULT_SELECTED_ROWS,
  { caching = true }: UseSelectedRowsOptions = {},
) {
  const state = useState(defaultSelectedRows);

  const cacheState = useCachedState(`${name}SelectedRows`, defaultSelectedRows);

  const [selectedRows, setSelectedRows] = caching ? cacheState : state;

  return { selectedRows, setSelectedRows };
}
