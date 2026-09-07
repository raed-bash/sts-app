import Loading from "../skeleton/Loading";
import TableRow, { type TableRowProps } from "./TableRow";
import TableCell, { type TableCellProps } from "./TableCell";
import LinearLoading from "../skeleton/LinearLoading";
import { cn } from "cn";
import TableOverlay from "./TableOverlay";
import { useTableBody } from "./hooks/useTableBody";
import type { RowType, TableColumn, TableRowType } from "./Table";
import Checkbox from "../inputs/Checkbox";
import type {
  UseTableSelectedRows,
  UseTableSelectRowEventHandler,
} from "./hooks/useTable";

export type TableBodyProps<Row extends RowType> =
  React.ComponentProps<"tbody"> & {
    rows: TableRowType[];

    columns: TableColumn<Row>[];

    selectedRows: UseTableSelectedRows;

    onSelectRow: UseTableSelectRowEventHandler;
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
  onSelectRow,
  selectedRows,
  selectable,
  scLoading,
  className,
  tbdsProps = {},
  tdCheckboxProps = {},
  ...props
}: TableBodyProps<Row>) {
  const {
    handleCheckBoxChange,
    handleMouseDown,
    handleMouseEnter,
    handleSelectArea,
    noRows,
    getRowValue,
  } = useTableBody({ onSelectRow, rows, selectedRows });

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
              handleSelectArea(i),
            )}
            aria-rowindex={i}
            aria-selected={selectedRows ? selectedRows.has(row?.id) : false}
          >
            {selectable && (
              <TableCell
                {...tbdsProps}
                {...tdCheckboxProps}
                onMouseEnter={handleMouseEnter(row)}
                onMouseDown={handleMouseDown(row)}
                className={cn(
                  tbdsProps.className,
                  tdCheckboxProps.className,
                  `select-none`,
                )}
              >
                <Checkbox
                  checked={selectedRows.has(row.id)}
                  onChange={handleCheckBoxChange(row)}
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
