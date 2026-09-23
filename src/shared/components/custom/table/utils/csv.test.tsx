import { describe, expect, it } from "vitest";
import { buildCsv, escapeCsvField, getCsvCellValue } from "./csv";

type Row = Record<string, any>;

describe("escapeCsvField", () => {
  it("returns an empty string for nullish values", () => {
    expect(escapeCsvField(null)).toBe("");
    expect(escapeCsvField(undefined)).toBe("");
  });

  it("leaves plain values untouched", () => {
    expect(escapeCsvField("plain")).toBe("plain");
    expect(escapeCsvField(42)).toBe("42");
  });

  it("quotes fields containing the separator", () => {
    expect(escapeCsvField("a,b")).toBe('"a,b"');
  });

  it("doubles embedded quotes", () => {
    expect(escapeCsvField('say "hi"')).toBe('"say ""hi"""');
  });

  it("quotes fields containing line breaks", () => {
    expect(escapeCsvField("line1\nline2")).toBe('"line1\nline2"');
  });
});

describe("getCsvCellValue", () => {
  it("returns the raw value by default", () => {
    const column = { name: "username", headerName: "users:username" };

    expect(getCsvCellValue(column, { username: "basha" })).toBe("basha");
  });

  it("prefers an explicit getCellValue", () => {
    const column = {
      name: "status",
      headerName: "users:status",
      getCellValue: () => "ACTIVE",
    };

    expect(getCsvCellValue(column, {})).toBe("ACTIVE");
  });

  it("uses string/number/boolean cells directly", () => {
    const column = {
      name: "status",
      headerName: "users:status",
      getCell: (value: string) => value.toUpperCase(),
    };

    expect(getCsvCellValue(column, { status: "active" })).toBe("ACTIVE");
  });

  it("extracts text out of rendered elements", () => {
    const column = {
      name: "role",
      headerName: "users:role",
      getCell: () => <strong>SUPER_ADMIN</strong>,
    };

    expect(getCsvCellValue(column, {})).toBe("SUPER_ADMIN");
  });

  it("returns an empty string for nullish rendered cells", () => {
    const column = {
      name: "role",
      headerName: "users:role",
      getCell: () => null,
    };

    expect(getCsvCellValue(column, {})).toBe("");
  });
});

describe("buildCsv", () => {
  it("builds a CSV from columns and rows", () => {
    const columns = [
      { name: "username", headerName: "common:actions.edit" },
      { name: "role", headerName: "common:fields.role" },
    ];

    const rows: Row[] = [
      { username: "basha", role: "SUPER_ADMIN" },
      { username: "john, doe", role: "TEACHER" },
    ];

    const csv = buildCsv(rows, columns);

    expect(csv).toBe('Edit,Role\r\nbasha,SUPER_ADMIN\r\n"john, doe",TEACHER');
  });

  it("honors a custom separator", () => {
    const columns = [{ name: "id", headerName: "id" }];

    const csv = buildCsv([{ id: 1 }], columns, ";");

    expect(csv).toBe("id\r\n1");
  });
});
