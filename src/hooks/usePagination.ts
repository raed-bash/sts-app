import { useState } from "react";
import { useCacheState } from "./useCacheState";

export function usePagination(
  key: string = "",
  defaultPage: number = 1,
  { cashing = true } = {},
) {
  const state = useState(defaultPage);

  const cacheState = useCacheState(`${key}Page`, defaultPage);

  const [page, setPage] = cashing ? cacheState : state;

  return { page, setPage };
}
