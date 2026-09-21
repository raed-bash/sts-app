import { isValidElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getObjectValue } from "@/shared/utils";
import type { TableColumn, TableRowItem, TableRowRecord } from "../Table";
import { translateHeader } from "./translate-header";

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

    if (rendered === null || rendered === undefined) return "";

    if (
      typeof rendered === "string" ||
      typeof rendered === "number" ||
      typeof rendered === "boolean"
    ) {
      return rendered;
    }

    if (isValidElement(rendered)) {
      return elementToText(rendered);
    }
  }

  return raw;
}

function elementToText(element: ReactElement): string {
  const html = renderToStaticMarkup(element);

  const text = html.replace(/<[^>]*>/g, "");

  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
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
    .map((column) =>
      escapeCsvField(translateHeader(column.headerName), separator),
    )
    .join(separator);

  const body = rows.map((row) =>
    columns
      .map((column) => escapeCsvField(getCsvCellValue(column, row), separator))
      .join(separator),
  );

  return [header, ...body].join("\r\n");
}
