import type { SortButtonStatus } from "src/components/buttons/SortButton";
import type { RowType, TableColumn, TableRow } from "../Table";
import type {
  THeadSelectRowEventHandler,
  THeadSortEventHandler,
} from "../THead";
import { useState } from "react";

export type UseTableUtilsSortEventHandler<Row extends RowType> = (
  name: TableColumn<Row>["name"],
  sortStatus: SortButtonStatus
) => void;

export type UseTableUtilsSelectRowsEventHandler = (
  selectedRows: Set<number | string>
) => void;

export type UseTableUtilsOptions<Row extends RowType> = {
  columns: TableColumn<Row>[];

  rows: TableRow[];

  onSortChange: UseTableUtilsSortEventHandler<Row>;

  onSelectRows: UseTableUtilsSelectRowsEventHandler;

  selectedRows: Set<number | string>;

  setHiddenColumns: (hiddenColumns: Set<TableColumn<Row>["name"]>) => void;

  hiddenColumns?: Set<TableColumn<Row>["name"]>;
};

export default function useTableUtils<Row extends RowType>({
  columns,
  rows,
  onSortChange,
  onSelectRows,
  selectedRows,
  hiddenColumns: hiddenColumnsExt,
  setHiddenColumns: setHiddenColumnsExt,
}: UseTableUtilsOptions<Row>) {
  const handleSortClick: THeadSortEventHandler<Row> =
    (column) => (sortStatus) => {
      onSortChange(column.name, sortStatus);
    };

  const handleSelectRow: THeadSelectRowEventHandler = (row) => (e) => {
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

  return {
    handleSortClick,
    handleSelectRow,
    selectAll,
    handleResetHiddenColumns,
    displayedColumns,
    handleToggleColumns,
  };
}
