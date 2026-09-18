import TableRow, { type TableRowProps } from "./TableRow";
import TableCell, { type TableCellProps } from "./TableCell";
import { cn } from "cn";
import TableOverlay from "./TableOverlay";
import type {
  TableRowRecord,
  TableColumn,
  TableLoadingProps,
  TableRowItem,
  TablePinningProps,
} from "../Table";
import type {
  UseTableSelectedRows,
  UseTableCreateSelectRowChangeHandler,
} from "../hooks/useTable";
import { useTableBody } from "../hooks/useTableBody";
import LinearLoading from "../../loading/LinearLoading";
import Loading from "../../loading/Loading";
import Checkbox from "../../inputs/Checkbox";
import TableActionsCell, { type TableAction } from "./TableActionsCell";

export type TableBodyProps<Row extends TableRowRecord> =
  React.ComponentProps<"tbody"> & {
    data: {
      rows: TableRowItem[];

      columns: TableColumn<Row>[];
    };

    actions?: TableAction<Row>[];

    selection: {
      createSelectRowChangeHandler: UseTableCreateSelectRowChangeHandler;

      selectedRows: UseTableSelectedRows;

      onSelectRows: (selectedRows: UseTableSelectedRows) => void;

      selectable: boolean;
    };

    loading?: TableLoadingProps;

    pinning?: TablePinningProps<Row>;

    /**
     * Cell padding applied to every body cell
     */
    density?: string;

    elements?: {
      /** Body rows; <tr> elements */
      rowProps?: TableRowProps;

      /** Body data cells; <td> elements */
      cellProps?: TableCellProps;

      /** Body selection checkbox cell; <td> element */
      checkboxCellProps?: TableCellProps;
    };
  };

function TableBody<Row extends TableRowRecord>({
  data,
  actions = [],
  selection,
  loading = {},
  pinning,
  density,
  elements = {},
  className,
  ...props
}: TableBodyProps<Row>) {
  const { rows, columns } = data;

  const {
    createSelectRowChangeHandler,
    selectedRows,
    selectable,
    onSelectRows,
  } = selection;

  const { loading: isLoading, scLoading } = loading;

  const { rowProps = {}, cellProps = {}, checkboxCellProps = {} } = elements;

  const {
    createCheckboxChangeHandler,
    createCheckboxMouseDownHandler,
    createRowMouseDownHandler,
    createRowMouseEnterHandler,
    getSelectedAreaBorders,
    noRows,
    getRowValue,
  } = useTableBody({
    data: { rows },
    selection: {
      createSelectRowChangeHandler,
      selectedRows,
      onSelectRows,
    },
  });

  return (
    <tbody
      {...props}
      className={cn(
        " [&>tr[aria-rowindex]:not([aria-rowindex='0']):not([aria-selected='true'])]:border-gray-100/60  [&>tr[aria-rowindex]:not([aria-rowindex='0']):not([aria-selected='true'])]:border-t-[0.833333px] ",
        className,
      )}
    >
      {!isLoading && scLoading ? (
        <tr>
          <td>
            <LinearLoading className="absolute w-full h-[3px]" />
          </td>
        </tr>
      ) : (
        <tr>
          <td>
            <div className="h-[3px]"></div>
          </td>
        </tr>
      )}
      {isLoading || noRows ? (
        <TableOverlay>
          {isLoading ? (
            <Loading />
          ) : (
            <p className="min-w-max text-lg">No data...</p>
          )}
        </TableOverlay>
      ) : (
        rows.map((row, i) => (
          <TableRow
            {...rowProps}
            key={row.id}
            className={cn(
              "hover:bg-gray-100/30 dark:hover:bg-gray-700",
              rowProps.className,
            )}
            aria-rowindex={i}
            aria-selected={selectedRows ? selectedRows.has(row?.id) : false}
          >
            {selectable && (
              <TableCell
                {...cellProps}
                {...checkboxCellProps}
                onMouseEnter={createRowMouseEnterHandler(row)}
                onMouseDown={createRowMouseDownHandler(row)}
                className={cn(
                  cellProps.className,
                  checkboxCellProps.className,
                  "select-none",
                  getSelectedAreaBorders(i, "first"),
                  density,
                )}
              >
                <Checkbox
                  checked={selectedRows.has(row.id)}
                  onChange={createCheckboxChangeHandler(row)}
                  onMouseDown={createCheckboxMouseDownHandler(row)}
                />
              </TableCell>
            )}
            {columns.map(({ bodyCellProps = {}, className, ...column }, ci) => {
              const isPinned = pinning
                ? pinning.pinnedColumns.has(column.name)
                : false;

              const right = isPinned
                ? pinning?.getRightOffset(column.name)
                : undefined;

              return (
                <TableCell
                  key={String(column.name)}
                  style={right !== undefined ? { right } : undefined}
                  {...cellProps}
                  {...bodyCellProps}
                  className={cn(
                    isPinned &&
                      cn(
                        "sticky z-[1] bg-card hover:bg-gray-100/30 dark:hover:bg-gray-700",
                        pinning?.isFirstPinned(column.name) &&
                          "border-l-2! border-(--primary)!",
                      ),
                    getSelectedAreaBorders(
                      i,
                      ci === columns.length - 1
                        ? "last"
                        : ci === 0 && !selectable
                          ? "first"
                          : "middle",
                    ),
                    className,
                    cellProps.className,
                    bodyCellProps.className,
                    density,
                  )}
                >
                  {column.type === "actions" ? (
                    <TableActionsCell row={row} actions={actions} />
                  ) : column.getCell ? (
                    column.getCell(getRowValue(row, String(column.name)), row)
                  ) : (
                    getRowValue(row, String(column.name))
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        ))
      )}
    </tbody>
  );
}
export default TableBody;
