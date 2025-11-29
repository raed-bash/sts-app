import React, { type ReactNode } from "react";
import Pagination, { type PaginationProps } from "./Pagination";
import Container, { type ContainerProps } from "./Container";
import TBody, { type TBodyProps } from "./TBody";
import THead from "./THead";
import MenuHideColumns from "./MenuHideColumns";
import type { ThProps } from "./Th";
import type { TdProps } from "./Td";
import type { SortButtonStatus } from "../buttons/SortButton";
import type { TrProps } from "./Tr";
import type { UseTableUtilsSortEventHandler } from "./hooks/useTableUtils";
import useTableUtils from "./hooks/useTableUtils";

export interface TableColumn<Row = any> {
  name: string;

  headerName: string;

  getCell?: (value: any, row: Row) => ReactNode;

  className?: string;

  type?: "actions";

  sort?: boolean;

  thhProps?: ThProps;

  tbdProps?: TdProps;

  hidden?: boolean;
}

export type TableRow<Row = any | { id: number }> = Row;

export type TableSortStatuses = Record<string, SortButtonStatus>;

export type TableHiddenColumns<Row> = {
  hideableColumns: true;

  setHiddenColumns: (hiddenColumns: Set<TableColumn<Row>["name"]>) => void;

  hiddenColumns: Set<TableColumn["name"]>;
};

export type TableNoHiddenColumns = {
  hideableColumns?: false;

  setHiddenColumns?: never;

  hiddenColumns?: never;
};

export type TableSelectRows = {
  selectable: true;

  onSelectRows: (selectedRows: Set<string | number>) => void;

  selectedRows: Set<string | number>;
};

export type TableNoSelectRows = {
  selectable?: false;

  onSelectRows?: never;

  selectedRows?: never;
};

export type TableProps<Row> = (TableHiddenColumns<Row> | TableNoHiddenColumns) &
  (TableSelectRows | TableNoSelectRows) & {
    rows: TableRow<Row>[];

    columns: TableColumn<Row>[];

    currentPage?: number;

    totalPages?: number;

    perPage?: number;

    count?: number;

    onPageChange?: PaginationProps["onPageChange"];

    maxVisibleNeighbors?: PaginationProps["maxVisibleNeighbors"];

    containerProps?: ContainerProps;

    theadProps?: React.HTMLAttributes<HTMLTableSectionElement>;

    tbodyProps?: React.HTMLAttributes<HTMLTableSectionElement>;

    loading?: boolean;

    scLoading?: boolean;

    sortStatuses?: TableSortStatuses;

    onSortChange?: UseTableUtilsSortEventHandler;

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
    tbrProps?: TBodyProps["tbrProps"];
    /**
     * A table body data props; <td></td> element
     */
    tbdsProps?: TdProps;

    tdCheckboxProps?: TdProps;
  };
function Table<Row>({
  columns = [],
  rows = [],
  currentPage = 1,
  onPageChange = () => {},
  totalPages = 2,
  perPage = 20,
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
  hideableColumns = false,
}: TableProps<Row>) {
  const {
    displayedColumns,
    handleResetHiddenColumns,
    handleSelectRow,
    handleSortClick,
    handleToggleColumns,
    selectAll,
  } = useTableUtils({
    columns,
    hiddenColumns,
    onSelectRows,
    onSortChange,
    rows,
    selectedRows,
    setHiddenColumns,
  });

  return (
    <Container {...containerProps}>
      {hideableColumns && (
        <div className="bg-primary-light flex justify-end py-2 pe-2">
          <MenuHideColumns
            onReset={handleResetHiddenColumns}
            handleToggleColumns={handleToggleColumns}
            hiddenColumns={hiddenColumns}
            columns={columns}
          />
        </div>
      )}
      <div className="overflow-x-auto w-full max-w-full">
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
      <div className="flex justify-between items-center px-10">
        <div className="flex gap-5">
          <div className="flex items-center gap-1 font-medium">
            <p className="text-lg">المجموع: </p>
            <span>{count}</span>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
          maxVisibleNeighbors={maxVisibleNeighbors}
          count={count}
          perPage={perPage}
        />

        <div className="flex items-center gap-1 font-medium">
          <p className="text-lg">عدد الصفوف لكل صفحة: </p>
          <span>{perPage}</span>
        </div>
      </div>
    </Container>
  );
}

export default Table;
