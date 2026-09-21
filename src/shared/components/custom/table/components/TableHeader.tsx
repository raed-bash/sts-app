import { FilterBoard, type useFilter } from "../filter";
import type {
  UseTableCreateToggleColumnsClickHandler,
  UseTableSelectRowsHandler,
  UseTableSelectedRows,
} from "../hooks/useTable";
import type { TableRowRecord, TableColumn } from "../Table";
import type { TableDensityProps } from "./TableDensityButton";
import TableDensityButton from "./TableDensityButton";
import TableMenuColumns from "./TableMenuColumns";
import TableSelectedRows from "./TableSelectedRows";
import TableCsvButton from "./TableCsvButton";

export type TableCsvProps = {
  onCopy: () => void;

  onDownload: () => void;

  disabled?: boolean;
};

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

    onSelectRows: UseTableSelectRowsHandler;

    getSelectionLabel?: (row: Row) => React.ReactNode;
  };

  filtering: {
    filterUtils: ReturnType<typeof useFilter>;
  };

  density: TableDensityProps;

  csv?: TableCsvProps;
};

export default function TableHeader<Row extends TableRowRecord>({
  hideableColumns,
  hiddenColumns,
  onReset,
  createToggleColumnsClickHandler,
  data,
  selection,
  filtering,
  density,
  csv,
}: TableHeaderProps<Row>) {
  const { columns, setColumns } = data;
  const { selectedRows, onSelectRows, getSelectionLabel } = selection;

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
          onClearFilters: filterUtils.clearFilters,
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
        <TableSelectedRows<Row>
          selection={{ selectedRows, onSelectRows, getSelectionLabel }}
        />
      ) : (
        <div></div>
      )}

      <div className="flex items-center gap-2">
        {csv && (
          <TableCsvButton
            onCopy={csv.onCopy}
            onDownload={csv.onDownload}
            disabled={csv.disabled}
          />
        )}
        <TableDensityButton
          density={density.density}
          onDensityChange={density.onDensityChange}
        />
        {hideableColumns && (
          <TableMenuColumns
            data={{ columns, setColumns }}
            hiding={{
              onReset,
              createToggleColumnsClickHandler: createToggleColumnsClickHandler,
              hiddenColumns,
            }}
          />
        )}
      </div>
    </div>
  );
}
