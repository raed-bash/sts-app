import TableRow, { type TableRowProps } from "./TableRow";
import TableCell, { type TableCellProps } from "./TableCell";
import { cn } from "cn";
import TableOverlay from "./TableOverlay";
import type { RowType, TableColumn, TableRowType } from "../Table";
import type {
  UseTableSelectedRows,
  UseTableCreateSelectRowChangeHandler,
} from "../hooks/useTable";
import { useTableBody } from "../hooks/useTableBody";
import LinearLoading from "../../skeleton/LinearLoading";
import Loading from "../../skeleton/Loading";
import Checkbox from "../../inputs/Checkbox";

export type TableBodyProps<Row extends RowType> =
  React.ComponentProps<"tbody"> & {
    rows: TableRowType[];

    columns: TableColumn<Row>[];

    selectedRows: UseTableSelectedRows;

    createSelectRowChangeHandler: UseTableCreateSelectRowChangeHandler;
    /**
     * A table body row props; <tr></tr> element
     */
    tbrProps?: TableRowProps;
    /**
     * A table body data props; <td></td> element
     */
    tbdsProps?: TableCellProps;

    loading?: boolean;

    scLoading?: boolean;

    selectable?: boolean;

    tdCheckboxProps?: TableCellProps;

    className?: string;
  };

function TableBody<Row extends RowType>({
  loading,
  rows,
  columns,
  tbrProps = {},
  createSelectRowChangeHandler,
  selectedRows,
  selectable,
  scLoading,
  className,
  tbdsProps = {},
  tdCheckboxProps = {},
  ...props
}: TableBodyProps<Row>) {
  const {
    createCheckboxChangeHandler,
    createRowMouseDownHandler,
    createRowMouseEnterHandler,
    getSelectedAreaStyle,
    noRows,
    getRowValue,
  } = useTableBody({
    createSelectRowChangeHandler,
    rows,
    selectedRows,
  });

  return (
    <tbody
      {...props}
      className={cn(
        " [&>tr[aria-rowindex]:not([aria-rowindex='0']):not([aria-selected='true'])]:border-gray-100/60  [&>tr[aria-rowindex]:not([aria-rowindex='0']):not([aria-selected='true'])]:border-t-[0.833333px] ",
        className,
      )}
    >
      {!loading && scLoading ? (
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
      {loading || noRows ? (
        <TableOverlay>
          {loading ? (
            <Loading />
          ) : (
            <p className="min-w-max text-lg">No data...</p>
          )}
        </TableOverlay>
      ) : (
        rows.map((row, i) => (
          <TableRow
            {...tbrProps}
            key={row.id}
            className={cn(
              "hover:bg-gray-100/30 dark:hover:bg-gray-700",
              tbrProps.className,
              getSelectedAreaStyle(i),
            )}
            aria-rowindex={i}
            aria-selected={selectedRows ? selectedRows.has(row?.id) : false}
          >
            {selectable && (
              <TableCell
                {...tbdsProps}
                {...tdCheckboxProps}
                onMouseEnter={createRowMouseEnterHandler(row)}
                onMouseDown={createRowMouseDownHandler(row)}
                className={cn(
                  tbdsProps.className,
                  tdCheckboxProps.className,
                  `select-none`,
                )}
              >
                <Checkbox
                  checked={selectedRows.has(row.id)}
                  onChange={createCheckboxChangeHandler(row)}
                />
              </TableCell>
            )}
            {columns.map(({ tbdProps = {}, className, ...column }) => (
              <TableCell
                key={String(column.name)}
                {...tbdsProps}
                {...tbdProps}
                className={cn(
                  className,
                  tbdsProps.className,
                  tbdProps.className,
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
