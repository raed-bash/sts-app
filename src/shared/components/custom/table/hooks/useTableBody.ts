import { useEffect, useRef } from "react";
import { useMouseUp } from "@/shared/hooks";
import { cn } from "cn";
import type { TableColumn, TableRowItem, TableRowRecord } from "../Table";
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

    onSelectRows: (selectedRows: UseTableSelectedRows) => void;
  };
};

export function useTableBody<Row extends TableRowRecord>({
  data,
  selection,
}: UseTableBodyOptions) {
  const { rows } = data;

  const { createSelectRowChangeHandler, selectedRows, onSelectRows } =
    selection;

  const anchorIndexRef = useRef<number | null>(null);

  const bandingRef = useRef(false);

  const getRowIndex = (row: TableRowItem) =>
    rows.findIndex((item) => item.id === row.id);

  const selectRange = (fromIndex: number, toIndex: number) => {
    const [start, end] =
      fromIndex <= toIndex ? [fromIndex, toIndex] : [toIndex, fromIndex];

    const currentPageIds = new Set<TableRowItem["id"]>(
      rows.map((item) => item.id),
    );

    const nextSelectedRows = new Map(
      [...selectedRows].filter(([id]) => !currentPageIds.has(id)),
    );

    rows
      .slice(start, end + 1)
      .forEach((item) => nextSelectedRows.set(item.id, item));

    onSelectRows(nextSelectedRows);
  };

  const toggleRow = (row: TableRowItem) => {
    const nextSelectedRows = new Map(selectedRows);

    if (nextSelectedRows.has(row.id)) {
      nextSelectedRows.delete(row.id);
    } else {
      nextSelectedRows.set(row.id, row);
    }

    onSelectRows(nextSelectedRows);
  };

  const createRowMouseDownHandler =
    (row: TableRowItem) => (e: React.MouseEvent<HTMLTableCellElement>) => {
      const currentIndex = getRowIndex(row);

      if (currentIndex === -1) return;

      if (e.shiftKey) {
        const anchorIndex = anchorIndexRef.current ?? currentIndex;

        selectRange(anchorIndex, currentIndex);

        bandingRef.current = false;

        e.preventDefault();

        return;
      }

      if (e.ctrlKey || e.metaKey) {
        toggleRow(row);

        bandingRef.current = false;

        e.preventDefault();

        return;
      }

      anchorIndexRef.current = currentIndex;

      bandingRef.current = !selectedRows.has(row.id);

      if (bandingRef.current) {
        const currentPageIds = new Set<TableRowItem["id"]>(
          rows.map((item) => item.id),
        );

        const nextSelectedRows = new Map(
          [...selectedRows].filter(([id]) => !currentPageIds.has(id)),
        );

        nextSelectedRows.set(row.id, row);

        onSelectRows(nextSelectedRows);
      }

      e.preventDefault();
    };

  const createRowMouseEnterHandler = (row: TableRowItem) => () => {
    if (!bandingRef.current) return;

    const anchorIndex = anchorIndexRef.current;

    if (anchorIndex === null) return;

    const currentIndex = getRowIndex(row);

    if (currentIndex === -1 || currentIndex === anchorIndex) return;

    selectRange(anchorIndex, currentIndex);
  };

  const createCheckboxMouseDownHandler =
    (row: TableRowItem) => (e: React.MouseEvent<HTMLInputElement>) => {
      const currentIndex = getRowIndex(row);

      if (currentIndex === -1) return;

      e.stopPropagation();
      e.preventDefault();

      if (e.shiftKey) {
        const anchorIndex = anchorIndexRef.current ?? currentIndex;

        selectRange(anchorIndex, currentIndex);

        bandingRef.current = false;

        return;
      }

      if (e.ctrlKey || e.metaKey) {
        toggleRow(row);

        bandingRef.current = false;

        return;
      }

      const selectsRow = !selectedRows.has(row.id);

      anchorIndexRef.current = currentIndex;

      toggleRow(row);

      bandingRef.current = selectsRow;
    };

  const getSelectedAreaBorders = (
    i: number,
    position: "first" | "last" | "middle",
  ) => {
    const isCurrRowSelected = selectedRows.has(rows?.[i]?.id);

    if (!isCurrRowSelected) return "";

    const isPrevRowSelected = selectedRows.has(rows?.[i - 1]?.id);
    const isNextRowSelected = selectedRows.has(rows?.[i + 1]?.id);

    return cn(
      "border-solid border-blue-500",
      position === "first" && "border-l-[2px]",
      position === "last" && "border-r-[2px]",
      !isPrevRowSelected && "border-t-[2px]",
      !isNextRowSelected && "border-b-[2px]",
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

  useMouseUp(() => (bandingRef.current = false));

  useEffect(() => {
    anchorIndexRef.current = null;

    bandingRef.current = false;
  }, [rows]);

  const noRows = rows.length === 0;

  return {
    createRowMouseEnterHandler,
    createRowMouseDownHandler,
    createCheckboxMouseDownHandler,
    getSelectedAreaBorders,
    createCheckboxChangeHandler,
    noRows,
    getRowValue,
  };
}
