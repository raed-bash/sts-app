import { useRef } from "react";
import { useMouseUp } from "@/shared/hooks";
import type { RowType, TableColumn, TableRowType } from "../Table";
import { getObjectValue } from "@/shared/utils";
import type {
  UseTableSelectedRows,
  UseTableSelectRowEventHandler,
} from "./useTable";

export type UseTableBodyOptions = {
  onSelectRow: UseTableSelectRowEventHandler;

  selectedRows: UseTableSelectedRows;

  rows: TableRowType[];
};

export function useTableBody<Row extends RowType>({
  onSelectRow,
  selectedRows,
  rows,
}: UseTableBodyOptions) {
  const rowMouseDownRef = useRef(false);

  const changeLikeCheckBox = (row: TableRowType) => {
    onSelectRow(row)({
      target: {
        name: "",
        checked: !selectedRows.has(row.id),
      },
    });
  };

  const handleMouseEnter = (row: TableRowType) => () => {
    if (rowMouseDownRef.current) {
      changeLikeCheckBox(row);
    }
  };

  const handleMouseDown = (row: TableRowType) => () => {
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
    (row: TableRowType) =>
    (
      e: React.ChangeEvent<HTMLInputElement> & {
        nativeEvent: {
          pointerType: string;
        };
      },
    ) => {
      if (
        e.nativeEvent.pointerType === "mouse" ||
        e.nativeEvent.pointerType === "touch"
      )
        return;
      onSelectRow(row)(e);
    };

  const getRowValue = (row: TableRowType, name: TableColumn<Row>["name"]) => {
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
