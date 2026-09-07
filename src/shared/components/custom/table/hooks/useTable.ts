import type { RowType, TableColumn, TableRowType } from "../Table";
import { useEffect, useState } from "react";
import {
  useFilter,
  type FilterItem,
  type UseFilterSetStateFiltersAction,
} from "../filter/hooks/useFilter";
import { getAvailableFilterOps } from "../filter";
import type {
  SortButtonEventHandler,
  SortButtonStatus,
} from "../../buttons/SortButton";
import type { SyntheticEvent } from "@/shared/utils";

export type UseTableCreateToggleColumnsClickHandler<Row extends RowType> = (
  column: TableColumn<Row>,
) => React.MouseEventHandler<HTMLButtonElement>;

export type UseTableCreateSortClickHandler<Row extends RowType> = (
  column: TableColumn<Row>,
) => SortButtonEventHandler;

export type UseTableCreateColumnFilterClickHandler<Row extends RowType> = (
  column: TableColumn<Row>,
) => () => void;

export type UseTableSelectedRows = Set<string | number>;

export type UseTableSortChangeEventAction<Row extends RowType> = (
  name: TableColumn<Row>["name"],
  sortStatus: SortButtonStatus,
) => void;

export type UseTableSelectRowsSelectEventAction = (
  selectedRows: UseTableSelectedRows,
) => void;

export type UseTableCreateSelectRowChangeHandler = (
  row?: TableRowType,
) => (e: SyntheticEvent) => void;

export type UseTableOptions<Row extends RowType> = {
  originalColumns: TableColumn<Row>[];

  rows: TableRowType[];

  onSortChange: UseTableSortChangeEventAction<Row>;

  onSelectRows: UseTableSelectRowsSelectEventAction;

  selectedRows: UseTableSelectedRows;

  setHiddenColumns: (hiddenColumns: Set<TableColumn<Row>["name"]>) => void;

  hiddenColumns?: Set<TableColumn<Row>["name"]>;

  orderedColumns: TableColumn<Row>["name"][];

  setOrderedColumns: (orderedColumns: TableColumn<Row>["name"][]) => void;

  filters: FilterItem[];

  setFilters?: UseFilterSetStateFiltersAction;
};

export function useTable<Row extends RowType>({
  originalColumns,
  rows,
  onSortChange,
  onSelectRows,
  selectedRows,
  hiddenColumns: hiddenColumnsExt,
  setHiddenColumns: setHiddenColumnsExt,
  setOrderedColumns,
  orderedColumns,
  filters,
  setFilters,
}: UseTableOptions<Row>) {
  const [prevOriginalColumns, setPrevOriginalColumns] =
    useState(originalColumns);
  const [columns, setColumns] = useState(() => {
    if (orderedColumns.length === 0) return originalColumns;

    return [...originalColumns].sort(
      (a, b) => orderedColumns.indexOf(a.name) - orderedColumns.indexOf(b.name),
    );
  });

  if (originalColumns !== prevOriginalColumns) {
    setPrevOriginalColumns(originalColumns);
    setColumns(
      orderedColumns.length === 0
        ? originalColumns
        : [...originalColumns].sort(
            (a, b) =>
              orderedColumns.indexOf(a.name) - orderedColumns.indexOf(b.name),
          ),
    );
  }

  const createSortClickHandler: UseTableCreateSortClickHandler<Row> =
    (column) => (sortStatus) => {
      onSortChange(column.name, sortStatus);
    };

  const createSelectRowChangeHandler: UseTableCreateSelectRowChangeHandler =
    (row) => (e) => {
      const name = e.target.name;
      const checked = e.target.checked;

      if (name === "selectAll") {
        if (checked) {
          const newSelectedRows = new Set<number>();

          rows.forEach((row) => {
            newSelectedRows.add(row.id);
          });

          onSelectRows(newSelectedRows);
        } else {
          onSelectRows(new Set());
        }

        return;
      }

      if (!row) return;

      const newSelectedRows = new Set(selectedRows);

      if (checked) {
        newSelectedRows.add(row.id);
      } else {
        newSelectedRows.delete(row.id);
      }

      onSelectRows(newSelectedRows);
    };

  const defaultHiddenCols = new Set(
    columns.filter((column) => column.hidden).map((column) => column.name),
  );

  const [hiddenColumns, setHiddenColumns] = useState(
    hiddenColumnsExt || defaultHiddenCols,
  );

  const resetHiddenColumns = () => {
    setHiddenColumns(defaultHiddenCols);
    setHiddenColumnsExt(defaultHiddenCols);
  };

  const displayedColumns = columns
    .filter((column) => !hiddenColumns.has(column.name))
    .map((column) => column);

  const createToggleColumnsClickHandler: UseTableCreateToggleColumnsClickHandler<
    Row
  > = (column: TableColumn<Row>) => () => {
    const newHiddenColumns = new Set(hiddenColumns);

    if (hiddenColumns.has(column.name)) {
      newHiddenColumns.delete(column.name);
    } else {
      newHiddenColumns.add(column.name);
    }

    setHiddenColumns(newHiddenColumns);

    setHiddenColumnsExt(newHiddenColumns);
  };

  const selectAll = rows.length ? selectedRows.size === rows.length : false;

  useEffect(() => {
    setOrderedColumns(columns.map((column) => column.name));
  }, [columns, setOrderedColumns]);

  const filterUtils = useFilter({ filters, setFilters });

  const createColumnFilterClickHandler: UseTableCreateColumnFilterClickHandler<
    Row
  > = (column: TableColumn<Row>) => () => {
    const filterProps = column?.filterProps;

    const ops = getAvailableFilterOps(filterProps?.type || "text");

    filterUtils.pushFilter({
      name: column.name.toString(),
      operation: ops[0],
      value: undefined,
    });

    filterUtils.openFilter();
  };

  return {
    createSortClickHandler,
    createSelectRowChangeHandler,
    selectAll,
    resetHiddenColumns,
    createToggleColumnsClickHandler,
    displayedColumns,
    columns,
    setColumns,
    filterUtils,
    createColumnFilterClickHandler,
  };
}
