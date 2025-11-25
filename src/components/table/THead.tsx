import Tr, { type TrProps } from "./Tr";
import Th from "./Th";
import SortButton, { type SortButtonEventHandler } from "../buttons/SortButton";
import type { ThProps } from "./Th";
import { cn } from "src/utils/cn";
import type { TableColumn, TableRow, TableSortStatuses } from "./Table";
import type React from "react";
import type { EventTarget } from "src/utils/EventTarget";

export type THeadSortEventHandler = (
  column: TableColumn
) => SortButtonEventHandler;

export type THeadSelectRowEventHandler = (
  row?: TableRow
) => (e: EventTarget) => void;

export type THeadProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  columns: TableColumn[];

  onSortClick: THeadSortEventHandler;

  sortStatuses: TableSortStatuses;

  onSelectRow: THeadSelectRowEventHandler;

  selectAll: boolean;

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
  ...props
}: THeadProps) {
  return (
    <thead {...props}>
      <Tr {...thrProps} className={cn("bg-primary-light ", thrProps.className)}>
        {selectable && (
          <Th
            {...thhsProps}
            {...thCheckboxProps}
            className={cn(
              `w-20`,
              thhsProps.className,
              thCheckboxProps.className
            )}
          >
            <input
              type="checkbox"
              onChange={onSelectRow()}
              name="selectAll"
              checked={Boolean(selectAll)}
              className="w-5 h-5 max-lg:w-4 max-lg:h-4"
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
            <div className="flex items-center justify-center">
              {column.headerName}
              {column.sort && (
                <SortButton
                  className="mt-0"
                  onClick={onSortClick(column)}
                  sortStatus={sortStatuses[column.name]}
                />
              )}
            </div>
          </Th>
        ))}
      </Tr>
    </thead>
  );
}

export default THead;
