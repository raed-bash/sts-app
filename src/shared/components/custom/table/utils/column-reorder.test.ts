import { describe, expect, it } from "vitest";
import {
  getDropIndex,
  getDropSlotFromY,
  getPreviewIndex,
  getPreviewShift,
  getPreviewShifts,
  getRowPitch,
  moveItem,
  SLOT_MARGIN,
  type DragRowRect,
} from "./column-reorder";

const HEIGHT = 20;

const rows: DragRowRect[] = [0, 1, 2, 3].map((i) => ({
  top: i * HEIGHT,
  height: HEIGHT,
}));

const midpointOf = (index: number) => rows[index].top + HEIGHT / 2;

const topOf = (index: number) => rows[index].top + 2;

const bottomOf = (index: number) => rows[index].top + HEIGHT - 2;

describe("getRowPitch", () => {
  it("reads the distance between the first two rows", () => {
    expect(getRowPitch(rows)).toBe(HEIGHT);
  });

  it("falls back to the row height for a single row", () => {
    expect(getRowPitch([rows[0]])).toBe(HEIGHT);
  });

  it("is zero without rows", () => {
    expect(getRowPitch([])).toBe(0);
  });
});

describe("getDropSlotFromY", () => {
  it("counts the rows above the pointer", () => {
    expect(getDropSlotFromY(topOf(0), rows, -1)).toBe(0);
    expect(getDropSlotFromY(bottomOf(0), rows, -1)).toBe(1);
    expect(getDropSlotFromY(topOf(2), rows, -1)).toBe(2);
  });

  it("keeps counting past the last row so the end stays reachable", () => {
    expect(getDropSlotFromY(bottomOf(3), rows, -1)).toBe(4);
    expect(getDropSlotFromY(1e6, rows, -1)).toBe(4);
  });

  it("holds the slot while the pointer rests on a row boundary", () => {
    const edge = midpointOf(2);

    expect(getDropSlotFromY(edge, rows, 2)).toBe(2);
    expect(getDropSlotFromY(edge + SLOT_MARGIN - 1, rows, 2)).toBe(2);
    expect(getDropSlotFromY(edge + SLOT_MARGIN, rows, 2)).toBe(3);
  });

  it("clears a boundary in the other direction just as slowly", () => {
    const edge = midpointOf(1);

    expect(getDropSlotFromY(edge, rows, 2)).toBe(2);
    expect(getDropSlotFromY(edge - SLOT_MARGIN + 1, rows, 2)).toBe(2);
    expect(getDropSlotFromY(edge - SLOT_MARGIN, rows, 2)).toBe(1);
  });

  it("takes the first move as given, with no slot to hold on to", () => {
    expect(getDropSlotFromY(bottomOf(2), rows, -1)).toBe(3);
  });

  it("takes a custom margin", () => {
    const edge = midpointOf(2);

    expect(getDropSlotFromY(edge + 7, rows, 2, 8)).toBe(2);
    expect(getDropSlotFromY(edge + 8, rows, 2, 8)).toBe(3);
  });
});

describe("getPreviewIndex", () => {
  it("lands on the slot, one row back when dropping downwards", () => {
    expect(getPreviewIndex(0, 2)).toBe(1);
    expect(getPreviewIndex(0, 4)).toBe(3);
  });

  it("lands straight on the slot when dropping upwards", () => {
    expect(getPreviewIndex(2, 0)).toBe(0);
    expect(getPreviewIndex(3, 2)).toBe(2);
  });

  it("stays put when dropped next to itself", () => {
    expect(getPreviewIndex(1, 1)).toBe(1);
    expect(getPreviewIndex(1, 2)).toBe(1);
  });
});

describe("getPreviewShift", () => {
  it("sends the dragged row to its previewed index", () => {
    expect(getPreviewShift(0, 0, 2)).toBe(2);
    expect(getPreviewShift(3, 3, 1)).toBe(-2);
  });

  it("slides the rows it passes by one", () => {
    expect(getPreviewShift(1, 0, 2)).toBe(-1);
    expect(getPreviewShift(2, 0, 2)).toBe(-1);
    expect(getPreviewShift(3, 0, 2)).toBe(0);
  });

  it("slides them back the other way when moving up", () => {
    expect(getPreviewShift(0, 3, 1)).toBe(0);
    expect(getPreviewShift(1, 3, 1)).toBe(1);
    expect(getPreviewShift(2, 3, 1)).toBe(1);
  });

  it("leaves the rest of the list alone", () => {
    expect(getPreviewShift(3, 0, 0)).toBe(0);
  });
});

describe("getPreviewShifts", () => {
  it("projects the whole list for a downward drop", () => {
    expect(getPreviewShifts(0, 2, 4)).toEqual([1, -1, 0, 0]);
  });

  it("projects the whole list for an upward drop", () => {
    expect(getPreviewShifts(3, 1, 4)).toEqual([0, 1, 1, -2]);
  });

  it("projects nothing for a drop on itself", () => {
    expect(getPreviewShifts(1, 1, 4)).toEqual([0, 0, 0, 0]);
    expect(getPreviewShifts(1, 2, 4)).toEqual([0, 0, 0, 0]);
  });
});

describe("getDropIndex", () => {
  const listed = [0, 1, 2, 3];

  it("inserts before the row the slot points at", () => {
    expect(getDropIndex(listed, 0, 2)).toBe(1);
    expect(getDropIndex(listed, 3, 1)).toBe(1);
  });

  it("inserts after the last row for the end slot", () => {
    expect(getDropIndex(listed, 0, 4)).toBe(3);
  });

  it("maps through the listed rows, leaving hidden columns in place", () => {
    const listed = [0, 2, 3];

    const drop = (slot: number) =>
      moveItem([..."abcd"], 0, getDropIndex(listed, 0, slot));

    expect(getDropIndex(listed, 0, 1)).toBe(1);
    expect(drop(1)).toEqual(["b", "a", "c", "d"]);

    expect(getDropIndex(listed, 0, 3)).toBe(3);
    expect(drop(3)).toEqual(["b", "c", "d", "a"]);
  });

  it("has nowhere to go without rows", () => {
    expect(getDropIndex([], 0, 0)).toBe(-1);
  });
});

describe("moveItem", () => {
  it("moves an item forwards and backwards", () => {
    expect(moveItem([..."abcd"], 0, 2)).toEqual(["b", "c", "a", "d"]);
    expect(moveItem([..."abcd"], 3, 1)).toEqual(["a", "d", "b", "c"]);
  });

  it("leaves the input untouched", () => {
    const items = [..."abcd"];

    moveItem(items, 0, 2);

    expect(items).toEqual(["a", "b", "c", "d"]);
  });
});
