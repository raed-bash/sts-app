import React, { useMemo, useRef, useState } from "react";
import Menu from "../menu/Menu";
import InputIcon from "../inputs/InputIcon";
import Button from "../buttons/Button";
import SearchIcon from "src/assets/icons/search.svg?react";
import type { RowType, TableColumn } from "./Table";
import Checkbox from "../inputs/Checkbox";

export type MenuHideColumnsProps<Row extends RowType> = {
  columns: TableColumn<Row>[];
  onReset: React.MouseEventHandler<HTMLButtonElement>;
  handleToggleColumns: (
    column: TableColumn<Row>
  ) => React.MouseEventHandler<HTMLButtonElement>;
  hiddenColumns: Set<TableColumn<Row>["name"]>;
  setColumns: React.Dispatch<React.SetStateAction<TableColumn<Row>[]>>;
};

function MenuHideColumns<Row extends RowType>({
  columns,
  onReset,
  handleToggleColumns,
  hiddenColumns,
  setColumns,
}: MenuHideColumnsProps<Row>) {
  const [searchMenuCols, setSearchMenuCols] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const drag = useRef({
    active: false,
    fromOriginalIndex: -1,
    fromFilteredIndex: -1,
    toFilteredIndex: -1,
    offsetY: 0,
    startY: 0,
    didMove: false,
    suppressClick: false,
  });

  const filteredColumns = useMemo(
    () =>
      columns
        .map((column, originalIndex) => ({ column, originalIndex }))
        .filter(({ column }) =>
          column.headerName.toLowerCase().includes(searchMenuCols.toLowerCase())
        ),
    [columns, searchMenuCols]
  );

  const getFilteredIndexFromY = (y: number): number => {
    const children = containerRef.current
      ? (Array.from(containerRef.current.children) as HTMLElement[])
      : [];

    for (let i = 0; i < children.length; i++) {
      const { top, height } = children[i].getBoundingClientRect();
      if (y < top + height / 2) return i;
    }
    return Math.max(0, children.length - 1);
  };

  const setButtonAttr = (name: string, attr: string, val: string | null) => {
    const el = buttonRefs.current.get(name);
    if (!el) return;

    if (val === null) return el.removeAttribute(attr);
    else el.setAttribute(attr, val);
  };

  const clearAllDragStyles = () => {
    buttonRefs.current.forEach((el) => {
      el.removeAttribute("data-dragging");
      el.removeAttribute("data-drag-over");
    });
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    originalIndex: number,
    filteredIndex: number
  ) => {
    if (e.pointerId) e.currentTarget.setPointerCapture(e.pointerId);

    const rect = e.currentTarget.getBoundingClientRect();

    drag.current = {
      active: true,
      fromOriginalIndex: originalIndex,
      fromFilteredIndex: filteredIndex,
      toFilteredIndex: filteredIndex,
      offsetY: e.clientY - rect.top,
      startY: e.clientY,
      didMove: false,
      suppressClick: false,
    };

    if (ghostRef.current) {
      ghostRef.current.textContent =
        filteredColumns[filteredIndex]?.column.headerName ?? "";

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

    const movedEnough = Math.abs(e.clientY - drag.current.startY) > 4;

    if (!drag.current.didMove) {
      if (!movedEnough) return;
      drag.current.didMove = true;
      drag.current.suppressClick = true;

      if (ghostRef.current) ghostRef.current.style.display = "flex";

      const fromName = String(
        filteredColumns[drag.current.fromFilteredIndex]?.column.name ?? ""
      );
      setButtonAttr(fromName, "data-dragging", "true");
    }

    if (ghostRef.current) {
      ghostRef.current.style.top = `${e.clientY - drag.current.offsetY}px`;
    }

    const newFilteredIdx = getFilteredIndexFromY(e.clientY);

    if (newFilteredIdx !== drag.current.toFilteredIndex) {
      const oldName = String(
        filteredColumns[drag.current.toFilteredIndex]?.column.name ?? ""
      );
      setButtonAttr(oldName, "data-drag-over", null);

      drag.current.toFilteredIndex = newFilteredIdx;

      if (newFilteredIdx !== drag.current.fromFilteredIndex) {
        const newName = String(
          filteredColumns[newFilteredIdx]?.column.name ?? ""
        );
        setButtonAttr(newName, "data-drag-over", "true");
      }
    }
  };

  const handlePointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;

    if (ghostRef.current) ghostRef.current.style.display = "none";
    clearAllDragStyles();

    const { fromOriginalIndex, fromFilteredIndex, toFilteredIndex, didMove } =
      drag.current;

    if (didMove && fromFilteredIndex !== toFilteredIndex) {
      const toOriginalIndex =
        filteredColumns[toFilteredIndex]?.originalIndex ?? -1;
      if (toOriginalIndex !== -1) {
        setColumns((prev) => {
          const next = [...prev];

          const [removed] = next.splice(fromOriginalIndex, 1);

          next.splice(toOriginalIndex, 0, removed);

          return next;
        });
      }
    }
  };

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    column: TableColumn<Row>
  ) => {
    if (drag.current.suppressClick) {
      drag.current.suppressClick = false;
      return;
    }

    handleToggleColumns(column)(e);
  };

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setSearchMenuCols(e.target.value);

  return (
    <Menu>
      <InputIcon
        placeholder="Search..."
        EndIcon={(props) => (
          <SearchIcon
            {...props}
            className={`dark:stroke-(--text) ${props.className}`}
          />
        )}
        inputFrameProps={{ className: "rounded-md h-8" }}
        className="w-30 text-[14px]"
        containerProps={{ className: "pt-2" }}
        onChange={handleSearchChange}
      />

      {/* Floating ghost — follows the cursor, rendered outside the list */}
      <div
        ref={ghostRef}
        className="fixed z-9999 items-center gap-2 rounded text-[13px] px-2 bg-(--primary) text-(--primary-foreground) opacity-90 pointer-events-none select-none"
        style={{ display: "none" }}
      />

      <div ref={containerRef} className="flex flex-col gap-1">
        {filteredColumns.length ? (
          filteredColumns.map(({ column, originalIndex }, filteredIndex) => (
            <button
              key={String(column.name)}
              ref={(el) => {
                const key = String(column.name);
                if (el) buttonRefs.current.set(key, el);
                else buttonRefs.current.delete(key);
              }}
              className={[
                "flex items-center gap-3 rounded text-[13px] px-2 py-1 select-none touch-none cursor-pointer",
                "hover:bg-(--primary) hover:text-(--primary-foreground)",
                "data-[dragging=true]:opacity-30 data-[dragging=true]:border data-[dragging=true]:cursor-grabbing data-[dragging=true]:border-dashed data-[dragging=true]:border-(--primary)",
                "data-[drag-over=true]:bg-(--primary) data-[drag-over=true]:text-(--primary-foreground)",
              ].join(" ")}
              onClick={(e) => handleClick(e, column)}
              onPointerDown={(e) =>
                handlePointerDown(e, originalIndex, filteredIndex)
              }
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <Checkbox
                className="w-4 h-4 cursor-pointer"
                readOnly
                checked={!hiddenColumns.has(column.name)}
                tabIndex={-1}
              />
              {column.headerName}
            </button>
          ))
        ) : (
          <p className="text-gray-400">no columns...</p>
        )}
      </div>

      <Button
        color="primary"
        variant="outlined"
        className="py-2 px-1 text-[13px] border-none shadow-none"
        onClick={onReset}
      >
        Reset
      </Button>
    </Menu>
  );
}

export default MenuHideColumns;
