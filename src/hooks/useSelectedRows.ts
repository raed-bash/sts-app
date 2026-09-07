import { useState } from "react";
import { useCachedState } from "./useCachedState";

const defaultSelectedRowsDefault = new Set<string | number>();

export function useSelectedRows(
  name: string,
  defaultSelectRows = defaultSelectedRowsDefault,
  { caching = true } = {},
) {
  const state = useState(defaultSelectRows);

  const cacheState = useCachedState(`${name}SelectedRows`, defaultSelectRows);

  const [selectedRows, setSelectedRows] = caching ? cacheState : state;

  return { selectedRows, setSelectedRows };
}
