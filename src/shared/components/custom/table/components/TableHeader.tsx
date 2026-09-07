import { FilterBoard, type useFilter } from "../filter";
import type {
  UseTableCreateToggleColumnsClickHandler,
  UseTableSelectedRows,
} from "../hooks/useTable";
import type { RowType, TableColumn } from "../Table";
import TableMenuColumns from "./TableMenuColumns";

export type TableHeaderNoHiddenColumns = {
  hideableColumns: false;

  hiddenColumns?: never;

  onReset?: never;

  createToggleColumnsClickHandler?: never;
};

export type TableHeaderHiddenColumns<Row extends RowType> = {
  hideableColumns: true;

  hiddenColumns: Set<TableColumn<Row>["name"]>;

  onReset: () => void;

  createToggleColumnsClickHandler: UseTableCreateToggleColumnsClickHandler<Row>;
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
  onReset,
  createToggleColumnsClickHandler,
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
          <TableMenuColumns
            onReset={onReset}
            createToggleColumnsClickHandler={createToggleColumnsClickHandler}
            hiddenColumns={hiddenColumns}
            columns={columns}
            setColumns={setColumns}
          />
        </div>
      )}
    </div>
  );
}
