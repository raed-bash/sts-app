import { useState } from "react";
import useMouseUp from "src/hooks/useMouseUp";
import type { TableColumn, TableRow } from "../Table";
import type { THeadSelectRowEventHandler } from "../THead";

type UseTBodyUtilsSelectRowHandler = THeadSelectRowEventHandler;

export type UseTBodyUtilsOptions = {
  onSelectRow: UseTBodyUtilsSelectRowHandler;

  selectedRows: Set<string | number>;

  rows: TableRow[];
};

export default function useTBodyUtils({
  onSelectRow,
  selectedRows,
  rows,
}: UseTBodyUtilsOptions) {
  const [rowMouseDown, setRowMouseDown] = useState(false);

  const changeLikeCheckBox = (row: TableRow) => {
    onSelectRow(row)({
      target: {
        checked: !selectedRows.has(row.id),
      },
    });
  };

  const handleMouseEnter = (row: TableRow) => () => {
    if (rowMouseDown) {
      changeLikeCheckBox(row);
    }
  };

  const handleMouseDown = (row: TableRow) => () => {
    changeLikeCheckBox(row);

    setRowMouseDown(true);
  };

  const handleSelectArea = (i: number) => {
    const currentRowId = rows?.[i]?.id;
    const isCurrRowSelected = selectedRows.has(currentRowId);

    if (!isCurrRowSelected) return "";

    const prevRowId = rows?.[i - 1]?.id;
    const isPrevRowSelected = selectedRows.has(prevRowId);

    const nextRowId = rows?.[i + 1]?.id;
    const isNextRowSelected = selectedRows.has(nextRowId);

    const style = `border-r-[3px] border-l-[3px] border-solid border-primary-main `;

    return (
      style +
      `${!isPrevRowSelected ? "border-t-[3px]" : ""} ${
        !isNextRowSelected ? "border-b-[3px]" : ""
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

  const getRowValue = (row: TableRow, name: TableColumn["name"]) => {
    if (Object.prototype.toString.call(row) === "[object Object]") {
      return row[name];
    }

    return row;
  };

  useMouseUp(() => setRowMouseDown(false));

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
