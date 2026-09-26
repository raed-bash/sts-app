import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TableColumn, TableRowRecord } from "../Table";
import { translateHeader } from "../utils/translate-header";
import {
  getDropIndex,
  getDropSlotFromY,
  getPreviewIndex,
  getPreviewShifts,
  getRowPitch,
  moveItem,
  type DragRowRect,
} from "../utils/column-reorder";

const DRAG_THRESHOLD = 4;

export type ListedColumn<Row extends TableRowRecord> = {
  column: TableColumn<Row>;
  originalIndex: number;
};

export type UseColumnReorderParams<Row extends TableRowRecord> = {
  columns: TableColumn<Row>[];

  setColumns: React.Dispatch<React.SetStateAction<TableColumn<Row>[]>>;

  listedColumns: ListedColumn<Row>[];

  onToggle: (
    column: TableColumn<Row>,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => void;
};

export type UseColumnReorder<Row extends TableRowRecord> = {
  status: string;

  dropLineRef: React.RefObject<HTMLDivElement | null>;

  ghostRef: React.RefObject<HTMLDivElement | null>;

  getRowProps: (
    listed: ListedColumn<Row>,
    filteredIndex: number,
  ) => Pick<
    React.ComponentPropsWithRef<"button">,
    | "ref"
    | "onClick"
    | "onKeyDown"
    | "onPointerDown"
    | "onPointerMove"
    | "onPointerUp"
    | "onPointerCancel"
  >;
};

export function useColumnReorder<Row extends TableRowRecord>({
  columns,
  setColumns,
  listedColumns,
  onToggle,
}: UseColumnReorderParams<Row>): UseColumnReorder<Row> {
  const { t } = useTranslation();

  const [status, setStatus] = useState("");

  const ghostRef = useRef<HTMLDivElement>(null);
  const dropLineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const drag = useRef({
    active: false,
    fromOriginalIndex: -1,
    fromFilteredIndex: -1,
    toSlot: -1,
    offsetY: 0,
    startY: 0,
    didMove: false,
    suppressClick: false,
    rows: [] as (DragRowRect & { left: number; width: number })[],
    pitch: 0,
  });

  const getRow = (filteredIndex: number) => {
    const name = String(listedColumns[filteredIndex]?.column.name ?? "");

    return rowRefs.current.get(name) ?? null;
  };

  const measureRows = () => {
    const rows = listedColumns.map((_, index) => {
      const rect = getRow(index)?.getBoundingClientRect();

      return {
        top: rect?.top ?? 0,
        height: rect?.height ?? 0,
        left: rect?.left ?? 0,
        width: rect?.width ?? 0,
      };
    });

    drag.current.rows = rows;
    drag.current.pitch = getRowPitch(rows);
  };

  const showDropLine = (toSlot: number, visible: boolean) => {
    const line = dropLineRef.current;
    if (!line) return;

    if (visible) {
      line.style.transition = "";
      line.style.transform = `translateY(${drag.current.pitch * getPreviewIndex(drag.current.fromFilteredIndex, toSlot)}px)`;
      line.setAttribute("data-visible", "true");

      return;
    }

    line.setAttribute("data-visible", "false");
    line.style.transition = "opacity 150ms";
    line.style.transform = "translateY(0px)";
  };

  const previewReorder = (toSlot: number) => {
    const { fromFilteredIndex, pitch } = drag.current;

    const shifts = getPreviewShifts(
      fromFilteredIndex,
      toSlot,
      listedColumns.length,
    );

    listedColumns.forEach((_, index) => {
      const row = getRow(index);
      if (!row) return;

      row.style.transform = `translateY(${shifts[index] * pitch}px)`;
    });
  };

  const clearPreview = () => {
    rowRefs.current.forEach((row) => {
      row.removeAttribute("data-dragging");

      row.style.transition = "none";
      row.style.transform = "translateY(0px)";
    });

    showDropLine(0, false);

    requestAnimationFrame(() => {
      rowRefs.current.forEach((row) => {
        row.style.transition = "";
      });
    });
  };

  const commitReorder = (fromOriginalIndex: number, toSlot: number) => {
    const dropIndex = getDropIndex(
      listedColumns.map(({ originalIndex }) => originalIndex),
      fromOriginalIndex,
      toSlot,
    );

    if (dropIndex === -1 || dropIndex === fromOriginalIndex) return;

    setColumns((prev) => moveItem(prev, fromOriginalIndex, dropIndex));

    setStatus(
      t("table.columnMovedTo", {
        header: translateHeader(columns[fromOriginalIndex]?.headerName ?? ""),
        position: dropIndex + 1,
        total: columns.length,
      }),
    );
  };

  const endDrag = () => {
    drag.current.active = false;

    if (ghostRef.current) ghostRef.current.style.display = "none";

    clearPreview();
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    originalIndex: number,
    filteredIndex: number,
  ) => {
    if (e.pointerId) e.currentTarget.setPointerCapture?.(e.pointerId);

    const rect = e.currentTarget.getBoundingClientRect();

    drag.current = {
      active: true,
      fromOriginalIndex: originalIndex,
      fromFilteredIndex: filteredIndex,
      toSlot: -1,
      offsetY: e.clientY - rect.top,
      startY: e.clientY,
      didMove: false,
      suppressClick: false,
      rows: [],
      pitch: 0,
    };

    measureRows();

    if (ghostRef.current) {
      ghostRef.current.textContent = translateHeader(
        listedColumns[filteredIndex]?.column.headerName ?? "",
      );

      Object.assign(ghostRef.current.style, {
        display: "none",
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        left: `${rect.left}px`,
        top: `${rect.top}px`,
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current.active) return;

    if (!drag.current.didMove) {
      if (Math.abs(e.clientY - drag.current.startY) <= DRAG_THRESHOLD) return;

      drag.current.didMove = true;
      drag.current.suppressClick = true;

      if (ghostRef.current) ghostRef.current.style.display = "flex";

      getRow(drag.current.fromFilteredIndex)?.setAttribute(
        "data-dragging",
        "true",
      );
    }

    if (ghostRef.current) {
      ghostRef.current.style.top = `${e.clientY - drag.current.offsetY}px`;
    }

    const toSlot = getDropSlotFromY(
      e.clientY,
      drag.current.rows,
      drag.current.toSlot,
    );

    if (toSlot === drag.current.toSlot) return;

    drag.current.toSlot = toSlot;

    previewReorder(toSlot);
    showDropLine(toSlot, true);
  };

  const handlePointerUp = () => {
    if (!drag.current.active) return;

    const { fromOriginalIndex, toSlot, didMove } = drag.current;

    endDrag();

    if (!didMove) return;

    commitReorder(fromOriginalIndex, toSlot);
  };

  const handlePointerCancel = () => {
    if (!drag.current.active) return;

    endDrag();
  };

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    column: TableColumn<Row>,
  ) => {
    if (drag.current.suppressClick) {
      drag.current.suppressClick = false;

      return;
    }

    onToggle(column, e);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    originalIndex: number,
    filteredIndex: number,
  ) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

    const target = filteredIndex + (e.key === "ArrowDown" ? 1 : -1);

    if (target < 0 || target >= listedColumns.length) return;

    e.preventDefault();

    if (e.altKey)
      commitReorder(originalIndex, e.key === "ArrowDown" ? target + 1 : target);
    else getRow(target)?.focus();
  };

  return {
    status,

    dropLineRef,
    ghostRef,

    getRowProps: ({ column, originalIndex }, filteredIndex) => ({
      ref: (el: HTMLButtonElement | null) => {
        const key = String(column.name);

        if (el) rowRefs.current.set(key, el);
        else rowRefs.current.delete(key);
      },
      onClick: (e: React.MouseEvent<HTMLButtonElement>) =>
        handleClick(e, column),
      onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) =>
        handleKeyDown(e, originalIndex, filteredIndex),
      onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) =>
        handlePointerDown(e, originalIndex, filteredIndex),
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    }),
  };
}
