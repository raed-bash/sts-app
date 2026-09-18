import { getObjectValue } from "@/shared/utils";
import type { TableColumn, TableRowItem, TableRowRecord } from "../Table";

export function getCsvCellValue<Row extends TableRowRecord>(
  column: TableColumn<Row>,
  row: TableRowItem,
): unknown {
  const raw = getObjectValue(row, String(column.name));

  if (column.getCellValue) {
    return column.getCellValue(raw, row);
  }

  if (column.getCell) {
    const rendered = column.getCell(raw, row);

    if (
      rendered === null ||
      rendered === undefined ||
      typeof rendered === "string" ||
      typeof rendered === "number" ||
      typeof rendered === "boolean"
    ) {
      return rendered;
    }
  }

  return raw;
}

export function escapeCsvField(value: unknown, separator = ","): string {
  if (value === null || value === undefined) return "";

  const str = String(value).replace(/"/g, '""');

  return str.includes(separator) || /["\n\r]/.test(str) ? `"${str}"` : str;
}

export function buildCsv<Row extends TableRowRecord>(
  rows: TableRowItem[],
  columns: TableColumn<Row>[],
  separator = ",",
): string {
  const header = columns
    .map((column) => escapeCsvField(column.headerName, separator))
    .join(separator);

  const body = rows.map((row) =>
    columns
      .map((column) => escapeCsvField(getCsvCellValue(column, row), separator))
      .join(separator),
  );

  return [header, ...body].join("\r\n");
}

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const COPY_STYLE_PROPS = [
  "display",
  "align-items",
  "justify-content",
  "flex-direction",
  "flex-wrap",
  "gap",
  "padding",
  "margin",
  "color",
  "background-color",
  "font-family",
  "font-size",
  "font-weight",
  "font-style",
  "text-align",
  "text-decoration",
  "border-radius",
  "border-top",
  "border-bottom",
  "opacity",
  "white-space",
] as const;

export function inlineCopyStyles(root: HTMLElement): void {
  const apply = (el: HTMLElement) => {
    const computed = window.getComputedStyle(el);

    for (const prop of COPY_STYLE_PROPS) {
      const value = computed.getPropertyValue(prop);

      if (value && value !== "none") {
        el.style.setProperty(prop, value);
      }
    }
  };

  apply(root);

  root.querySelectorAll<HTMLElement>("*").forEach(apply);
}

export function buildCopyHtml<Row extends TableRowRecord>(
  rows: TableRowItem[],
  columns: TableColumn<Row>[],
  getCellHtml?: (row: TableRowItem, column: TableColumn<Row>) => string | null,
): string {
  const head = columns
    .map((column) => `<th>${escapeHtml(column.headerName)}</th>`)
    .join("");

  const body = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((column) => {
            const rich = getCellHtml?.(row, column);

            return rich
              ? `<td>${rich}</td>`
              : `<td>${escapeHtml(getCsvCellValue(column, row))}</td>`;
          })
          .join("")}</tr>`,
    )
    .join("");

  return `<table>${head ? `<thead><tr>${head}</tr></thead>` : ""}<tbody>${body}</tbody></table>`;
}
