import { useState } from "react";
import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableMenuColumns from "./TableMenuColumns";
import type { TableColumn, TableRowRecord } from "../Table";

type Row = TableRowRecord;

const names = ["a", "b", "c", "d"] as const;

type ColName = (typeof names)[number];

const ROW_HEIGHT = 20;

const headers: Record<ColName, string> = {
  a: "Alpha",
  b: "Bravo",
  c: "Charlie",
  d: "Delta",
};

const defaultColumns: TableColumn<Row>[] = names.map((name) => ({
  strict: false,
  name,
  headerName: headers[name],
}));

const row = (name: ColName) =>
  screen.getByRole("button", { name: headers[name] });

const dropLine = () => document.querySelector<HTMLElement>("[data-drop-line]")!;

const trigger = () =>
  document.querySelector<HTMLButtonElement>('[data-slot="popover-trigger"]')!;

const committedOrder = () => screen.getByTestId("order").textContent;

const searchInput = () => screen.getByPlaceholderText("Search...");

function Harness({ onToggle }: { onToggle?: (name: string) => void }) {
  const [columns, setColumns] = useState(defaultColumns);
  const [hidden, setHidden] = useState<Set<TableColumn<Row>["name"]>>(
    new Set(),
  );

  return (
    <>
      <TableMenuColumns<Row>
        data={{ columns, setColumns }}
        hiding={{
          hiddenColumns: hidden,
          createToggleColumnsClickHandler: (column) => () => {
            onToggle?.(String(column.name));
            setHidden((prev) => new Set(prev).add(column.name));
          },
          onReset: () => {},
        }}
      />

      <div data-testid="order">
        {columns.map((column) => String(column.name)).join(",")}
      </div>
    </>
  );
}

async function openMenu(onToggle?: (name: string) => void) {
  const user = userEvent.setup();

  render(<Harness onToggle={onToggle} />);

  await user.click(trigger());

  return user;
}

const fakeRowLayout = () => {
  names.forEach((name, index) => {
    row(name).getBoundingClientRect = () =>
      ({
        top: index * ROW_HEIGHT,
        height: ROW_HEIGHT,
        bottom: (index + 1) * ROW_HEIGHT,
        left: 0,
        width: 100,
      }) as DOMRect;
  });
};

const yOf = (i: number) => i * ROW_HEIGHT + 2;

const PAST_THE_END = 1e6;

const firePointer = (el: Element, type: string, clientY: number) =>
  el.dispatchEvent(
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: 10,
      clientY,
      pointerId: 1,
      isPrimary: true,
    }),
  );

const dragPointer = (from: ColName, to: number, clientY?: number) => {
  const el = row(from);
  const fromIndex = names.indexOf(from);
  const toY = clientY ?? (to === -1 ? PAST_THE_END : yOf(to));

  act(() => {
    firePointer(el, "pointerdown", yOf(fromIndex));
    firePointer(el, "pointermove", toY);
  });

  return () => act(() => firePointer(el, "pointerup", toY));
};

