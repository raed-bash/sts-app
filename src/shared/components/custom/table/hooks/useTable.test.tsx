import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  useTable,
  type UseTableOptions,
  type UseTableSortChangeHandler,
} from "./useTable";
import type { TableColumn, TableRowRecord } from "../Table";
import type {
  UseTableSelectRowsHandler,
  UseTableSelectedRows,
} from "./useTable";
import type { SyntheticEvent } from "@/shared/utils";

type Row = TableRowRecord & {
  id: number;
  username: string;
  role: string;
};

const columns: TableColumn<Row>[] = [
  { name: "id", headerName: "table.id" },
  {
    name: "username",
    headerName: "table.username",
    filterable: true,
    filterProps: { type: "text" },
  },
  { name: "role", headerName: "table.role", hidden: true },
];

const rows: Row[] = [
  { id: 1, username: "alice", role: "SUPER_ADMIN" },
  { id: 2, username: "bob", role: "TEACHER" },
];

const event = (name: string, checked: boolean) =>
  ({ target: { name, checked } }) as unknown as SyntheticEvent;

function makeOptions(
  overrides: Partial<UseTableOptions<Row>> = {},
): UseTableOptions<Row> {
  return {
    data: { rows, originalColumns: columns },
    sorting: { onSortChange: vi.fn() },
    selection: {
      selectedRows: new Map<string | number, Row>(),
      onSelectRows: vi.fn(),
    },
    hiding: { onHiddenColumnsChange: vi.fn() },
    pinning: {
      pinnedColumns: new Set<string>(),
      onPinnedColumnsChange: vi.fn(),
    },
    ordering: {
      orderedColumns: [],
      onOrderedColumnsChange: vi.fn(),
    },
    filtering: {
      filters: [],
      onFiltersChange: vi.fn(),
      logicalOperator: "AND",
      onLogicalOperatorChange: vi.fn(),
    },
    ...overrides,
  };
}

