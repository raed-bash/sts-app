import type React from "react";
import { XIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { TableRowRecord, TableRowItem } from "../Table";
import type {
  UseTableSelectRowsHandler,
  UseTableSelectedRows,
} from "../hooks/useTable";

export type TableSelectedRowsProps<Row extends TableRowRecord> = {
  selection: {
    selectedRows: UseTableSelectedRows;

    onSelectRows: UseTableSelectRowsHandler;

    getSelectionLabel?: (row: Row) => React.ReactNode;
  };
};

function TableSelectedRows<Row extends TableRowRecord>({
  selection,
}: TableSelectedRowsProps<Row>) {
  const { selectedRows, onSelectRows, getSelectionLabel } = selection;

  const rows = [...selectedRows.values()];

  const clearAll = () => onSelectRows(new Map());

  const unselect = (row: TableRowItem) => () => {
    const nextSelectedRows = new Map(selectedRows);

    nextSelectedRows.delete(row.id);

    onSelectRows(nextSelectedRows);
  };

  return (
    <Popover>
      <Tooltip>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <Button variant="outline" size="sm">
                  Selected ({selectedRows.size})
                </Button>
              }
            />
          }
        />
        <TooltipContent>View selected rows</TooltipContent>
      </Tooltip>
      <PopoverContent align="end">
        <div className="flex items-center justify-between gap-2 px-1">
          <p className="text-sm font-medium">
            Selected rows ({selectedRows.size})
          </p>
          <Button variant="ghost" size="xs" onClick={clearAll}>
            Clear all
          </Button>
        </div>

        <div className="flex max-h-64 flex-col gap-1 overflow-auto pr-1">
          {rows.length ? (
            rows.map((row) => (
              <div
                key={row.id}
                className="group flex items-center justify-between gap-2 rounded px-2 py-1 text-[13px] hover:bg-gray-100 dark:hover:bg-gray-600/40"
              >
                <span className="min-w-0 truncate">
                  {getSelectionLabel ? (
                    getSelectionLabel(row)
                  ) : (
                    <span className="text-gray-500">#{String(row.id)}</span>
                  )}
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={unselect(row)}
                  title="Remove from selection"
                  className="opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <XIcon />
                </Button>
              </div>
            ))
          ) : (
            <p className="px-1 py-4 text-center text-gray-400">
              No rows selected.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TableSelectedRows;
