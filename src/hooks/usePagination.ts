import { useState } from "react";
import useCashingState from "./useCashingState";

export default function usePagination(
  key = "",
  defaultPage = 1,
  { cashing = true } = {}
) {
  const state = useState(defaultPage);

  const cashingState = useCashingState(`${key}Page`, defaultPage);

  const [page, setPage] = cashing ? cashingState : state;

  return { page, setPage };
}
