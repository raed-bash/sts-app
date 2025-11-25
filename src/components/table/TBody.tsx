import Loading from "../skeleton/Loading";
import Tr, { type TrProps } from "./Tr";
import Td, { type TdProps } from "./Td";
import LinearLoading from "../skeleton/LinearLoading";
import { cn } from "src/utils/cn";
import type { EventTarget } from "src/utils/EventTarget";
import TOverlay from "./TOverlay";
import useTBodyUtils from "./hooks/useTBodyUtils";
import type { TableColumn, TableRow } from "./Table";

export type TBodyProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  rows: TableRow[];

  columns: TableColumn[];

  selectedRows: Set<number>;

  // __test__
  onSelectRow: (row: TableRow) => (e: EventTarget<any>) => void;
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

function TBody({
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
}: TBodyProps) {
  const {
    handleCheckBoxChange,
    handleMouseDown,
    handleMouseEnter,
    handleSelectArea,
    noRows,
    getRowValue,
  } = useTBodyUtils({ onSelectRow, rows, selectedRows });

  return (
    <tbody {...props} className={cn("", className)}>
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
            <p className="min-w-max text-xl">لا يوجد بيانات...</p>
          )}
        </TOverlay>
      ) : (
        rows.map((row, i) => (
          <Tr
            {...tbrProps}
            key={row.id}
            className={cn(
              (i & 1) === 1 ? "bg-primary-light" : "bg-secondary-main",
              tbrProps.className,
              handleSelectArea(i)
            )}
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
                  `select-none`
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedRows.has(row.id)}
                  className="w-5 h-5 max-lg:w-4 max-lg:h-4"
                  onChange={handleCheckBoxChange(row)}
                />
              </Td>
            )}
            {columns.map(({ tbdProps = {}, className, ...column }) => (
              <Td
                key={column.name}
                {...tbdsProps}
                {...tbdProps}
                className={cn(
                  className,
                  tbdsProps.className,
                  tbdProps.className
                )}
              >
                {column.getCell
                  ? column.getCell(getRowValue(row, column.name), row)
                  : getRowValue(row, column.name)}
              </Td>
            ))}
          </Tr>
        ))
      )}
    </tbody>
  );
}
export default TBody;
