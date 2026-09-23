import { describe, expect, it, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useOrderedColumns } from "./useOrderedColumns";

describe("useOrderedColumns", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists and returns column order", () => {
    const { result } = renderHook(() => useOrderedColumns("users"));

    act(() => {
      result.current.setOrderedColumns(["b", "a", "c"]);
    });

    expect(result.current.orderedColumns).toEqual(["b", "a", "c"]);
    expect(localStorage.getItem("usersOrder")).toBe('["b","a","c"]');
  });

  it("restores a persisted order even when it contains holes", () => {
    localStorage.setItem("usersOrder", '[null,"a"]');

    const { result } = renderHook(() => useOrderedColumns("users"));

    expect(result.current.orderedColumns).toEqual([null, "a"]);
  });

  it("falls back to the default when the stored value is corrupt", () => {
    localStorage.setItem("usersOrder", "oops");

    const { result } = renderHook(() => useOrderedColumns("users", ["name"]));

    expect(result.current.orderedColumns).toEqual(["name"]);
  });
});
