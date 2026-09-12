import { FilterBoard, type useFilter } from "../filter";
import type {
  UseTableCreateToggleColumnsClickHandler,
  UseTableSelectedRows,
} from "../hooks/useTable";
import type { TableRowRecord, TableColumn } from "../Table";
import TableMenuColumns from "./TableMenuColumns";

export type TableHeaderNonHideableColumns = {
  hideableColumns: false;

  hiddenColumns?: never;

  onReset?: never;

  createToggleColumnsClickHandler?: never;
};

export type TableHeaderHideableColumns<Row extends TableRowRecord> = {
  hideableColumns: true;

  hiddenColumns: Set<TableColumn<Row>["name"]>;

  onReset: () => void;

  createToggleColumnsClickHandler: UseTableCreateToggleColumnsClickHandler<Row>;
};

export type TableHeaderProps<Row extends TableRowRecord> = (
  TableHeaderNonHideableColumns | TableHeaderHideableColumns<Row>
) & {
  data: {
    columns: TableColumn<Row>[];

    setColumns: React.Dispatch<React.SetStateAction<TableColumn<Row>[]>>;
  };

  selection: {
    selectedRows: UseTableSelectedRows;
  };

  filtering: {
    filterUtils: ReturnType<typeof useFilter>;
  };
};

export default function TableHeader<Row extends TableRowRecord>({
  hideableColumns,
  hiddenColumns,
  onReset,
  createToggleColumnsClickHandler,
  data,
  selection,
  filtering,
}: TableHeaderProps<Row>) {
  const { columns, setColumns } = data;

  const { selectedRows } = selection;

  const { filterUtils } = filtering;

  return (
    <div className="bg-primary-light flex justify-between items-center py-2 px-4">
      <FilterBoard<Row>
        data={{ columns }}
        filtering={{
          filters: filterUtils.filters,
          onAddFilter: filterUtils.addFilter,
          onUpdateFilter: filterUtils.updateFilter,
          onDeleteFilter: filterUtils.deleteFilter,
          logicalOperator: filterUtils.logicalOperator,
          onLogicalOperatorChange: filterUtils.changeLogicalOperator,
        }}
        popup={{
          isOpen: filterUtils.isFilterOpen,
          onOpen: filterUtils.openFilter,
          onClose: filterUtils.closeFilter,
        }}
      />
      {selectedRows.size ? (
        <p className="text-sm">Selected rows: {selectedRows.size}</p>
      ) : (
        <div></div>
      )}
      {hideableColumns && (
        <div>
          <TableMenuColumns
            data={{ columns, setColumns }}
            hiding={{
              onReset,
              createToggleColumnsClickHandler: createToggleColumnsClickHandler,
              hiddenColumns,
            }}
          />
        </div>
      )}
    </div>
  );
}
