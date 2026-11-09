import type { TableAction } from "../components/TableActionsCell";
import type { TableRowRecord } from "../Table";

/** What a click on a row/card does: open it if possible, else edit it. */
const PRIMARY_ACTIONS = ["view", "open", "answers", "results", "edit"];

export function getPrimaryAction<Row extends TableRowRecord>(
  actions: TableAction<Row>[],
  row: Row,
) {
  for (const name of PRIMARY_ACTIONS) {
    const action = actions.find((a) => a.name === name && !a.hidden?.(row));
    if (action) return action;
  }
  return undefined;
}
