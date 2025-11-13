import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Loading from "../skeleton/Loading";
import Row from "./Row";
import BodyCell from "./BodyCell";
import LinearLoading from "../skeleton/LinearLoading";
import { twMerge } from "tailwind-merge";
/**
 * @typedef tableProps
 * @type {import("./Table").tableProps}
 */

/**
 * @typedef headerCellProps
 * @type {import('./HeaderCell').headerCellProps}
 */

/**
 * @typedef bodyCellProps
 * @type {import("./BodyCell").bodyCellProps}
 */

/**
 * @typedef utils
 * @property {boolean} loading
 * @property {boolean} secondaryLoading
 * @property {any[]} rows
 * @property {tableProps['columns']} columns
 * @property {import("./Row").rowProps} bodyRowProps
 * @property {boolean} selectable
 * @property {tableProps['selectedRows']} selectedRows
 * @property {(row:any)=>(e:React.ChangeEvent<HTMLInputElement>)=>void} handleSelectRow
 * @property {import("./BodyCell").bodyCellsProps} bodyCellsProps
 * @property {import("./BodyCell").bodyCheckboxCellProps} bodyCheckboxCellProps
 * @property {headerCellProps|bodyCellProps} cellsProps
 * @property {headerCellProps|bodyCellProps} checkboxCellProps
 */

/**
 * @typedef bodyProps
 * @type {React.HTMLAttributes<HTMLTableSectionElement> & utils}
 */

/**
 * @param {bodyProps} props
 */
function Body({
  loading,
  rows,
  columns,
  bodyRowProps = { className: "" },
  handleSelectRow,
  selectedRows,
  selectable,
  secondaryLoading,
  className = "",
  bodyCellsProps = { className: "" },
  bodyCheckboxCellProps = { className: "" },
  cellsProps = { className: "" },
  checkboxCellProps = { className: "" },
  ...props
}) {
  const [rowMouseDown, setRowMouseDown] = useState(false);

  const changeLikeCheckBox = useCallback(
    (row) => {
      handleSelectRow(row)({
        target: {
          checked: !selectedRows.has(row.id),
        },
      });
    },
    [selectedRows, handleSelectRow]
  );

  const handleMouseEnter = useCallback(
    (row) => () => {
      if (rowMouseDown) {
        changeLikeCheckBox(row);
      }
    },
    [rowMouseDown, changeLikeCheckBox]
  );

  const handleMouseDown = useCallback(
    (row) => () => {
      changeLikeCheckBox(row);

      setRowMouseDown(true);
    },
    [changeLikeCheckBox]
  );

  const handleSelectArea = useCallback(
    (i) => {
      const currentRowId = rows?.[i]?.id;
      const isCurrRowSelected = selectedRows.has(currentRowId);

      if (!isCurrRowSelected) return "";

      const prevRowId = rows?.[i - 1]?.id;
      const isPrevRowSelected = selectedRows.has(prevRowId);

      const nextRowId = rows?.[i + 1]?.id;
      const isNextRowSelected = selectedRows.has(nextRowId);

      let style = `border-r-[3px] border-l-[3px] border-solid border-primary-main `;

      return (
        style +
        `${!isPrevRowSelected ? "border-t-[3px]" : ""} ${
          !isNextRowSelected ? "border-b-[3px]" : ""
        } `
      );
    },
    [rows, selectedRows]
  );

  useEffect(() => {
    const handleMouseUp = () => {
      setRowMouseDown(false);
    };
    window.addEventListener("mouseup", handleMouseUp);

    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleCheckBoxChange = useCallback(
    (row) => (e) => {
      if (
        e.nativeEvent.pointerType === "mouse" ||
        e.nativeEvent.pointerType === "touch"
      )
        return;

      handleSelectRow(row)(e);
    },
    [handleSelectRow]
  );

  const classNameMemo = useMemo(() => twMerge(``, className), [className]);
  return (
    <tbody {...props} className={classNameMemo}>
      {!loading && secondaryLoading ? (
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
      {loading || rows.length === 0 ? (
        <tr>
          <td className="h-96">
            <div className="flex justify-center items-center absolute top-1/2 rtl:right-1/2 ltr:left-1/2 ltr:-translate-x-1/2 ltr:-translate-y-1/2 rtl:translate-x-1/2 rtl:translate-y-1/2 w-fit">
              {loading ? (
                <Loading />
              ) : (
                <p className="min-w-max text-xl">لا يوجد بيانات...</p>
              )}
            </div>
          </td>
        </tr>
      ) : (
        rows.map((row, i) => {
          const selectedRow = selectedRows.has(row.id);

          return (
            <Row
              {...bodyRowProps}
              key={row.id}
              className={
                ((i & 1) === 1 ? "bg-primary-light" : "bg-secondary-main") +
                " " +
                bodyRowProps.className +
                "  " +
                handleSelectArea(i)
              }
            >
              {selectable && (
                <BodyCell
                  {...bodyCellsProps}
                  {...checkboxCellProps}
                  {...bodyCheckboxCellProps}
                  onMouseEnter={handleMouseEnter(row)}
                  onMouseDown={handleMouseDown(row)}
                  className={`${bodyCellsProps.className} ${checkboxCellProps.className} ${bodyCheckboxCellProps.className} select-none`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRow}
                    className="w-5 h-5 max-lg:w-4 max-lg:h-4"
                    onChange={handleCheckBoxChange(row)}
                  />
                </BodyCell>
              )}
              {columns.map(
                ({
                  bodyCellProps = { className: "" },
                  props = { className: "" },
                  className = "",
                  ...column
                }) => (
                  <BodyCell
                    key={column.name}
                    {...cellsProps}
                    {...props}
                    {...bodyCellsProps}
                    {...bodyCellProps}
                    className={`${className} ${cellsProps.className} ${props.className} ${bodyCellsProps.className} ${bodyCellProps.className}`}
                  >
                    {column.getCell
                      ? column.getCell(row, row[column.name])
                      : row[column.name]}
                  </BodyCell>
                )
              )}
            </Row>
          );
        })
      )}
    </tbody>
  );
}
export default memo(Body);
