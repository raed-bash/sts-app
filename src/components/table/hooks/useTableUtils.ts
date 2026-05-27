import type { SortButtonStatus } from "src/components/buttons/SortButton";
import type { RowType, TableColumn, TableRow } from "../Table";
import type { THeadSortEventHandler } from "../THead";
import { useEffect, useState } from "react";
import type { EventTarget } from "src/utils/EventTarget";

export type UseTableUtilsSelectedRows = Set<string | number>;

export type UseTableUtilsSortEventHandler<Row extends RowType> = (
  name: TableColumn<Row>["name"],
  sortStatus: SortButtonStatus
) => void;

export type UseTableUtilsSelectRowsEventHandler = (
  selectedRows: UseTableUtilsSelectedRows
) => void;

export type UseTableUtilsSelectRowEventHandler = (
  row?: TableRow
) => (e: EventTarget) => void;

export type UseTableUtilsOptions<Row extends RowType> = {
  originalColumns: TableColumn<Row>[];

  rows: TableRow[];

  onSortChange: UseTableUtilsSortEventHandler<Row>;

  onSelectRows: UseTableUtilsSelectRowsEventHandler;

  selectedRows: UseTableUtilsSelectedRows;

  setHiddenColumns: (hiddenColumns: Set<TableColumn<Row>["name"]>) => void;

  hiddenColumns?: Set<TableColumn<Row>["name"]>;

  orderedColumns: TableColumn<Row>["name"][];

  setOrderedColumns: (orderedColumns: TableColumn<Row>["name"][]) => void;
};

export default function useTableUtils<Row extends RowType>({
  originalColumns,
  rows,
  onSortChange,
  onSelectRows,
  selectedRows,
  hiddenColumns: hiddenColumnsExt,
  setHiddenColumns: setHiddenColumnsExt,
  setOrderedColumns,
  orderedColumns,
}: UseTableUtilsOptions<Row>) {
  const [columns, setColumns] = useState(
    orderedColumns.length > 0
      ? originalColumns.sort(
          (a, b) =>
            orderedColumns.indexOf(a.name) - orderedColumns.indexOf(b.name)
        )
      : originalColumns
  );

  const handleSortClick: THeadSortEventHandler<Row> =
    (column) => (sortStatus) => {
      onSortChange(column.name, sortStatus);
    };

  const handleSelectRow: UseTableUtilsSelectRowEventHandler = (row) => (e) => {
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
    columns.filter((column) => column.hidden).map((column) => column.name)
  );

  const [hiddenColumns, setHiddenColumns] = useState(
    hiddenColumnsExt || defaultHiddenCols
  );

  const handleResetHiddenColumns = () => {
    setHiddenColumns(defaultHiddenCols);
    setHiddenColumnsExt(defaultHiddenCols);
  };

  const displayedColumns = columns
    .filter((column) => !hiddenColumns.has(column.name))
    .map((column) => column);

  const handleToggleColumns = (column: TableColumn<Row>) => () => {
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

  return {
    handleSortClick,
    handleSelectRow,
    selectAll,
    handleResetHiddenColumns,
    displayedColumns,
    handleToggleColumns,
    columns,
    setColumns,
  };
}
