import type { UseTableSelectedRows } from "./hooks/useTable";
import MenuHideColumns, { type MenuHideColumnsProps } from "./MenuHideColumns";
import type { RowType, TableColumn } from "./Table";
import { FilterBoard, useFilter } from "./filter";

export type TableHeaderNoHiddenColumns = {
  hideableColumns: false;

  hiddenColumns?: never;

  handleResetHiddenColumns?: never;

  handleToggleColumns?: never;
};

export type TableHeaderHiddenColumns<Row extends RowType> = {
  hideableColumns: true;

  hiddenColumns: Set<TableColumn<Row>["name"]>;

  handleResetHiddenColumns: () => void;

  handleToggleColumns: MenuHideColumnsProps<Row>["handleToggleColumns"];
};

export type TableHeaderProps<Row extends RowType> = (
  TableHeaderNoHiddenColumns | TableHeaderHiddenColumns<Row>
) & {
  selectedRows: UseTableSelectedRows;
  columns: TableColumn<Row>[];
  setColumns: React.Dispatch<React.SetStateAction<TableColumn<Row>[]>>;
  filterUtils: ReturnType<typeof useFilter>;
};

export default function TableHeader<Row extends RowType>({
  hideableColumns,
  hiddenColumns,
  columns,
  handleResetHiddenColumns,
  handleToggleColumns,
  selectedRows,
  setColumns,
  filterUtils,
}: TableHeaderProps<Row>) {
  return (
    <div className="bg-primary-light flex justify-between items-center py-2 px-4">
      <FilterBoard<Row>
        columns={columns}
        onCloseFilter={filterUtils.closeFilter}
        onOpenFilter={filterUtils.openFilter}
        isFilterOpen={filterUtils.isFilterOpen}
        filters={filterUtils.filters}
        onDeleteFilter={filterUtils.deleteFilter}
        onPushFilter={filterUtils.pushFilter}
        onUpdateFilter={filterUtils.updateFilter}
      />
      {selectedRows.size ? (
        <p className="text-sm">Selected rows: {selectedRows.size}</p>
      ) : (
        <div></div>
      )}
      {hideableColumns && (
        <div>
          <MenuHideColumns
            onReset={handleResetHiddenColumns}
            handleToggleColumns={handleToggleColumns}
            hiddenColumns={hiddenColumns}
            columns={columns}
            setColumns={setColumns}
          />
        </div>
      )}
    </div>
  );
}
