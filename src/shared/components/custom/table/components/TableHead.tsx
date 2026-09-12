import TableRow, { type TableRowProps } from "./TableRow";
import TableHeadCell from "./TableHeadCell";
import type { TableHeadCellProps } from "./TableHeadCell";
import { cn } from "cn";
import type React from "react";
import { EllipsisVerticalIcon } from "lucide-react";
import type { TableRowRecord, TableColumn, TableSortStatuses } from "../Table";
import type {
  UseTableCreateColumnFilterClickHandler,
  UseTableSelectedRows,
  UseTableCreateSelectRowChangeHandler,
  UseTableCreateSortClickHandler,
} from "../hooks/useTable";
import Checkbox from "../../inputs/Checkbox";
import SortButton from "../../buttons/SortButton";
import { Button } from "@/shared/components/ui/button";

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

      selectedRows: UseTableSelectedRows;

      selectable: boolean;
    };

    filtering: {
      createColumnFilterClickHandler: UseTableCreateColumnFilterClickHandler<
        Row
      >;
    };

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
  elements = {},
  ...props
}: TableHeadProps<Row>) {
  const { columns } = data;

  const { createSortClickHandler, sortStatuses } = sorting;

  const {
    createSelectRowChangeHandler,
    selectAll,
    selectedRows,
    selectable,
  } = selection;

  const { createColumnFilterClickHandler } = filtering;

  const {
    rowProps = {},
    cellProps = {},
    checkboxCellProps = {},
  } = elements;

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
            )}
          >
            <Checkbox
              onChange={createSelectRowChangeHandler()}
              name="selectAll"
              checked={Boolean(selectAll)}
              secondaryStatus={!selectAll && selectedRows.size > 0}
            />
          </TableHeadCell>
        )}
        {columns.map(({ headCellProps = {}, className, ...column }) => (
          <TableHeadCell
            key={column.name.toString()}
            title={
              typeof column.headerName === "string" ? column.headerName : ""
            }
            {...cellProps}
            {...headCellProps}
            className={cn(
              className,
              cellProps.className,
              headCellProps.className,
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
