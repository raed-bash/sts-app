import type {
  TableRowRecord,
  TableColumn,
  TableFilteringProps,
  TableOrderingProps,
  TableRowItem,
  TableSelectionProps,
} from "../Table";
import { useEffect, useState } from "react";
import { useFilter } from "../filter/hooks/useFilter";
import { getAvailableFilterOps } from "../filter";
import type {
  SortButtonEventHandler,
  SortButtonStatus,
} from "../../buttons/SortButton";
import type { SyntheticEvent } from "@/shared/utils";

export type UseTableCreateToggleColumnsClickHandler<Row extends TableRowRecord> = (
  column: TableColumn<Row>,
) => React.MouseEventHandler<HTMLButtonElement>;

export type UseTableCreateSortClickHandler<Row extends TableRowRecord> = (
  column: TableColumn<Row>,
) => SortButtonEventHandler;

export type UseTableCreateColumnFilterClickHandler<Row extends TableRowRecord> = (
  column: TableColumn<Row>,
) => () => void;

export type UseTableSelectedRows = Set<string | number>;

export type UseTableSortChangeHandler<Row extends TableRowRecord> = (
  name: TableColumn<Row>["name"],
  sortStatus: SortButtonStatus,
) => void;

export type UseTableSelectRowsHandler = (
  selectedRows: UseTableSelectedRows,
) => void;

export type UseTableCreateSelectRowChangeHandler = (
  row?: TableRowItem,
) => (e: SyntheticEvent) => void;

export type UseTableOptions<Row extends TableRowRecord> = {
  data: {
    rows: TableRowItem[];

    originalColumns: TableColumn<Row>[];
  };

  sorting: {
    onSortChange: UseTableSortChangeHandler<Row>;
  };

  selection: TableSelectionProps;

  hiding: {
    hiddenColumns?: Set<TableColumn<Row>["name"]>;

    onHiddenColumnsChange: (hiddenColumns: Set<TableColumn<Row>["name"]>) => void;
  };

  ordering: TableOrderingProps<Row>;

  filtering: TableFilteringProps;
};

export function useTable<Row extends TableRowRecord>({
  data,
  sorting,
  selection,
  hiding,
  ordering,
  filtering,
}: UseTableOptions<Row>) {
  const { rows, originalColumns } = data;

  const { onSortChange } = sorting;

  const { onSelectRows, selectedRows } = selection;

  const {
    hiddenColumns: hiddenColumnsExt,
    onHiddenColumnsChange: onHiddenColumnsChangeExt,
  } = hiding;

  const { onOrderedColumnsChange, orderedColumns } = ordering;

  const { filters, onFiltersChange, logicalOperator, onLogicalOperatorChange } =
    filtering;
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
    onHiddenColumnsChangeExt(defaultHiddenCols);
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

    onHiddenColumnsChangeExt(newHiddenColumns);
  };

  const selectAll = rows.length ? selectedRows.size === rows.length : false;

  useEffect(() => {
    onOrderedColumnsChange(columns.map((column) => column.name));
  }, [columns, onOrderedColumnsChange]);

  const filterUtils = useFilter({
    filters,
    onFiltersChange,
    logicalOperator,
    onLogicalOperatorChange,
  });

  const createColumnFilterClickHandler: UseTableCreateColumnFilterClickHandler<
    Row
  > = (column: TableColumn<Row>) => () => {
    const filterProps = column?.filterProps;

    const ops = getAvailableFilterOps(filterProps?.type || "text");

    filterUtils.addFilter({
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
