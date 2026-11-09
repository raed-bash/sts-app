import { describe, expect, it } from "vitest";
import { moveItem, placeInBlank, removeFromBlanks } from "./placement";

describe("placeInBlank", () => {
  it("fills an empty blank from the bank", () => {
    expect(placeInBlank([null, null, null], 7, 1)).toEqual([null, 7, null]);
  });

  it("replaces an occupant, sending it back to the bank", () => {
    expect(placeInBlank([5, null], 7, 0)).toEqual([7, null]);
  });

  it("swaps when moving a placed answer onto another filled blank", () => {
    expect(placeInBlank([5, 7, null], 7, 0)).toEqual([7, 5, null]);
  });

  it("moves a placed answer to an empty blank", () => {
    expect(placeInBlank([5, null, null], 5, 2)).toEqual([null, null, 5]);
  });

  it("is a no-op when dropped on its own blank", () => {
    expect(placeInBlank([5, null], 5, 0)).toEqual([5, null]);
  });
});

describe("removeFromBlanks", () => {
  it("empties the blank holding the answer", () => {
    expect(removeFromBlanks([5, 7], 7)).toEqual([5, null]);
  });
});

describe("moveItem", () => {
  it("moves down", () => {
    expect(moveItem(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
  });

  it("moves up", () => {
    expect(moveItem(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]);
  });

  it("ignores invalid moves", () => {
    expect(moveItem(["a", "b"], 5, 0)).toEqual(["a", "b"]);
  });
});
