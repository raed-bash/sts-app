import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTableBody, type UseTableBodyOptions } from "./useTableBody";
import type { TableRowItem } from "../Table";
import type {
  UseTableSelectedRows,
  UseTableCreateSelectRowChangeHandler,
} from "./useTable";

type Row = TableRowItem & { id: number };

const rows: Row[] = [
  { id: 1, username: "a" },
  { id: 2, username: "b" },
  { id: 3, username: "c" },
  { id: 4, username: "d" },
];

const mouseEvent = (
  mods: { shiftKey?: boolean; ctrlKey?: boolean; metaKey?: boolean } = {},
) =>
  ({
    shiftKey: mods.shiftKey ?? false,
    ctrlKey: mods.ctrlKey ?? false,
    metaKey: mods.metaKey ?? false,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  }) as unknown as React.MouseEvent<HTMLTableCellElement>;

const inputMouseEvent = (mods: { shiftKey?: boolean; ctrlKey?: boolean }) =>
  ({
    shiftKey: mods.shiftKey ?? false,
    ctrlKey: mods.ctrlKey ?? false,
    metaKey: false,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  }) as unknown as React.MouseEvent<HTMLInputElement>;

const makeSelection = (
  selected: number[] = [],
  onSelectRows = vi.fn(),
): UseTableBodyOptions["selection"] => ({
  createSelectRowChangeHandler: vi.fn(() => vi.fn()),
  selectedRows: new Map<number, Row>(
    rows.filter((row) => selected.includes(row.id)).map((row) => [row.id, row]),
  ),
  onSelectRows,
});

const makeOptions = (
  overrides: Partial<UseTableBodyOptions> = {},
): UseTableBodyOptions => ({
  data: { rows },
  selection: makeSelection(),
  ...overrides,
});

const lastCall = (spy: ReturnType<typeof vi.fn>): UseTableSelectedRows =>
  spy.mock.calls.at(-1)![0] as UseTableSelectedRows;

