import Tr, { type TrProps } from "./Tr";
import Th from "./Th";
import SortButton, { type SortButtonEventHandler } from "../buttons/SortButton";
import type { ThProps } from "./Th";
import { cn } from "src/utils/cn";
import type { TableColumn, TableRow, TableSortStatuses } from "./Table";
import type React from "react";
import type { EventTarget } from "src/utils/EventTarget";
import Checkbox from "../inputs/Checkbox";

export type THeadSortEventHandler = (
  column: TableColumn,
) => SortButtonEventHandler;

export type THeadSelectRowEventHandler = (
  row?: TableRow,
) => (e: EventTarget) => void;

export type THeadProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  columns: TableColumn[];

  onSortClick: THeadSortEventHandler;

  sortStatuses: TableSortStatuses;

  onSelectRow: THeadSelectRowEventHandler;

  selectAll: boolean;

  selectedRows: Set<string | number>;

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
};

function THead({
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
  ...props
}: THeadProps) {
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
              className="w-4 h-4"
              secondaryStatus={!selectAll && selectedRows.size > 0}
            />
          </Th>
        )}
        {columns.map(({ thhProps = {}, className, ...column }) => (
          <Th
            key={column.name}
            title={
              typeof column.headerName === "string" ? column.headerName : ""
            }
            {...thhsProps}
            {...thhProps}
            className={cn(className, thhsProps.className, thhProps.className)}
          >
            {!column.sort && column.headerName}
            {column.sort && (
              <SortButton
                className="mt-0 align-middle ms-1 py-1 uppercase"
                onClick={onSortClick(column)}
                sortStatus={sortStatuses[column.name]}
              >
                {column.headerName}
              </SortButton>
            )}
          </Th>
        ))}
      </Tr>
    </thead>
  );
}

export default THead;
