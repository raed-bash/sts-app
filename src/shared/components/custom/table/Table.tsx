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
  UseTableCreateTogglePinColumnHandler,
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
import { useTablePinnedColumns } from "./hooks/useTablePinnedColumns";
import { buildCsv } from "./utils/csv";
import toast from "react-hot-toast";

const TABLE_ROW_HEIGHTS: Record<string, number> = {
  compact: 44,
  comfortable: 60,
  roomy: 80,
};

const TABLE_HEADER_HEIGHT = 64;

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

  /** Extracts a plain-text value for CSV export, overriding getCell/raw row value */
  getCellValue?: (
    value: any,
    row: Row,
  ) => string | number | boolean | null | undefined;

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

export type TableCsvOptions<Row extends TableRowRecord> = {
  /** Download file name without extension; defaults to "table" */
  fileName?: string;

  /** Also export columns that are currently hidden via the columns menu */
  includeHiddenColumns?: boolean;

  /** Transform the rows to export (e.g. selected rows only). Defaults to the selected rows when any are selected, otherwise the current table rows. */
  getRows?: (rows: TableRowItem<Row>[]) => TableRowItem[];
};

export type TableSortStatuses = Record<string, SortButtonStatus>;

export type TableLoadingProps = {
  /** Shows a full-loading overlay until the initial data is ready */
  loading?: boolean;

  /** Shows a slim linear progress bar on top of the table */
  scLoading?: boolean;
};

export type TableLoadMoreProps = {
  enabled: boolean;

  onLoadMore: () => void;

  hasMore: boolean;

  isFetching: boolean;

  loadedCount: number;
};

export type TablePaginationProps = {
  currentPage: PaginationProps["currentPage"];

  count: PaginationProps["count"];

  perPage?: PaginationProps["perPage"];

  onPageChange: PaginationProps["onChange"];

  maxVisibleNeighbors?: PaginationProps["maxVisibleNeighbors"];

  loadMore?: TableLoadMoreProps;
};

