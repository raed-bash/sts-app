import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { useTablePinnedColumns } from "./useTablePinnedColumns";
import type { TableColumn } from "../Table";

type Row = { id: number; username: string; role: string };

const columns: TableColumn<Row>[] = [
  { name: "id", headerName: "table.id" },
  { name: "username", headerName: "table.username" },
  { name: "role", headerName: "table.role" },
];

type PinnedResult = {
  isFirstPinned: (name: string) => boolean;
  getRightOffset: (name: string) => number | undefined;
};

function Probe({
  pinnedColumns,
  onResult,
}: {
  pinnedColumns: Set<string>;
  onResult: (result: PinnedResult) => void;
}) {
  const { ref, isFirstPinned, getRightOffset } = useTablePinnedColumns<Row>({
    columns,
    pinnedColumns,
  });

  onResult({ isFirstPinned, getRightOffset });

  const isPinned = (name: string) => pinnedColumns.has(name);

  return (
    <table ref={ref}>
      <tbody>
        <tr>
          {columns.map((column) => (
            <th
              key={column.name}
              data-pinned={
                isPinned(String(column.name)) ? String(column.name) : undefined
              }
              data-width={
                isPinned(String(column.name))
                  ? String(column.name === "role" ? 60 : 40)
                  : undefined
              }
            />
          ))}
        </tr>
      </tbody>
    </table>
  );
}

describe("useTablePinnedColumns", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("marks only the first pinned column in display order", () => {
    let captured: PinnedResult | null = null;

    render(
      <Probe
        pinnedColumns={new Set(["username", "role"])}
        onResult={(result) => {
          captured = result;
        }}
      />,
    );

    expect(captured!.isFirstPinned("id")).toBe(false);
    expect(captured!.isFirstPinned("username")).toBe(true);
    expect(captured!.isFirstPinned("role")).toBe(false);
  });

  it("returns no offset for unpinned columns", () => {
    let captured: PinnedResult | null = null;

    render(
      <Probe
        pinnedColumns={new Set(["username"])}
        onResult={(result) => {
          captured = result;
        }}
      />,
    );

    expect(captured!.getRightOffset("id")).toBeUndefined();
    expect(captured!.getRightOffset("role")).toBeUndefined();
  });

  it("accumulates right offsets from the measured pinned widths", () => {
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        return {
          width: Number(this.getAttribute("data-width") || 0),
          height: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        };
      },
    );

    let captured: PinnedResult | null = null;

    render(
      <Probe
        pinnedColumns={new Set(["username", "role"])}
        onResult={(result) => {
          captured = result;
        }}
      />,
    );

    expect(captured!.getRightOffset("role")).toBe(0);
    expect(captured!.getRightOffset("username")).toBe(60);
  });

  it("reacts to an empty pinned set", () => {
    let captured: PinnedResult | null = null;

    render(
      <Probe
        pinnedColumns={new Set()}
        onResult={(result) => {
          captured = result;
        }}
      />,
    );

    expect(captured!.isFirstPinned("id")).toBe(false);
    expect(captured!.getRightOffset("username")).toBeUndefined();
  });
});