describe("useTableBody", () => {
  it("reports noRows for an empty data set", () => {
    const { result } = renderHook(() =>
      useTableBody(makeOptions({ data: { rows: [] } })),
    );

    expect(result.current.noRows).toBe(true);
  });

  it("resolves nested values through the row object", () => {
    const { result } = renderHook(() => useTableBody(makeOptions()));

    const nested = { profile: { name: "alice" } };

    expect(result.current.getRowValue(nested, "profile.name")).toBe("alice");
    expect(result.current.getRowValue("plain", "anything" as never)).toBe(
      "plain",
    );
  });

  describe("row mousedown", () => {
    it("selects an unselected row on a plain click", () => {
      const onSelectRows = vi.fn();

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({ selection: makeSelection([], onSelectRows) }),
        ),
      );

      const event = mouseEvent();

      result.current.createRowMouseDownHandler(rows[0])(event);

      expect([...lastCall(onSelectRows).keys()]).toEqual([1]);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("keeps off-page selections and drops current-page rows when selecting", () => {
      const onSelectRows = vi.fn();
      const selectedRows = new Map<number, Row>([
        [3, rows[2]],
        [9, { id: 9, username: "off-page" }],
      ]);

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            data: { rows },
            selection: {
              createSelectRowChangeHandler:
                vi.fn() as UseTableCreateSelectRowChangeHandler,
              selectedRows,
              onSelectRows,
            },
          }),
        ),
      );

      result.current.createRowMouseDownHandler(rows[0])(mouseEvent());

      expect([...lastCall(onSelectRows).keys()].sort()).toEqual([1, 9]);
    });

    it("ignores a plain click on an already-selected row", () => {
      const onSelectRows = vi.fn();

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: makeSelection([1], onSelectRows),
          }),
        ),
      );

      result.current.createRowMouseDownHandler(rows[0])(mouseEvent());

      expect(onSelectRows).not.toHaveBeenCalled();
    });

    it("adds a row with ctrl-click", () => {
      const onSelectRows = vi.fn();

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: makeSelection([1], onSelectRows),
          }),
        ),
      );

      result.current.createRowMouseDownHandler(rows[1])(
        mouseEvent({ ctrlKey: true }),
      );

      expect([...lastCall(onSelectRows).keys()]).toEqual([1, 2]);
    });

    it("removes a row with ctrl-click", () => {
      const onSelectRows = vi.fn();

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: makeSelection([1, 2], onSelectRows),
          }),
        ),
      );

      result.current.createRowMouseDownHandler(rows[0])(
        mouseEvent({ ctrlKey: true }),
      );

      expect([...lastCall(onSelectRows).keys()]).toEqual([2]);
    });

    it("selects a range with shift-click anchored at the last plain click", () => {
      const onSelectRows = vi.fn();
      const selectedRows = new Map<number, Row>([[9, { id: 9 }]]);

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: {
              createSelectRowChangeHandler:
                vi.fn() as UseTableCreateSelectRowChangeHandler,
              selectedRows,
              onSelectRows,
            },
          }),
        ),
      );

      result.current.createRowMouseDownHandler(rows[0])(mouseEvent());

      result.current.createRowMouseDownHandler(rows[3])(
        mouseEvent({ shiftKey: true }),
      );

      const next = lastCall(onSelectRows);

      expect([...next.keys()].sort()).toEqual([1, 2, 3, 4, 9]);
    });

    it("selects a band across rows while dragging with the mouse held", () => {
      const onSelectRows = vi.fn();
      const selectedRows = new Map<number, Row>([[9, { id: 9 }]]);

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: {
              createSelectRowChangeHandler:
                vi.fn() as UseTableCreateSelectRowChangeHandler,
              selectedRows,
              onSelectRows,
            },
          }),
        ),
      );

      result.current.createRowMouseDownHandler(rows[0])(mouseEvent());

      result.current.createRowMouseEnterHandler(rows[2])();

      const next = lastCall(onSelectRows);

      expect([...next.keys()].sort()).toEqual([1, 2, 3, 9]);
    });
  });

  describe("checkbox mousedown", () => {
    it("removes a selected row on a plain checkbox click", () => {
      const onSelectRows = vi.fn();

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: makeSelection([1], onSelectRows),
          }),
        ),
      );

      const event = inputMouseEvent({});

      result.current.createCheckboxMouseDownHandler(rows[0])(event);

      expect([...lastCall(onSelectRows).keys()]).toEqual([]);
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it("selects an unselected row on a plain checkbox click", () => {
      const onSelectRows = vi.fn();

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: makeSelection([], onSelectRows),
          }),
        ),
      );

      result.current.createCheckboxMouseDownHandler(rows[1])(
        inputMouseEvent({}),
      );

      expect([...lastCall(onSelectRows).keys()]).toEqual([2]);
    });

    it("selects a range on shift-click", () => {
      const onSelectRows = vi.fn();

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: makeSelection([], onSelectRows),
          }),
        ),
      );

      result.current.createCheckboxMouseDownHandler(rows[0])(
        inputMouseEvent({}),
      );

      result.current.createCheckboxMouseDownHandler(rows[2])(
        inputMouseEvent({ shiftKey: true }),
      );

      expect([...lastCall(onSelectRows).keys()].sort()).toEqual([1, 2, 3]);
    });
  });

  describe("checkbox change", () => {
    const pointerEvent = (pointerType: string) =>
      ({
        nativeEvent: { pointerType },
      }) as unknown as React.ChangeEvent<HTMLInputElement> & {
        nativeEvent: { pointerType: string };
      };

    it("ignores pointer inputs because mousedown already handled them", () => {
      const createSelectRowChangeHandler = vi.fn();

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: {
              createSelectRowChangeHandler,
              selectedRows: new Map(),
              onSelectRows: vi.fn(),
            },
          }),
        ),
      );

      result.current.createCheckboxChangeHandler(rows[0])(
        pointerEvent("mouse"),
      );
      result.current.createCheckboxChangeHandler(rows[0])(
        pointerEvent("touch"),
      );

      expect(createSelectRowChangeHandler).not.toHaveBeenCalled();
    });

    it("forwards keyboard-driven changes to the shared handler", () => {
      const createSelectRowChangeHandler = vi.fn(() => vi.fn());

      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: {
              createSelectRowChangeHandler,
              selectedRows: new Map(),
              onSelectRows: vi.fn(),
            },
          }),
        ),
      );

      const event = pointerEvent("keyboard");

      result.current.createCheckboxChangeHandler(rows[0])(event);

      expect(createSelectRowChangeHandler).toHaveBeenCalledWith(rows[0]);
    });
  });

  describe("getSelectedAreaBorders", () => {
    it("returns nothing for unselected rows", () => {
      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: makeSelection([1, 2]),
          }),
        ),
      );

      expect(result.current.getSelectedAreaBorders(2, "first")).toBe("");
    });

    it("marks the first selected row with a start border", () => {
      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: makeSelection([1, 2]),
          }),
        ),
      );

      const borders = result.current.getSelectedAreaBorders(0, "first");

      expect(borders).toContain("border-s-[2px]");
      expect(borders).toContain("border-t-[2px]");
    });

    it("marks the last row of the band with an end border", () => {
      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: makeSelection([1, 2, 3]),
          }),
        ),
      );

      const borders = result.current.getSelectedAreaBorders(2, "last");

      expect(borders).toContain("border-e-[2px]");
      expect(borders).toContain("border-b-[2px]");
    });

    it("keeps band edges open between adjacent selected rows", () => {
      const { result } = renderHook(() =>
        useTableBody(
          makeOptions({
            selection: makeSelection([1, 2, 3]),
          }),
        ),
      );

      const middle = result.current.getSelectedAreaBorders(1, "middle");

      expect(middle).not.toContain("border-t-");
      expect(middle).not.toContain("border-b-");
    });
  });
});
