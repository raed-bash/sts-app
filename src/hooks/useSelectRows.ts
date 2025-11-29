import { useState } from "react";
import useCashingState from "./useCashingState";

const defaultSelectRowsDef = new Set();

export default function useSelectRows(
  name: string,
  defaultSelectRows = defaultSelectRowsDef,
  { cashing = true } = {}
) {
  const state = useState(defaultSelectRows);

  const cashingState = useCashingState(
    `${name}SelectedRows`,
    defaultSelectRows
  );

  const [selectedRows, setSelectedRows] = cashing ? cashingState : state;

  return { selectedRows, setSelectedRows };
}
