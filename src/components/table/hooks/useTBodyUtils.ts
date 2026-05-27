import { useRef } from "react";
import useMouseUp from "src/hooks/useMouseUp";
import type { RowType, TableColumn, TableRow } from "../Table";
import { getObjectValue } from "src/utils/getObjectValue";
import type {
  UseTableUtilsSelectedRows,
  UseTableUtilsSelectRowEventHandler,
} from "./useTableUtils";

export type UseTBodyUtilsOptions = {
  onSelectRow: UseTableUtilsSelectRowEventHandler;

  selectedRows: UseTableUtilsSelectedRows;

  rows: TableRow[];
};

export default function useTBodyUtils<Row extends RowType>({
  onSelectRow,
  selectedRows,
  rows,
}: UseTBodyUtilsOptions) {
  const rowMouseDownRef = useRef(false);

  const changeLikeCheckBox = (row: TableRow) => {
    onSelectRow(row)({
      target: {
        checked: !selectedRows.has(row.id),
      },
    });
  };

  const handleMouseEnter = (row: TableRow) => () => {
    if (rowMouseDownRef.current) {
      changeLikeCheckBox(row);
    }
  };

  const handleMouseDown = (row: TableRow) => () => {
    changeLikeCheckBox(row);

    rowMouseDownRef.current = true;
  };

  const handleSelectArea = (i: number) => {
    const currentRowId = rows?.[i]?.id;
    const isCurrRowSelected = selectedRows.has(currentRowId);

    if (!isCurrRowSelected) return "";

    const prevRowId = rows?.[i - 1]?.id;
    const isPrevRowSelected = selectedRows.has(prevRowId);

    const nextRowId = rows?.[i + 1]?.id;
    const isNextRowSelected = selectedRows.has(nextRowId);

    const style = `border-r-[2px] border-l-[2px] border-solid border-blue-500 `;

    return (
      style +
      `${!isPrevRowSelected ? "border-t-[2px]" : ""} ${
        !isNextRowSelected ? "border-b-[2px]" : ""
      } `
    );
  };

  const handleCheckBoxChange =
    (row: TableRow) =>
    (
      e: React.ChangeEvent<HTMLInputElement> & {
        nativeEvent: {
          pointerType: string;
        };
      }
    ) => {
      if (
        e.nativeEvent.pointerType === "mouse" ||
        e.nativeEvent.pointerType === "touch"
      )
        return;
      onSelectRow(row)(e);
    };

  const getRowValue = (row: TableRow, name: TableColumn<Row>["name"]) => {
    if (Object.prototype.toString.call(row) === "[object Object]") {
      return getObjectValue(row, String(name));
    }

    return row;
  };

  useMouseUp(() => (rowMouseDownRef.current = false));

  const noRows = rows.length === 0;

  return {
    handleMouseEnter,
    handleMouseDown,
    handleSelectArea,
    handleCheckBoxChange,
    noRows,
    getRowValue,
  };
}
