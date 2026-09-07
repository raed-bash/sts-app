import TableRow, { type TableRowProps } from "./TableRow";
import TableHeadCell from "./TableHeadCell";
import SortButton, { type SortButtonEventHandler } from "../buttons/SortButton";
import type { TableHeadCellProps } from "./TableHeadCell";
import { cn } from "cn";
import type { RowType, TableColumn, TableSortStatuses } from "./Table";
import type React from "react";
import Checkbox from "../inputs/Checkbox";
import type {
  UseTableCreateColumnFilterClickHandler,
  UseTableSelectedRows,
  UseTableSelectRowEventHandler,
} from "./hooks/useTable";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "../../ui/button";

export type TableHeadSortEventHandler<Row extends RowType> = (
  column: TableColumn<Row>,
) => SortButtonEventHandler;

export type TableHeadProps<Row extends RowType> =
  React.ComponentProps<"thead"> & {
    columns: TableColumn<Row>[];

    onSortClick: TableHeadSortEventHandler<Row>;

    sortStatuses: TableSortStatuses;

    onSelectRow: UseTableSelectRowEventHandler;

    selectAll: boolean;

    selectedRows: UseTableSelectedRows;

    selectable: boolean;
    /**
     * A table head row props; <tr></tr> element
     */
    thrProps?: TableRowProps;
    /**
     * A table head props; <th></th> element
     */
    thhsProps?: TableHeadCellProps;

    thCheckboxProps?: TableHeadCellProps;

    createColumnFilterClickHandler: UseTableCreateColumnFilterClickHandler<Row>;
  };

function TableHead<Row extends RowType>({
  onSortClick,
  sortStatuses,
  onSelectRow,
  selectAll,
  columns,
  selectable,
  thrProps = {},
  thhsProps = {},
  thCheckboxProps = {},
  selectedRows,
  createColumnFilterClickHandler,
  ...props
}: TableHeadProps<Row>) {
  return (
    <thead {...props}>
      <TableRow
        {...thrProps}
        className={cn("bg-gray-100 dark:bg-gray-700 ", thrProps.className)}
      >
        {selectable && (
          <TableHeadCell
            {...thhsProps}
            {...thCheckboxProps}
            className={cn(
              `w-20`,
              thhsProps.className,
              thCheckboxProps.className,
            )}
          >
            <Checkbox
              onChange={onSelectRow()}
              name="selectAll"
              checked={Boolean(selectAll)}
              secondaryStatus={!selectAll && selectedRows.size > 0}
            />
          </TableHeadCell>
        )}
        {columns.map(({ thhProps = {}, className, ...column }) => (
          <TableHeadCell
            key={column.name.toString()}
            title={
              typeof column.headerName === "string" ? column.headerName : ""
            }
            {...thhsProps}
            {...thhProps}
            className={cn(className, thhsProps.className, thhProps.className)}
          >
            <div className="flex items-center gap-2">
              {!column.sort && column.headerName}
              {column.sort && (
                <SortButton
                  className="mt-0 align-middle ms-1 py-1 uppercase"
                  onClick={onSortClick(column)}
                  sortStatus={sortStatuses[column.name.toString()]}
                >
                  {column.headerName}
                </SortButton>
              )}
              {column.filterable && (
                <div className="inline-block">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={createColumnFilterClickHandler(column)}
                  >
                    <EllipsisVerticalIcon />
                  </Button>
                </div>
              )}
            </div>
          </TableHeadCell>
        ))}
      </TableRow>
    </thead>
  );
}

export default TableHead;
