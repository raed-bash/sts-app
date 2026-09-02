import React, { type ReactNode } from "react";
import { type PaginationProps } from "./Pagination";
import TContainer, { type TContainerProps } from "./TContainer";
import TBody, { type TBodyProps } from "./TBody";
import type { ThProps } from "./Th";
import type { TdProps } from "./Td";
import type { SortButtonStatus } from "../buttons/SortButton";
import type { TrProps } from "./Tr";
import type {
  UseTableUtilsSelectedRows,
  UseTableUtilsSortEventHandler,
} from "./hooks/useTableUtils";
import { useTableUtils } from "./hooks/useTableUtils";
import TFooter from "./TFooter";
import THeader, {
  type THeaderHiddenColumns,
  type THeaderNoHiddenColumns,
} from "./THeader";
import THead from "./THead";
import type { FilterFilter } from "./filter/FilterBoard";
import {
  type FilterItem,
  type UseFilterSetStateFiltersAction,
} from "./filter/hooks/useFilter";
import type { FilterOperation } from "./filter";
import { PER_PAGE } from "@/dtos/pagingated-results-dto";

export type RowType = Record<string, any>;

export type FilterProps = {
  type:
    | "text"
    | "number"
    | "select"
    | "selectApi"
    | "autocompleteApi"
    | "checkbox"
    | "date";

  selectOps?: FilterOperation[];

  omitOps?: FilterOperation[];

  options?: { value: string | number | boolean; label: string }[];
};

type LooseKey<Row extends RowType> = keyof Row | (string & {});

export type TableColumn<Row extends RowType> = (
  | {
      strict?: true;
      name: keyof Row;
    }
  | {
      strict: false;
      name: LooseKey<Row>;
    }
) & {
  headerName: string;

  getCell?: (value: any, row: Row) => ReactNode;

  className?: string;

  type?: "actions";

  sort?: boolean;

  thhProps?: ThProps;

  tbdProps?: TdProps;

  hidden?: boolean;

  filterable?: boolean;

  filterProps?: FilterFilter;
};

export type TableRow<Row = any | { id: number }> = Row;

export type TableSortStatuses = Record<string, SortButtonStatus>;

export type TableHiddenColumns<Row extends RowType> = {
  hideableColumns: true;

  setHiddenColumns: (hiddenColumns: Set<TableColumn<Row>["name"]>) => void;

  hiddenColumns: Set<TableColumn<Row>["name"]>;
};

export type TableNoHiddenColumns = {
  hideableColumns?: false;

  setHiddenColumns?: never;

  hiddenColumns?: never;
};

export type TableSelectRows = {
  selectable: true;

  onSelectRows: (selectedRows: UseTableUtilsSelectedRows) => void;

  selectedRows: UseTableUtilsSelectedRows;
};

export type TableNoSelectRows = {
  selectable?: false;

  onSelectRows?: never;

  selectedRows?: never;
};

export type TableProps<Row extends RowType> = (
  TableHiddenColumns<Row> | TableNoHiddenColumns
) &
  (TableSelectRows | TableNoSelectRows) & {
    rows: TableRow<Row>[];

    columns: TableColumn<Row>[];

    currentPage?: number;

    perPage?: number;

    count?: number;

    onPageChange?: PaginationProps["onChange"];

    maxVisibleNeighbors?: PaginationProps["maxVisibleNeighbors"];

    containerProps?: TContainerProps;

    theadProps?: React.HTMLAttributes<HTMLTableSectionElement>;

    tbodyProps?: React.HTMLAttributes<HTMLTableSectionElement>;

    loading?: boolean;

    scLoading?: boolean;

    sortStatuses?: TableSortStatuses;

    onSortChange?: UseTableUtilsSortEventHandler<Row>;

    /**
     * A table head row props; <tr></tr> element
     */
    thrProps?: TrProps;
    /**
     * A table head props; <th></th> element
     */
    thhsProps?: ThProps;

    thCheckboxProps?: ThProps;
    /**
     * A table body row props; <tr></tr> element
     */
    tbrProps?: TBodyProps<Row>["tbrProps"];
    /**
     * A table body data props; <td></td> element
     */
    tbdsProps?: TdProps;

    tdCheckboxProps?: TdProps;

    orderedColumns: TableColumn<Row>["name"][];

    setOrderedColumns: (orderedColumns: TableColumn<Row>["name"][]) => void;

    filters: FilterItem[];

    setFilters?: UseFilterSetStateFiltersAction;
  };

function Table<Row extends RowType>({
  columns: originalColumns = [],
  rows = [],
  currentPage = 1,
  onPageChange = () => {},
  perPage = PER_PAGE,
  count = rows.length,
  containerProps = {},
  tbodyProps = {},
  theadProps = {},
  loading,
  scLoading,
  sortStatuses = {},
  onSortChange = () => {},
  onSelectRows = () => {},
  selectedRows = new Set(),
  selectable = false,
  maxVisibleNeighbors = 2,
  tbrProps,
  thrProps,
  thhsProps,
  tbdsProps,
  thCheckboxProps,
  tdCheckboxProps,
  hiddenColumns = new Set(),
  setHiddenColumns = () => {},
  hideableColumns,
  orderedColumns,
  setOrderedColumns,
  filters,
  setFilters,
}: TableProps<Row>) {
  const {
    displayedColumns,
    handleResetHiddenColumns,
    handleSelectRow,
    handleSortClick,
    handleToggleColumns,
    selectAll,
    columns,
    setColumns,
    filterUtils,
    createColumnFilterClickHandler,
  } = useTableUtils<Row>({
    hiddenColumns,
    onSelectRows,
    onSortChange,
    rows,
    selectedRows,
    setHiddenColumns,
    originalColumns,
    orderedColumns,
    setOrderedColumns,
    filters,
    setFilters,
  });

  const theaderProps = {
    hideableColumns: hideableColumns,

    ...(hideableColumns && {
      hiddenColumns: hiddenColumns,
      handleResetHiddenColumns: handleResetHiddenColumns,
      handleToggleColumns: handleToggleColumns,
    }),
  } as THeaderNoHiddenColumns | THeaderHiddenColumns<Row>;

  return (
    <TContainer {...containerProps}>
      <THeader<Row>
        columns={columns}
        setColumns={setColumns}
        selectedRows={selectedRows}
        filterUtils={filterUtils}
        {...theaderProps}
      />

      <div className="overflow-x-auto w-full max-w-full rounded-lg pb-[5px]">
        <table className="w-full min-w-max table-auto border-collapse relative">
          <THead
            columns={displayedColumns}
            onSelectRow={handleSelectRow}
            onSortClick={handleSortClick}
            selectAll={selectAll}
            sortStatuses={sortStatuses}
            selectable={selectable}
            thrProps={thrProps}
            thhsProps={thhsProps}
            thCheckboxProps={thCheckboxProps}
            selectedRows={selectedRows}
            createColumnFilterClickHandler={createColumnFilterClickHandler}
            {...tbodyProps}
          />
          <TBody
            scLoading={scLoading}
            columns={displayedColumns}
            tbrProps={tbrProps}
            onSelectRow={handleSelectRow}
            loading={loading}
            rows={rows}
            selectedRows={selectedRows}
            selectable={selectable}
            tbdsProps={tbdsProps}
            tdCheckboxProps={tdCheckboxProps}
            {...theadProps}
          />
        </table>
      </div>
      <TFooter
        count={count}
        currentPage={currentPage}
        onPageChange={onPageChange}
        maxVisibleNeighbors={maxVisibleNeighbors}
        perPage={perPage}
      />
    </TContainer>
  );
}

export default Table;
