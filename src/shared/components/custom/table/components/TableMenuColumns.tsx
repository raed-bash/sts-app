import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { TableRowRecord, TableColumn } from "../Table";
import { translateHeader } from "../utils/translate-header";
import { useTranslation } from "react-i18next";
import InputIcon from "../../inputs/InputIcon";
import Checkbox from "../../inputs/Checkbox";
import type { UseTableCreateToggleColumnsClickHandler } from "../hooks/useTable";
import { useColumnReorder } from "../hooks/useColumnReorder";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/custom/popover/Popover";
import { Button } from "@/shared/components/ui/button";
import { EllipsisVerticalIcon, GripVerticalIcon, Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "cn";

export type TableMenuColumnsProps<Row extends TableRowRecord> = {
  data: {
    columns: TableColumn<Row>[];

    setColumns: React.Dispatch<React.SetStateAction<TableColumn<Row>[]>>;
  };

  hiding: {
    hiddenColumns: Set<TableColumn<Row>["name"]>;

    createToggleColumnsClickHandler: UseTableCreateToggleColumnsClickHandler<Row>;

    onReset: React.MouseEventHandler<HTMLButtonElement>;
  };
};

function TableMenuColumns<Row extends TableRowRecord>({
  data,
  hiding,
}: TableMenuColumnsProps<Row>) {
  const { columns, setColumns } = data;

  const { hiddenColumns, createToggleColumnsClickHandler, onReset } = hiding;

  const [searchMenuCols, setSearchMenuCols] = useState("");

  const { t } = useTranslation();

  const listedColumns = useMemo(
    () =>
      columns
        .map((column, originalIndex) => ({ column, originalIndex }))
        .filter(({ column }) =>
          translateHeader(column.headerName)
            .toLowerCase()
            .includes(searchMenuCols.toLowerCase()),
        ),
    [columns, searchMenuCols],
  );

  const { status, ghostRef, dropLineRef, getRowProps } = useColumnReorder<Row>({
    columns,
    setColumns,
    listedColumns,
    onToggle: (column, e) => createToggleColumnsClickHandler(column)(e),
  });

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setSearchMenuCols(e.target.value);

  return (
    <Popover>
      <Tooltip>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <Button
                  variant={"ghost"}
                  size={"icon-lg"}
                  aria-label={t("table.showHideColumns")}
                >
                  <EllipsisVerticalIcon size={1000} aria-hidden />
                </Button>
              }
            />
          }
        />
        <TooltipContent>{t("table.showHideColumns")}</TooltipContent>
      </Tooltip>
      <PopoverContent>
        <InputIcon
          placeholder={t("search.placeholder")}
          EndIcon={<Search />}
          onChange={handleSearchChange}
        />

        <div role="status" aria-live="polite" className="sr-only">
          {status}
        </div>

        {createPortal(
          <div
            ref={ghostRef}
            className="fixed z-[60] flex items-center gap-2 rounded text-[13px] px-2 bg-primary text-primary-foreground opacity-90 pointer-events-none select-none"
            style={{ display: "none" }}
          />,
          document.body,
        )}

        <div className="relative">
          <div className="flex flex-col gap-1">
            {listedColumns.length ? (
              listedColumns.map((listed, filteredIndex) => (
                <button
                  key={String(listed.column.name)}
                  {...getRowProps(listed, filteredIndex)}
                  type="button"
                  className={cn(
                    "group flex items-center gap-3 rounded text-[13px] px-2 py-1 select-none touch-none cursor-pointer",
                    "hover:bg-primary hover:text-primary-foreground",
                    "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
                    "transition-transform duration-200 ease-out motion-reduce:transition-none",
                    "data-[dragging=true]:opacity-0 data-[dragging=true]:cursor-grabbing",
                  )}
                >
                  <Checkbox
                    className="w-4 h-4 cursor-pointer"
                    readOnly
                    checked={!hiddenColumns.has(listed.column.name)}
                    tabIndex={-1}
                    aria-hidden
                  />
                  <span className="grow truncate">
                    {translateHeader(listed.column.headerName)}
                  </span>
                  <GripVerticalIcon
                    size={14}
                    aria-hidden
                    className="shrink-0 opacity-40 group-hover:opacity-90"
                  />
                </button>
              ))
            ) : (
              <p className="text-gray-400">{t("table.noColumns")}</p>
            )}
          </div>

          <div
            ref={dropLineRef}
            data-drop-line=""
            data-visible={"false"}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 rounded-full bg-primary opacity-0 transition-[transform,opacity] duration-200 ease-out data-[visible=true]:opacity-100"
          />
        </div>

        <Button variant="outline" onClick={onReset}>
          {t("table.reset")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default TableMenuColumns;
