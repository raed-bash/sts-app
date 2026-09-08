import { useState } from "react";
import { useCachedState } from "./useCachedState";

export function usePaginationState(
  key: string = "",
  defaultPage: number = 1,
  { caching = true } = {},
) {
  const state = useState(defaultPage);

  const cacheState = useCachedState(`${key}Page`, defaultPage);

  const [page, setPage] = caching ? cacheState : state;

  return { page, setPage };
}
