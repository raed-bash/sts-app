import { useRef } from "react";
import { useMouseUp } from "@/shared/hooks";
import type { TableRowRecord, TableColumn, TableRowItem } from "../Table";
import { getObjectValue } from "@/shared/utils";
import type {
  UseTableSelectedRows,
  UseTableCreateSelectRowChangeHandler,
} from "./useTable";

export type UseTableBodyOptions = {
  data: {
    rows: TableRowItem[];
  };

  selection: {
    createSelectRowChangeHandler: UseTableCreateSelectRowChangeHandler;

    selectedRows: UseTableSelectedRows;
  };
};

export function useTableBody<Row extends TableRowRecord>({
  data,
  selection,
}: UseTableBodyOptions) {
  const { rows } = data;

  const { createSelectRowChangeHandler, selectedRows } = selection;
  const rowMouseDownRef = useRef(false);

  const changeLikeCheckbox = (row: TableRowItem) => {
    createSelectRowChangeHandler(row)({
      target: {
        name: "",
        checked: !selectedRows.has(row.id),
      },
    });
  };

  const createRowMouseEnterHandler = (row: TableRowItem) => () => {
    if (rowMouseDownRef.current) {
      changeLikeCheckbox(row);
    }
  };

  const createRowMouseDownHandler = (row: TableRowItem) => () => {
    changeLikeCheckbox(row);

    rowMouseDownRef.current = true;
  };

  const getSelectedAreaStyle = (i: number) => {
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

  const createCheckboxChangeHandler =
    (row: TableRowItem) =>
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

      createSelectRowChangeHandler(row)(e);
    };

  const getRowValue = (row: TableRowItem, name: TableColumn<Row>["name"]) => {
    if (Object.prototype.toString.call(row) === "[object Object]") {
      return getObjectValue(row, String(name));
    }

    return row;
  };

  useMouseUp(() => (rowMouseDownRef.current = false));

  const noRows = rows.length === 0;

  return {
    createRowMouseEnterHandler,
    createRowMouseDownHandler,
    getSelectedAreaStyle,
    createCheckboxChangeHandler,
    noRows,
    getRowValue,
  };
}
