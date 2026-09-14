import { useLayoutEffect, useRef, useState } from "react";
import type { TableColumn, TableRowRecord } from "../Table";

export type UseTablePinnedColumnsOptions<Row extends TableRowRecord> = {
  columns: TableColumn<Row>[];

  pinnedColumns: Set<TableColumn<Row>["name"]>;
};

export type UseTablePinnedColumnsReturn<Row extends TableRowRecord> = {
  ref: React.Ref<HTMLTableElement>;

  getRightOffset: (name: TableColumn<Row>["name"]) => number | undefined;
};

export function useTablePinnedColumns<Row extends TableRowRecord>({
  columns,
  pinnedColumns,
}: UseTablePinnedColumnsOptions<Row>): UseTablePinnedColumnsReturn<Row> {
  const ref = useRef<HTMLTableElement | null>(null);

  const [widths, setWidths] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    const table = ref.current;

    if (!table) return;

    const measureAll = () => {
      const next: Record<string, number> = {};

      table
        .querySelectorAll<HTMLTableCellElement>("th[data-pinned]")
        .forEach((element) => {
          const name = element.getAttribute("data-pinned");

          if (name && pinnedColumns.has(name)) {
            next[name] = element.getBoundingClientRect().width;
          }
        });

      setWidths((prev) => {
        let changed = Object.keys(next).length !== Object.keys(prev).length;

        if (!changed) {
          for (const name of Object.keys(next)) {
            if (next[name] !== prev[name]) {
              changed = true;
              break;
            }
          }
        }

        return changed ? next : prev;
      });
    };

    measureAll();

    const targets = Array.from(
      table.querySelectorAll<HTMLTableCellElement>("th[data-pinned]"),
    );

    const observer = new ResizeObserver(measureAll);

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [columns, pinnedColumns]);

  const pinnedColumnNames = columns
    .filter((column) => pinnedColumns.has(column.name))
    .map((column) => String(column.name));

  const rightOffsets: Record<string, number> = {};

  let acc = 0;

  for (let i = pinnedColumnNames.length - 1; i >= 0; i--) {
    rightOffsets[pinnedColumnNames[i]] = acc;
    acc += widths[pinnedColumnNames[i]] ?? 0;
  }

  return {
    ref,

    getRightOffset: (name: TableColumn<Row>["name"]) =>
      pinnedColumns.has(name) ? rightOffsets[String(name)] : undefined,
  };
}
