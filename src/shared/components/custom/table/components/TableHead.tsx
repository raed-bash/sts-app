import { useState } from "react";
import TableRow, { type TableRowProps } from "./TableRow";
import TableHeadCell from "./TableHeadCell";
import type { TableHeadCellProps } from "./TableHeadCell";
import { cn } from "cn";
import type React from "react";
import { EllipsisVerticalIcon, Filter, Pin, PinOff } from "lucide-react";
import type { TableRowRecord, TableColumn, TableSortStatuses } from "../Table";
import type { TablePinningProps } from "../Table";
import type {
  UseTableCreateColumnFilterClickHandler,
  UseTableCreateSelectRowChangeHandler,
  UseTableCreateSortClickHandler,
} from "../hooks/useTable";
import Checkbox from "../../inputs/Checkbox";
import SortButton from "../../buttons/SortButton";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/custom/popover/Popover";

export type TableHeadProps<Row extends TableRowRecord> =
  React.ComponentProps<"thead"> & {
    data: {
      columns: TableColumn<Row>[];
    };

    sorting: {
      createSortClickHandler: UseTableCreateSortClickHandler<Row>;

      sortStatuses: TableSortStatuses;
    };

    selection: {
      createSelectRowChangeHandler: UseTableCreateSelectRowChangeHandler;

      selectAll: boolean;

      someSelected: boolean;

      selectable: boolean;
    };

    filtering: {
      createColumnFilterClickHandler: UseTableCreateColumnFilterClickHandler<Row>;
    };

    pinning?: TablePinningProps<Row>;

    /**
     * Cell padding applied to every head cell
     */
    density?: string;

    elements?: {
      /** Head row; <tr> element */
      rowProps?: TableRowProps;

      /** Head cells; <th> elements */
      cellProps?: TableHeadCellProps;

      /** Head selection checkbox cell; <th> element */
      checkboxCellProps?: TableHeadCellProps;
    };
  };

function TableHead<Row extends TableRowRecord>({
  data,
  sorting,
  selection,
  filtering,
  pinning,
  density,
  elements = {},
  ...props
}: TableHeadProps<Row>) {
  const { columns } = data;

  const { createSortClickHandler, sortStatuses } = sorting;

  const { createSelectRowChangeHandler, selectAll, someSelected, selectable } =
    selection;

  const { createColumnFilterClickHandler } = filtering;

  const { rowProps = {}, cellProps = {}, checkboxCellProps = {} } = elements;

  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  return (
    <thead {...props}>
      <TableRow
        {...rowProps}
        className={cn("bg-gray-100 dark:bg-gray-700 ", rowProps.className)}
      >
        {selectable && (
          <TableHeadCell
            {...cellProps}
            {...checkboxCellProps}
            className={cn(
              `w-20`,
              cellProps.className,
              checkboxCellProps.className,
              density,
            )}
          >
            <Checkbox
              onChange={createSelectRowChangeHandler()}
              name="selectAll"
              checked={Boolean(selectAll)}
              secondaryStatus={!selectAll && someSelected}
            />
          </TableHeadCell>
        )}
        {columns.map(({ headCellProps = {}, className, ...column }) => {
          const name = String(column.name);

          const isPinned = pinning
            ? pinning.pinnedColumns.has(column.name)
            : false;

          const right = isPinned
            ? pinning?.getRightOffset(column.name)
            : undefined;

          const showActions = Boolean(
            column.filterable || pinning?.pinnableColumns,
          );

          return (
            <TableHeadCell
              key={name}
              title={
                typeof column.headerName === "string" ? column.headerName : ""
              }
              data-pinned={isPinned ? name : undefined}
              style={right !== undefined ? { right } : undefined}
              {...cellProps}
              {...headCellProps}
              className={cn(
                isPinned &&
                  cn(
                    "sticky z-[2] bg-gray-100 dark:bg-gray-700",
                    pinning?.isFirstPinned(column.name) &&
                      "border-l-2 border-(--primary)",
                  ),
                className,
                cellProps.className,
                headCellProps.className,
                density,
              )}
            >
              <div className="flex items-center gap-2">
                {!column.sort && column.headerName}
                {column.sort && (
                  <SortButton
                    className="mt-0 align-middle ms-1 py-1 uppercase"
                    onClick={createSortClickHandler(column)}
                    sortStatus={sortStatuses[column.name.toString()]}
                  >
                    {column.headerName}
                  </SortButton>
                )}
                {showActions && (
                  <div className="inline-block">
                    <Popover
                      open={openMenuFor === name}
                      onOpenChange={(open) =>
                        setOpenMenuFor(open ? name : null)
                      }
                    >
                      <PopoverTrigger
                        render={
                          <Button variant="outline" size="icon">
                            <EllipsisVerticalIcon />
                          </Button>
                        }
                      />
                      <PopoverContent
                        moveable={false}
                        align="end"
                        className="w-44 p-1"
                      >
                        {column.filterable && (
                          <button
                            type="button"
                            className="flex items-center gap-2 rounded px-2 py-1 text-[13px] hover:bg-(--primary) hover:text-(--primary-foreground)"
                            onClick={() => {
                              setOpenMenuFor(null);
                              createColumnFilterClickHandler(column)();
                            }}
                          >
                            <Filter className="h-4 w-4" />
                            Filter
                          </button>
                        )}
                        {pinning?.pinnableColumns && (
                          <button
                            type="button"
                            className="flex items-center gap-2 rounded px-2 py-1 text-[13px] hover:bg-(--primary) hover:text-(--primary-foreground)"
                            onClick={() => {
                              pinning.createTogglePinColumnHandler?.(column)();
                              setOpenMenuFor(null);
                            }}
                          >
                            {isPinned ? (
                              <PinOff className="h-4 w-4" />
                            ) : (
                              <Pin className="h-4 w-4" />
                            )}
                            {isPinned ? "Unpin" : "Pin"}
                          </button>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            </TableHeadCell>
          );
        })}
      </TableRow>
    </thead>
  );
}

export default TableHead;
