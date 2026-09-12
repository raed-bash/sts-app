import { useState } from "react";
import { useCachedState } from "./useCachedState";

export type UseSelectedRowsOptions = {
  caching?: boolean;
};

const DEFAULT_SELECTED_ROWS: Set<string | number> = new Set<
  string | number
>();

export function useSelectedRows(
  name: string,
  defaultSelectedRows: Set<string | number> = DEFAULT_SELECTED_ROWS,
  { caching = true }: UseSelectedRowsOptions = {},
) {
  const state = useState(defaultSelectedRows);

  const cacheState = useCachedState(`${name}SelectedRows`, defaultSelectedRows);

  const [selectedRows, setSelectedRows] = caching ? cacheState : state;

  return { selectedRows, setSelectedRows };
}
