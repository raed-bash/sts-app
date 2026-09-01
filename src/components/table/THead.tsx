import Tr, { type TrProps } from "./Tr";
import Th from "./Th";
import SortButton, { type SortButtonEventHandler } from "../buttons/SortButton";
import type { ThProps } from "./Th";
import { cn } from "src/utils/cn";
import type { RowType, TableColumn, TableSortStatuses } from "./Table";
import type React from "react";
import Checkbox from "../inputs/Checkbox";
import type {
  UseTableUtilsCreateColumnFilterClickHandler,
  UseTableUtilsSelectedRows,
  UseTableUtilsSelectRowEventHandler,
} from "./hooks/useTableUtils";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "../ui/button";

export type THeadSortEventHandler<Row extends RowType> = (
  column: TableColumn<Row>,
) => SortButtonEventHandler;

export type THeadProps<Row extends RowType> =
  React.HTMLAttributes<HTMLTableSectionElement> & {
    columns: TableColumn<Row>[];

    onSortClick: THeadSortEventHandler<Row>;

    sortStatuses: TableSortStatuses;

    onSelectRow: UseTableUtilsSelectRowEventHandler;

    selectAll: boolean;

    selectedRows: UseTableUtilsSelectedRows;

    selectable: boolean;
    /**
     * A table head row props; <tr></tr> element
     */
    thrProps?: TrProps;
    /**
     * A table head props; <th></th> element
     */
    thhsProps?: ThProps;

    thCheckboxProps?: ThProps;

    createColumnFilterClickHandler: UseTableUtilsCreateColumnFilterClickHandler<Row>;
  };

function THead<Row extends RowType>({
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
}: THeadProps<Row>) {
  return (
    <thead {...props}>
      <Tr
        {...thrProps}
        className={cn("bg-gray-100 dark:bg-gray-700 ", thrProps.className)}
      >
        {selectable && (
          <Th
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
          </Th>
        )}
        {columns.map(({ thhProps = {}, className, ...column }) => (
          <Th
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
          </Th>
        ))}
      </Tr>
    </thead>
  );
}

export default THead;