describe("useTable", () => {
  it("keeps columns marked hidden out of the displayed set by default", () => {
    const { result } = renderHook(() => useTable(makeOptions()));

    expect(
      result.current.displayedColumns.map((column) => column.name),
    ).toEqual(["id", "username"]);
  });

  it("orders columns by the orderedColumns list", () => {
    const { result } = renderHook(() =>
      useTable(
        makeOptions({
          ordering: {
            orderedColumns: ["username", "id"],
            onOrderedColumnsChange: vi.fn(),
          },
        }),
      ),
    );

    expect(
      result.current.displayedColumns.map((column) => column.name),
    ).toEqual(["username", "id"]);
  });

  it("re-orders columns when the original columns change", () => {
    const onOrderedColumnsChange = vi.fn();

    const { result, rerender } = renderHook(
      ({ options }) => useTable(options),
      {
        initialProps: {
          options: makeOptions({
            hiding: {
              hiddenColumns: new Set(),
              onHiddenColumnsChange: vi.fn(),
            },
          }),
        },
      },
    );

    const reorderedColumns: TableColumn<Row>[] = [
      { name: "role", headerName: "table.role" },
      { name: "id", headerName: "table.id" },
      { name: "username", headerName: "table.username" },
    ];

    rerender({
      options: makeOptions({
        data: { rows, originalColumns: reorderedColumns },
        hiding: { hiddenColumns: new Set(), onHiddenColumnsChange: vi.fn() },
        ordering: {
          orderedColumns: ["role", "id", "username"],
          onOrderedColumnsChange,
        },
      }),
    });

    expect(
      result.current.displayedColumns.map((column) => column.name),
    ).toEqual(["role", "id", "username"]);

    expect(onOrderedColumnsChange).toHaveBeenLastCalledWith([
      "role",
      "id",
      "username",
    ]);
  });

  it("toggles a column in and out of the hidden set", () => {
    const onHiddenColumnsChange = vi.fn();

    const { result } = renderHook(() =>
      useTable(
        makeOptions({
          hiding: { hiddenColumns: new Set(), onHiddenColumnsChange },
        }),
      ),
    );

    act(() =>
      result.current.createToggleColumnsClickHandler(columns[1])(
        {} as React.MouseEvent<HTMLButtonElement>,
      ),
    );

    expect(onHiddenColumnsChange).toHaveBeenLastCalledWith(
      new Set(["username"]),
    );
    expect(result.current.displayedColumns).not.toContainEqual(
      expect.objectContaining({ name: "username" }),
    );

    act(() =>
      result.current.createToggleColumnsClickHandler(columns[1])(
        {} as React.MouseEvent<HTMLButtonElement>,
      ),
    );

    expect(onHiddenColumnsChange).toHaveBeenLastCalledWith(new Set());
    expect(result.current.displayedColumns).toContainEqual(
      expect.objectContaining({ name: "username" }),
    );
  });

  it("resets hidden columns back to the column defaults", () => {
    const onHiddenColumnsChange = vi.fn();

    const { result } = renderHook(() =>
      useTable(
        makeOptions({
          hiding: {
            hiddenColumns: new Set(["id"]),
            onHiddenColumnsChange,
          },
        }),
      ),
    );

    act(() => result.current.resetHiddenColumns());

    expect(onHiddenColumnsChange).toHaveBeenLastCalledWith(new Set(["role"]));
    expect(
      result.current.displayedColumns.map((column) => column.name),
    ).toEqual(["id", "username"]);
  });

  it("toggles pinning and moves pinned columns to the end", () => {
    const onPinnedColumnsChange = vi.fn();
    const options = () =>
      makeOptions({
        hiding: { hiddenColumns: new Set(), onHiddenColumnsChange: vi.fn() },
        pinning: { pinnedColumns: new Set(), onPinnedColumnsChange },
      });

    const { result, rerender } = renderHook(({ opts }) => useTable(opts), {
      initialProps: { opts: options() },
    });

    act(() => result.current.createTogglePinColumnHandler(columns[1])());

    expect(onPinnedColumnsChange).toHaveBeenLastCalledWith(
      new Set(["username"]),
    );

    rerender({
      opts: makeOptions({
        hiding: { hiddenColumns: new Set(), onHiddenColumnsChange: vi.fn() },
        pinning: {
          pinnedColumns: new Set(["username"]),
          onPinnedColumnsChange,
        },
      }),
    });

    expect(
      result.current.displayedColumns.map((column) => column.name),
    ).toEqual(["id", "role", "username"]);
  });

  describe("selection", () => {
    const rowsSelection = (rowsToSelect: number[]): UseTableSelectedRows =>
      new Map(
        rows
          .filter((row) => rowsToSelect.includes(row.id))
          .map((row) => [row.id, row]),
      );

    it("derives selectAll and someSelected from the selected rows", () => {
      const partial = renderHook(() =>
        useTable(
          makeOptions({
            selection: {
              selectedRows: rowsSelection([1]),
              onSelectRows: vi.fn() as UseTableSelectRowsHandler,
            },
          }),
        ),
      );

      expect(partial.result.current.selectAll).toBe(false);
      expect(partial.result.current.someSelected).toBe(true);

      const all = renderHook(() =>
        useTable(
          makeOptions({
            selection: {
              selectedRows: rowsSelection([1, 2]),
              onSelectRows: vi.fn() as UseTableSelectRowsHandler,
            },
          }),
        ),
      );

      expect(all.result.current.selectAll).toBe(true);
      expect(all.result.current.someSelected).toBe(true);
    });

    it("selecting all adds every visible row without dropping other-page rows", () => {
      const onSelectRows = vi.fn();

      const { result } = renderHook(() =>
        useTable(
          makeOptions({
            selection: {
              selectedRows: new Map([
                [9, { id: 9, username: "zeus", role: "STUDENT" }],
              ]),
              onSelectRows,
            },
          }),
        ),
      );

      act(() =>
        result.current.createSelectRowChangeHandler(undefined)(
          event("selectAll", true),
        ),
      );

      const next = onSelectRows.mock.calls[0][0] as UseTableSelectedRows;

      expect([...next.keys()].sort()).toEqual([1, 2, 9]);
    });

    it("clearing the select-all checkbox only removes current page rows", () => {
      const onSelectRows = vi.fn();

      const { result } = renderHook(() =>
        useTable(
          makeOptions({
            selection: {
              selectedRows: new Map([
                [1, rows[0]],
                [2, rows[1]],
                [9, { id: 9, username: "zeus", role: "STUDENT" }],
              ]),
              onSelectRows,
            },
          }),
        ),
      );

      act(() =>
        result.current.createSelectRowChangeHandler(undefined)(
          event("selectAll", false),
        ),
      );

      const next = onSelectRows.mock.calls[0][0] as UseTableSelectedRows;

      expect([...next.keys()]).toEqual([9]);
    });

    it("selects and deselects an individual row", () => {
      const onSelectRows = vi.fn();

      const { result } = renderHook(() =>
        useTable(
          makeOptions({
            selection: {
              selectedRows: new Map(),
              onSelectRows,
            },
          }),
        ),
      );

      act(() =>
        result.current.createSelectRowChangeHandler(rows[0])(
          event("row-1", true),
        ),
      );

      expect([
        ...(onSelectRows.mock.calls[0][0] as UseTableSelectedRows).keys(),
      ]).toEqual([1]);

      act(() =>
        result.current.createSelectRowChangeHandler(rows[0])(
          event("row-1", false),
        ),
      );

      expect((onSelectRows.mock.calls[1][0] as UseTableSelectedRows).size).toBe(
        0,
      );
    });
  });

  describe("filtering and sorting", () => {
    it("adds a filter with the field's first operation and opens the panel", () => {
      const onFiltersChange = vi.fn();

      const { result } = renderHook(() =>
        useTable(
          makeOptions({
            filtering: {
              filters: [],
              onFiltersChange,
              logicalOperator: "AND",
              onLogicalOperatorChange: vi.fn(),
            },
          }),
        ),
      );

      expect(result.current.filterUtils.isFilterOpen).toBe(false);

      act(() => result.current.createColumnFilterClickHandler(columns[1])());

      expect(onFiltersChange).toHaveBeenCalledWith([
        { name: "username", operation: "contains", value: undefined },
      ]);

      expect(result.current.filterUtils.isFilterOpen).toBe(true);
    });

    it("forwards sort changes to the provided handler", () => {
      const onSortChange = vi.fn() as UseTableSortChangeHandler<Row>;

      const { result } = renderHook(() =>
        useTable(makeOptions({ sorting: { onSortChange } })),
      );

      act(() =>
        result.current.createSortClickHandler(columns[0])(
          "asc",
          {} as React.MouseEvent<HTMLButtonElement>,
        ),
      );

      expect(onSortChange).toHaveBeenCalledWith("id", "asc");
    });
  });
});
