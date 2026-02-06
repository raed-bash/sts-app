import { useState } from "react";
import useCashingState from "./useCashingState";

const defaultSelectRowsDefault = new Set<string | number>();

export default function useSelectRows(
  name: string,
  defaultSelectRows = defaultSelectRowsDefault,
  { cashing = true } = {},
) {
  const state = useState(defaultSelectRows);

  const cashingState = useCashingState(
    `${name}SelectedRows`,
    defaultSelectRows,
  );

  const [selectedRows, setSelectedRows] = cashing ? cashingState : state;

  return { selectedRows, setSelectedRows };
}
