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
import { useTranslation } from "react-i18next";
import { Inbox, SearchX } from "lucide-react";
import { Button } from "../../../ui/button";
import { getPrimaryAction } from "../utils/primary-action";

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

    onRowClick?: (row: Row) => void;

    getRowClassName?: (row: Row) => string | undefined;

    /** Empty-state context: were the rows filtered away? */
    empty?: { filtered: boolean; onClearFilters: () => void };

    pinning?: TablePinningProps<Row>;

    /**
     * Cell padding applied to every body cell
     */
    density?: string;

    /**
     * Minimum height (px) the body area should occupy. Applied to the
     * loading/empty overlay so the table doesn't change height once data loads.
     */
    bodyMinHeight?: number;

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
  onRowClick,
  getRowClassName,
  empty,
  pinning,
  density,
  bodyMinHeight,
  elements = {},
  className,
  ...props
}: TableBodyProps<Row>) {
  const { rows, columns } = data;

  const { t } = useTranslation();

  const {
    createSelectRowChangeHandler,
    selectedRows,
    selectable,
    onSelectRows,
  } = selection;

  const { loading: isLoading, scLoading } = loading;

  const { rowProps = {}, cellProps = {}, checkboxCellProps = {} } = elements;

  // Row click: explicit handler, else the row's own main action (view > edit).
  const getRowClick = (row: TableRowItem) => {
    if (onRowClick) return () => onRowClick(row as Row);
    const action = getPrimaryAction(actions, row as Row);
    return action ? () => action.onClick(row as Row) : undefined;
  };

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
        "[&>tr[aria-rowindex]:not([aria-rowindex='0'])>td]:border-t [&>tr[aria-rowindex]:not([aria-rowindex='0'])>td]:border-border/60",
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
        <TableOverlay
          colSpan={columns.length + (selectable ? 1 : 0)}
          minHeight={bodyMinHeight}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <div className="flex min-w-max flex-col items-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                {empty?.filtered ? <SearchX /> : <Inbox />}
              </div>
              <p className="text-base font-medium">
                {empty?.filtered ? t("table.noMatches") : t("table.noData")}
              </p>
              {empty?.filtered && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={empty.onClearFilters}
                >
                  {t("table.clearFilters")}
                </Button>
              )}
            </div>
          )}
        </TableOverlay>
      ) : (
        rows.map((row, i) => {
          const rowClick = getRowClick(row);
          return (
            <TableRow
              {...rowProps}
              key={row.id}
              {...(rowClick && {
                tabIndex: 0,
                onClick: (event: React.MouseEvent<HTMLTableRowElement>) => {
                  // clicks on controls inside the row keep their own behaviour
                  if (
                    (event.target as HTMLElement).closest(
                      "button,a,input,label,[role='menuitem'],[role='checkbox']",
                    )
                  )
                    return;
                  rowClick();
                },
                onKeyDown: (
                  event: React.KeyboardEvent<HTMLTableRowElement>,
                ) => {
                  if (
                    event.key === "Enter" &&
                    event.target === event.currentTarget
                  )
                    rowClick();
                },
              })}
              className={cn(
                "transition-colors hover:bg-muted/50",
                rowClick &&
                  "cursor-pointer focus-visible:bg-muted/60 focus-visible:outline-none",
                getRowClassName?.(row),
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
              {columns.map(
                ({ bodyCellProps = {}, className, ...column }, ci) => {
                  const isPinned = pinning
                    ? pinning.pinnedColumns.has(column.name)
                    : false;

                  const right = isPinned
                    ? pinning?.getRightOffset(column.name)
                    : undefined;

                  const position =
                    ci === columns.length - 1
                      ? "last"
                      : ci === 0 && !selectable
                        ? "first"
                        : "middle";

                  const rowIsSelected = selectedRows?.has(row.id) ?? false;

                  const suppressPinnedSeparator =
                    rowIsSelected && position === "first" && isPinned;

                  return (
                    <TableCell
                      key={String(column.name)}
                      style={
                        right !== undefined
                          ? { insetInlineEnd: right }
                          : undefined
                      }
                      {...cellProps}
                      {...bodyCellProps}
                      className={cn(
                        isPinned &&
                          cn(
                            "sticky z-[1] bg-card",
                            pinning?.isFirstPinned(column.name) &&
                              !suppressPinnedSeparator &&
                              "border-s border-s-[var(--border)]!",
                          ),
                        getSelectedAreaBorders(i, position),
                        className,
                        cellProps.className,
                        bodyCellProps.className,
                        density,
                      )}
                    >
                      {column.type === "actions" ? (
                        <TableActionsCell row={row} actions={actions} />
                      ) : (
                        <CellContent
                          truncate={column.truncate}
                          value={
                            column.getCell
                              ? column.getCell(
                                  getRowValue(row, String(column.name)),
                                  row,
                                )
                              : getRowValue(row, String(column.name))
                          }
                        />
                      )}
                    </TableCell>
                  );
                },
              )}
            </TableRow>
          );
        })
      )}
    </tbody>
  );
}
/** Empty values read as "—" instead of a blank cell; long text can be cut to one line. */
function CellContent({
  value,
  truncate,
}: {
  value: React.ReactNode;
  truncate?: boolean;
}) {
  if (value === null || value === undefined || value === "")
    return <span className="text-muted-foreground">—</span>;

  if (truncate && (typeof value === "string" || typeof value === "number"))
    return (
      <div className="max-w-[28rem] truncate" title={String(value)}>
        {value}
      </div>
    );

  return <>{value}</>;
}

export default TableBody;
