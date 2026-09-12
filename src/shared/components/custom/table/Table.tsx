import React, { type ReactNode } from "react";
import { type PaginationProps } from "../Pagination";
import TableContainer, {
  type TableContainerProps,
} from "./components/TableContainer";
import TableBody from "./components/TableBody";
import type { TableHeadCellProps } from "./components/TableHeadCell";
import type { TableCellProps } from "./components/TableCell";
import type { SortButtonStatus } from "../buttons/SortButton";
import type { TableRowProps } from "./components/TableRow";
import type {
  UseTableSelectRowsHandler,
  UseTableSelectedRows,
  UseTableSortChangeHandler,
} from "./hooks/useTable";
import { useTable } from "./hooks/useTable";
import TableFooter from "./components/TableFooter";
import TableHeader, {
  type TableHeaderHideableColumns,
  type TableHeaderNonHideableColumns,
} from "./components/TableHeader";
import TableHead from "./components/TableHead";
import type { FilterFieldProps } from "./filter/FilterBoard";
import { type FilterCondition } from "./filter/hooks/useFilter";
import type { FilterLogicalOperator } from "./filter";
import type { TableAction } from "./components/TableActionsCell";
import { PER_PAGE } from "@/shared/dtos/pagingated-results-dto";

export type TableRowRecord = Record<string, any>;

type TableColumnKey<Row extends TableRowRecord> = keyof Row | (string & {});

export type TableColumn<Row extends TableRowRecord> = (
  | {
      strict?: true;
      name: keyof Row;
    }
  | {
      strict: false;
      name: TableColumnKey<Row>;
    }
) & {
  headerName: string;

  getCell?: (value: any, row: Row) => ReactNode;

  className?: string;

  type?: "actions";

  sort?: boolean;

  /** Props for this column's head cell; <th> element */
  headCellProps?: TableHeadCellProps;

  /** Props for this column's body cells; <td> elements */
  bodyCellProps?: TableCellProps;

  hidden?: boolean;

  filterable?: boolean;

  filterProps?: FilterFieldProps<any>;
};

export type TableRowItem<Row = any | { id: number }> = Row;

export type TableSortStatuses = Record<string, SortButtonStatus>;

export type TableLoadingProps = {
  /** Shows a full-loading overlay until the initial data is ready */
  loading?: boolean;

  /** Shows a slim linear progress bar on top of the table */
  scLoading?: boolean;
};

export type TablePaginationProps = {
  currentPage: PaginationProps["currentPage"];

  count: PaginationProps["count"];

  perPage?: PaginationProps["perPage"];

  onPageChange: PaginationProps["onChange"];

  maxVisibleNeighbors?: PaginationProps["maxVisibleNeighbors"];
};

export type TableSelectionProps = {
  onSelectRows: UseTableSelectRowsHandler;

  selectedRows: UseTableSelectedRows;
};

export type TableFilteringProps = {
  filters: FilterCondition[];

  onFiltersChange?: (filters: FilterCondition[]) => void;

  logicalOperator: FilterLogicalOperator;

  onLogicalOperatorChange: (operator: FilterLogicalOperator) => void;
};

export type TableOrderingProps<Row extends TableRowRecord> = {
  orderedColumns: TableColumn<Row>["name"][];

  onOrderedColumnsChange: (orderedColumns: TableColumn<Row>["name"][]) => void;
};

export type TableHideableColumns<Row extends TableRowRecord> = {
  hideableColumns: true;

  onHiddenColumnsChange: (hiddenColumns: Set<TableColumn<Row>["name"]>) => void;

  hiddenColumns: Set<TableColumn<Row>["name"]>;
};

export type TableNonHideableColumns = {
  hideableColumns?: false;

  onHiddenColumnsChange?: never;

  hiddenColumns?: never;
};

export type TableSelectable = TableSelectionProps & {
  selectable: true;
};

export type TableNonSelectable = {
  selectable?: false;

  onSelectRows?: never;

  selectedRows?: never;
};