describe("TableMenuColumns", () => {
  it("toggles a column's visibility on click", async () => {
    const toggles: string[] = [];

    const user = await openMenu((name) => toggles.push(name));

    await user.click(row("b"));

    expect(toggles).toEqual(["b"]);
  });

  it("labels the trigger for screen readers", async () => {
    await openMenu();

    expect(trigger()).toHaveAccessibleName("Show/hide columns");
  });

  describe("pointer reorder", () => {
    it.each<[string, ColName, number, string]>([
      ["downwards", "a", 2, "b,a,c,d"],
      ["upwards", "c", 0, "c,a,b,d"],
      ["to the end", "a", -1, "b,c,d,a"],
      ["onto itself", "b", 1, "a,b,c,d"],
    ])("moves a column %s", async (_label, from, to, expected) => {
      await openMenu();

      fakeRowLayout();

      dragPointer(from, to)();

      expect(committedOrder()).toBe(expected);
    });

    it("reorders within a filtered list, leaving hidden columns in place", async () => {
      const user = await openMenu();

      fakeRowLayout();

      await user.type(searchInput(), "l");

      dragPointer("c", -1)();

      await user.clear(searchInput());

      expect(committedOrder()).toBe("a,b,d,c");
    });

    it("does not toggle visibility after a drag", async () => {
      const toggles: string[] = [];

      await openMenu((name) => toggles.push(name));

      fakeRowLayout();

      dragPointer("a", 2);

      act(() => row("a").click());

      expect(toggles).toEqual([]);
    });

    it("keeps the order and wipes the preview when cancelled", async () => {
      await openMenu();

      fakeRowLayout();

      const el = row("a");

      act(() => {
        firePointer(el, "pointerdown", yOf(0));
        firePointer(el, "pointermove", yOf(2));
        firePointer(el, "pointercancel", yOf(2));
      });

      expect(committedOrder()).toBe("a,b,c,d");
      expect(document.querySelectorAll("[data-dragging]")).toHaveLength(0);
      expect(dropLine().getAttribute("data-visible")).toBe("false");
    });
  });

  describe("drag preview", () => {
    it("offsets the rows to their landing places and points at the drop slot", async () => {
      await openMenu();

      fakeRowLayout();

      const release = dragPointer("a", 2);

      const shifts = Object.fromEntries(
        names.map((name) => [name, row(name).style.transform]),
      );

      expect(row("a")).toHaveAttribute("data-dragging", "true");
      expect(shifts).toEqual({
        a: "translateY(20px)",
        b: "translateY(-20px)",
        c: "translateY(0px)",
        d: "translateY(0px)",
      });
      expect(dropLine().getAttribute("data-visible")).toBe("true");
      expect(dropLine().style.transform).toBe("translateY(20px)");

      release();

      expect(document.querySelectorAll("[data-dragging]")).toHaveLength(0);
      expect(dropLine().getAttribute("data-visible")).toBe("false");
      expect(dropLine().style.transform).toBe("translateY(0px)");
      expect(names.map((name) => row(name).style.transform)).toEqual(
        names.map(() => "translateY(0px)"),
      );
    });

    it("holds the slot while the pointer wobbles on a row boundary", async () => {
      await openMenu();

      fakeRowLayout();

      const el = row("a");

      act(() => {
        firePointer(el, "pointerdown", yOf(0));
        firePointer(el, "pointermove", yOf(2));
      });

      act(() => firePointer(el, "pointermove", 29));
      expect(row("a").style.transform).toBe("translateY(20px)");

      act(() => firePointer(el, "pointermove", 20));
      expect(row("a").style.transform).toBe("translateY(0px)");
      expect(row("b").style.transform).toBe("translateY(0px)");

      act(() => firePointer(el, "pointerup", 20));

      expect(committedOrder()).toBe("a,b,c,d");
    });

    it("keeps the ghost out of the popover, whose transform would offset it", async () => {
      await openMenu();

      const popup = document.querySelector('[data-slot="popover-content"]');
      const ghost = document.body.querySelector<HTMLElement>(
        ":scope > div.pointer-events-none",
      );

      expect(ghost).not.toBeNull();
      expect(ghost?.parentElement).toBe(document.body);
      expect(popup?.contains(ghost ?? null)).toBe(false);
    });
  });

  describe("keyboard reorder", () => {
    it("moves a column with Alt and the arrow keys", async () => {
      const user = await openMenu();

      row("a").focus();

      await user.keyboard("{Alt>}{ArrowDown}{/Alt}");

      expect(committedOrder()).toBe("b,a,c,d");

      await user.keyboard("{Alt>}{ArrowUp}{/Alt}");

      expect(committedOrder()).toBe("a,b,c,d");
    });

    it("keeps focus on the moved column and announces its new position", async () => {
      const user = await openMenu();

      row("a").focus();

      await user.keyboard("{Alt>}{ArrowDown}{/Alt}");
      await user.keyboard("{Alt>}{ArrowDown}{/Alt}");

      expect(committedOrder()).toBe("b,c,a,d");
      expect(row("a")).toHaveFocus();
      expect(screen.getByRole("status")).toHaveTextContent(
        "Alpha moved to position 3 of 4",
      );
    });

    it("stops at the ends of the list", async () => {
      const user = await openMenu();

      row("a").focus();
      await user.keyboard("{Alt>}{ArrowUp}{/Alt}");

      row("d").focus();
      await user.keyboard("{Alt>}{ArrowDown}{/Alt}");

      expect(committedOrder()).toBe("a,b,c,d");
    });

    it("walks the list with plain arrow keys", async () => {
      const user = await openMenu();

      row("a").focus();

      await user.keyboard("{ArrowDown}{ArrowDown}");

      expect(row("c")).toHaveFocus();
      expect(committedOrder()).toBe("a,b,c,d");

      await user.keyboard("{ArrowUp}");

      expect(row("b")).toHaveFocus();
    });

    it("toggles visibility with Enter", async () => {
      const toggles: string[] = [];

      const user = await openMenu((name) => toggles.push(name));

      row("b").focus();

      await user.keyboard("{Enter}");

      expect(toggles).toEqual(["b"]);
    });
  });
});
