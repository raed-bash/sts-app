import Loading from "../skeleton/Loading";
import Tr, { type TrProps } from "./Tr";
import Td, { type TdProps } from "./Td";
import LinearLoading from "../skeleton/LinearLoading";
import { cn } from "src/utils/cn";
import TOverlay from "./TOverlay";
import { useTBodyUtils } from "./hooks/useTBodyUtils";
import type { RowType, TableColumn, TableRow } from "./Table";
import Checkbox from "../inputs/Checkbox";
import type {
  UseTableUtilsSelectedRows,
  UseTableUtilsSelectRowEventHandler,
} from "./hooks/useTableUtils";

export type TBodyProps<Row extends RowType> =
  React.HTMLAttributes<HTMLTableSectionElement> & {
    rows: TableRow[];

    columns: TableColumn<Row>[];

    selectedRows: UseTableUtilsSelectedRows;

    onSelectRow: UseTableUtilsSelectRowEventHandler;
    /**
     * A table body row props; <tr></tr> element
     */
    tbrProps?: TrProps;
    /**
     * A table body data props; <td></td> element
     */
    tbdsProps?: TdProps;

    loading?: boolean;

    scLoading?: boolean;

    selectable?: boolean;

    tdCheckboxProps?: TdProps;

    className?: string;
  };

function TBody<Row extends RowType>({
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
}: TBodyProps<Row>) {
  const {
    handleCheckBoxChange,
    handleMouseDown,
    handleMouseEnter,
    handleSelectArea,
    noRows,
    getRowValue,
  } = useTBodyUtils({ onSelectRow, rows, selectedRows });

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
        <TOverlay>
          {loading ? (
            <Loading />
          ) : (
            <p className="min-w-max text-lg">No data...</p>
          )}
        </TOverlay>
      ) : (
        rows.map((row, i) => (
          <Tr
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
              <Td
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
              </Td>
            )}
            {columns.map(({ tbdProps = {}, className, ...column }) => (
              <Td
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
              </Td>
            ))}
          </Tr>
        ))
      )}
    </tbody>
  );
}
export default TBody;
