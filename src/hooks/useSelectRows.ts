import { useState } from "react";
import { useCacheState } from "./useCacheState";

const defaultSelectRowsDefault = new Set<string | number>();

export function useSelectRows(
  name: string,
  defaultSelectRows = defaultSelectRowsDefault,
  { cashing = true } = {},
) {
  const state = useState(defaultSelectRows);

  const cacheState = useCacheState(`${name}SelectedRows`, defaultSelectRows);

  const [selectedRows, setSelectedRows] = cashing ? cacheState : state;

  return { selectedRows, setSelectedRows };
}