export type TableProps<Row extends TableRowRecord> = {
  /**
   * The table data
   */
  data?: {
    rows?: TableRowItem<Row>[];

    columns?: TableColumn<Row>[];
  };

  /**
   * Loading states
   */
  loading?: TableLoadingProps;

  /**
   * Pagination state and controls
   */
  pagination?: Partial<TablePaginationProps>;

  /**
   * Column sorting
   */
  sorting?: {
    sortStatuses?: TableSortStatuses;

    onSortChange?: UseTableSortChangeHandler<Row>;
  };

  /**
   * Row selection
   */
  selection?: TableSelectable | TableNonSelectable;

  /**
   * Row action buttons rendered in columns marked with `type: "actions"`
   */
  actions?: TableAction<Row>[];

  /**
   * Column visibility toggling
   */
  hiding?: TableHideableColumns<Row> | TableNonHideableColumns;

  /**
   * Column ordering
   */
  ordering: TableOrderingProps<Row>;

  /**
   * Column filtering
   */
  filtering: TableFilteringProps;

  /**
   * Props forwarded to the underlying DOM elements
   */
  elements?: {
    /** Root table container; <div> element */
    containerProps?: TableContainerProps;

    /** Table head; <thead> element */
    theadProps?: React.ComponentProps<"thead">;

    /** Table body; <tbody> element */
    tbodyProps?: React.ComponentProps<"tbody">;

    /** Head row; <tr> element */
    headRowProps?: TableRowProps;

    /** Head cells; <th> elements */
    headCellProps?: TableHeadCellProps;

    /** Head selection checkbox cell; <th> element */
    headCheckboxCellProps?: TableHeadCellProps;

    /** Body rows; <tr> elements */
    bodyRowProps?: TableRowProps;

    /** Body data cells; <td> elements */
    bodyCellProps?: TableCellProps;

    /** Body selection checkbox cell; <td> element */
    bodyCheckboxCellProps?: TableCellProps;
  };
};

function Table<Row extends TableRowRecord>({
  data = {},
  loading = {},
  pagination = {},
  sorting = {},
  selection = {},
  actions = [],
  hiding = {},
  ordering,
  filtering,
  elements = {},
}: TableProps<Row>) {
  const { rows = [], columns: originalColumns = [] } = data;

  const { loading: isLoading, scLoading } = loading;

  const {
    currentPage = 1,
    perPage = PER_PAGE,
    count = rows.length,
    onPageChange = () => {},
    maxVisibleNeighbors = 2,
  } = pagination;

  const { sortStatuses = {}, onSortChange = () => {} } = sorting;

  const {
    onSelectRows = () => {},
    selectedRows = new Set(),
    selectable = false,
  } = selection;

  const {
    hideableColumns,
    hiddenColumns = new Set(),
    onHiddenColumnsChange = () => {},
  } = hiding;

  const {
    orderedColumns = [],
    onOrderedColumnsChange = () => {},
  } = ordering;

  const { filters, onFiltersChange, logicalOperator, onLogicalOperatorChange } =
    filtering;

  const {
    containerProps = {},
    theadProps = {},
    tbodyProps = {},
    headRowProps,
    headCellProps,
    headCheckboxCellProps,
    bodyRowProps,
    bodyCellProps,
    bodyCheckboxCellProps,
  } = elements;
  const {
    displayedColumns,
    resetHiddenColumns,
    createSelectRowChangeHandler,
    createSortClickHandler,
    createToggleColumnsClickHandler,
    selectAll,
    columns,
    setColumns,
    filterUtils,
    createColumnFilterClickHandler,
  } = useTable<Row>({
    data: { rows, originalColumns },
    sorting: { onSortChange },
    selection: { onSelectRows, selectedRows },
    hiding: { hiddenColumns, onHiddenColumnsChange },
    ordering: { orderedColumns, onOrderedColumnsChange },
    filtering: { filters, onFiltersChange, logicalOperator, onLogicalOperatorChange },
  });

  const theaderProps = {
    hideableColumns: hideableColumns,

    ...(hideableColumns && {
      hiddenColumns: hiddenColumns,
      onReset: resetHiddenColumns,
      createToggleColumnsClickHandler: createToggleColumnsClickHandler,
    }),
  } as TableHeaderNonHideableColumns | TableHeaderHideableColumns<Row>;

  return (
    <TableContainer {...containerProps}>
      <TableHeader<Row>
        data={{ columns, setColumns }}
        selection={{ selectedRows }}
        filtering={{ filterUtils }}

        {...theaderProps}
      />

      <div className="overflow-x-auto w-full max-w-full rounded-lg pb-[5px]">
        <table className="w-full min-w-max table-auto border-collapse relative">
          <TableHead
            data={{ columns: displayedColumns }}
            sorting={{ sortStatuses, createSortClickHandler }}
            selection={{
              selectable,
              selectedRows,
              selectAll,
              createSelectRowChangeHandler,
            }}
            filtering={{ createColumnFilterClickHandler }}
            elements={{
              rowProps: headRowProps,
              cellProps: headCellProps,
              checkboxCellProps: headCheckboxCellProps,
            }}
            {...theadProps}
          />
          <TableBody
            data={{ rows, columns: displayedColumns }}
            actions={actions}
            selection={{ selectable, selectedRows, createSelectRowChangeHandler }}
            loading={{ loading: isLoading, scLoading }}
            elements={{
              rowProps: bodyRowProps,
              cellProps: bodyCellProps,
              checkboxCellProps: bodyCheckboxCellProps,
            }}
            {...tbodyProps}
          />
        </table>
      </div>
      <TableFooter
        pagination={{
          count,
          currentPage,
          onPageChange,
          maxVisibleNeighbors,
          perPage,
        }}
      />
    </TableContainer>
  );
}

export default Table;
