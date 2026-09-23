import { describe, expect, it, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useHiddenColumns } from "./useHiddenColumns";
import { usePinnedColumns } from "./usePinnedColumns";

describe("Set-based column storage hooks", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists hidden columns as a JSON array", () => {
    const { result } = renderHook(() =>
      useHiddenColumns("users", new Set(["a"])),
    );

    act(() => {
      result.current.setHiddenColumns(new Set(["a", "b"]));
    });

    expect(result.current.hiddenColumns).toEqual(new Set(["a", "b"]));
    expect(localStorage.getItem("usersHiddenColumns")).toBe('["a","b"]');
  });

  it("restores persisted hidden columns", () => {
    localStorage.setItem("usersHiddenColumns", '["c"]');

    const { result } = renderHook(() => useHiddenColumns("users"));

    expect(result.current.hiddenColumns).toEqual(new Set(["c"]));
  });

  it("falls back to the default when the stored value is corrupt", () => {
    localStorage.setItem("usersHiddenColumns", "not-json");

    const { result } = renderHook(() =>
      useHiddenColumns("users", new Set(["a"])),
    );

    expect(result.current.hiddenColumns).toEqual(new Set(["a"]));
  });

  it("persists pinned columns the same way", () => {
    const { result } = renderHook(() =>
      usePinnedColumns("users", new Set(["id"])),
    );

    act(() => {
      result.current.setPinnedColumns(new Set(["id", "name"]));
    });

    expect(localStorage.getItem("usersPinnedColumns")).toBe('["id","name"]');
    expect(result.current.pinnedColumns).toEqual(new Set(["id", "name"]));
  });
});
