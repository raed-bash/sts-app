import TableRow, { type TableRowProps } from "./TableRow";
import TableCell, { type TableCellProps } from "./TableCell";
import { cn } from "cn";
import TableOverlay from "./TableOverlay";
import type {
  TableRowRecord,
  TableColumn,
  TableLoadingProps,
  TableRowItem,
} from "../Table";
import type {
  UseTableSelectedRows,
  UseTableCreateSelectRowChangeHandler,
} from "../hooks/useTable";
import { useTableBody } from "../hooks/useTableBody";
import LinearLoading from "../../skeleton/LinearLoading";
import Loading from "../../skeleton/Loading";
import Checkbox from "../../inputs/Checkbox";

export type TableBodyProps<Row extends TableRowRecord> =
  React.ComponentProps<"tbody"> & {
    data: {
      rows: TableRowItem[];

      columns: TableColumn<Row>[];
    };

    selection: {
      createSelectRowChangeHandler: UseTableCreateSelectRowChangeHandler;

      selectedRows: UseTableSelectedRows;

      selectable: boolean;
    };

    loading?: TableLoadingProps;

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
  selection,
  loading = {},
  elements = {},
  className,
  ...props
}: TableBodyProps<Row>) {
  const { rows, columns } = data;

  const { createSelectRowChangeHandler, selectedRows, selectable } = selection;

  const { loading: isLoading, scLoading } = loading;

  const {
    rowProps = {},
    cellProps = {},
    checkboxCellProps = {},
  } = elements;

  const {
    createCheckboxChangeHandler,
    createRowMouseDownHandler,
    createRowMouseEnterHandler,
    getSelectedAreaStyle,
    noRows,
    getRowValue,
  } = useTableBody({
    data: { rows },
    selection: { createSelectRowChangeHandler, selectedRows },
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
              getSelectedAreaStyle(i),
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
                  `select-none`,
                )}
              >
                <Checkbox
                  checked={selectedRows.has(row.id)}
                  onChange={createCheckboxChangeHandler(row)}
                />
              </TableCell>
            )}
            {columns.map(({ bodyCellProps = {}, className, ...column }) => (
              <TableCell
                key={String(column.name)}
                {...cellProps}
                {...bodyCellProps}
                className={cn(
                  className,
                  cellProps.className,
                  bodyCellProps.className,
                )}
              >
                {column.getCell
                  ? column.getCell(getRowValue(row, String(column.name)), row)
                  : getRowValue(row, String(column.name))}
              </TableCell>
            ))}
          </TableRow>
        ))
      )}
    </tbody>
  );
}
export default TableBody;