export type TableSelectionProps<Row extends TableRowRecord = TableRowRecord> = {
  onSelectRows: UseTableSelectRowsHandler;

  selectedRows: UseTableSelectedRows;

  getSelectionLabel?: (row: Row) => ReactNode;
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

export type TablePinnableColumns<Row extends TableRowRecord> = {
  pinnableColumns: true;

  pinnedColumns: Set<TableColumn<Row>["name"]>;

  onPinnedColumnsChange: (pinnedColumns: Set<TableColumn<Row>["name"]>) => void;
};

export type TableNonPinnableColumns = {
  pinnableColumns?: false;

  pinnedColumns?: never;

  onPinnedColumnsChange?: never;
};

export type TablePinningProps<Row extends TableRowRecord> = {
  pinnedColumns: Set<TableColumn<Row>["name"]>;

  getRightOffset: (name: TableColumn<Row>["name"]) => number | undefined;

  isFirstPinned: (name: TableColumn<Row>["name"]) => boolean;

  pinnableColumns?: boolean;

  createTogglePinColumnHandler?: UseTableCreateTogglePinColumnHandler<Row>;
};

export type TableSelectable<Row extends TableRowRecord> =
  TableSelectionProps<Row> & {
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
  selection?: TableSelectable<Row> | TableNonSelectable;

  /**
   * Row action buttons rendered in columns marked with `type: "actions"`
   */
  actions?: TableAction<Row>[];

  /**
   * Enable "Copy as CSV" / "Download CSV" in the table header
   */
  csv?: TableCsvOptions<Row>;

  /**
   * Column visibility toggling
   */
  hiding?: TableHideableColumns<Row> | TableNonHideableColumns;

  /**
   * Pinned columns (floating on the right)
   */
  pinning?: TablePinnableColumns<Row> | TableNonPinnableColumns;

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
  pinning = {},
  ordering,
  filtering,
  elements = {},
  csv,
}: TableProps<Row>) {
  const { rows = [], columns: originalColumns = [] } = data;

  const { loading: isLoading, scLoading } = loading;

  const {
    currentPage = 1,
    perPage = PER_PAGE,
    count = rows.length,
    onPageChange = () => {},
    maxVisibleNeighbors = 2,
    loadMore,
  } = pagination;

  const { sortStatuses = {}, onSortChange = () => {} } = sorting;

  const {
    onSelectRows = () => {},
    selectedRows = new Map(),
    selectable = false,
  } = selection;

  const getSelectionLabel =
    selection.selectable === true ? selection.getSelectionLabel : undefined;

  const {
    hideableColumns,
    hiddenColumns = new Set(),
    onHiddenColumnsChange = () => {},
  } = hiding;

  const {
    pinnableColumns = false,
    pinnedColumns = new Set(),
    onPinnedColumnsChange = () => {},
  } = pinning;

  const { orderedColumns = [], onOrderedColumnsChange = () => {} } = ordering;

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
    createTogglePinColumnHandler,
    selectAll,
    someSelected,
    columns,
    setColumns,
    filterUtils,
    createColumnFilterClickHandler,
    density,
    setTableDensity,
    densityPadding,
  } = useTable<Row>({
    data: { rows, originalColumns },
    sorting: { onSortChange },
    selection: { onSelectRows, selectedRows },
    hiding: { hiddenColumns, onHiddenColumnsChange },
    pinning: { pinnedColumns, onPinnedColumnsChange },
    ordering: { orderedColumns, onOrderedColumnsChange },
    filtering: {
      filters,
      onFiltersChange,
      logicalOperator,
      onLogicalOperatorChange,
    },
  });

  const rowHeight = TABLE_ROW_HEIGHTS[density] ?? TABLE_ROW_HEIGHTS.comfortable;

  const verticalMaxHeight = TABLE_HEADER_HEIGHT + perPage * rowHeight;

  const bodyMinHeight = perPage * rowHeight;

  const {
    ref: tableScrollRef,
    getRightOffset,
    isFirstPinned,
  } = useTablePinnedColumns({
    columns: displayedColumns,
    pinnedColumns,
  });

  const pinningColumns: TablePinningProps<Row> = {
    pinnableColumns,
    pinnedColumns,
    createTogglePinColumnHandler,
    getRightOffset,
    isFirstPinned,
  };

  const csvFileName = csv?.fileName || "table";

  const csvRows = csv?.getRows
    ? csv.getRows(rows)
    : selectable && selectedRows.size > 0
      ? [...selectedRows.values()]
      : rows;

  const csvColumns = columns.filter(
    (column) =>
      column.type !== "actions" &&
      (csv?.includeHiddenColumns || !hiddenColumns.has(column.name)),
  );

  const csvDisabled = csvRows.length === 0 || csvColumns.length === 0;

  const handleCopyCsv = async () => {
    const content = buildCsv(csvRows, csvColumns, "\t");

    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");

      await navigator.clipboard.writeText(content);

      toast.success("Copied as tab-separated values");
    } catch {
      toast.error("Could not copy");
    }
  };

  const handleDownloadCsv = () => {
    const content = `\uFEFF${buildCsv(csvRows, csvColumns)}`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${csvFileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("CSV downloaded");
  };

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
        selection={{ selectedRows, onSelectRows, getSelectionLabel }}
        filtering={{ filterUtils }}
        density={{
          density,
          onDensityChange: setTableDensity,
        }}
        csv={
          csv && {
            onCopy: handleCopyCsv,
            onDownload: handleDownloadCsv,
            disabled: csvDisabled,
          }
        }
        {...theaderProps}
      />

      <div
        className="relative overflow-x-auto overflow-y-auto w-full max-w-full rounded-lg pb-[5px]"
        style={{ maxHeight: verticalMaxHeight }}
      >
        <table
          ref={tableScrollRef}
          className="w-full min-w-max table-auto border-separate border-spacing-0"
        >
          <TableHead
            data={{ columns: displayedColumns }}
            sorting={{ sortStatuses, createSortClickHandler }}
            selection={{
              selectable,
              selectAll,
              someSelected,
              createSelectRowChangeHandler,
            }}
            filtering={{ createColumnFilterClickHandler }}
            pinning={pinningColumns}
            density={densityPadding}
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
            selection={{
              selectable,
              selectedRows,
              createSelectRowChangeHandler,
              onSelectRows,
            }}
            loading={{ loading: isLoading, scLoading }}
            pinning={pinningColumns}
            density={densityPadding}
            bodyMinHeight={bodyMinHeight}
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
          loadMore,
        }}
      />
    </TableContainer>
  );
}

export default Table;
