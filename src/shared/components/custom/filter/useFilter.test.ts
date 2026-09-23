import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useFilter, type UseFilterOptions } from "./useFilter";
import type { FilterCondition } from "./useFilter";

const initialFilters: FilterCondition[] = [
  { name: "username", operation: "contains", value: "a" },
  { name: "role", operation: "in", value: ["TEACHER"] },
];

function makeOptions(
  overrides: Partial<UseFilterOptions> = {},
): UseFilterOptions {
  return {
    filters: initialFilters,
    onFiltersChange: vi.fn(),
    logicalOperator: "AND",
    onLogicalOperatorChange: vi.fn(),
    ...overrides,
  };
}

describe("useFilter", () => {
  it("returns the provided filters and operator", () => {
    const { result } = renderHook(() => useFilter(makeOptions()));

    expect(result.current.filters).toBe(initialFilters);
    expect(result.current.logicalOperator).toBe("AND");
    expect(result.current.isFilterOpen).toBe(false);
  });

  it("appends a filter on addFilter", () => {
    const onFiltersChange = vi.fn();

    const { result } = renderHook(() =>
      useFilter(makeOptions({ onFiltersChange })),
    );

    act(() =>
      result.current.addFilter({
        name: "age",
        operation: "gt",
        value: 18,
      }),
    );

    expect(onFiltersChange).toHaveBeenCalledWith([
      ...initialFilters,
      { name: "age", operation: "gt", value: 18 },
    ]);
  });

  it("merges a partial filter only at the target index", () => {
    const onFiltersChange = vi.fn();

    const { result } = renderHook(() =>
      useFilter(makeOptions({ onFiltersChange })),
    );

    act(() => result.current.updateFilter({ value: "al" }, 0));

    expect(onFiltersChange).toHaveBeenCalledWith([
      { ...initialFilters[0], value: "al" },
      initialFilters[1],
    ]);
  });

  it("deletes the filter at the target index", () => {
    const onFiltersChange = vi.fn();

    const { result } = renderHook(() =>
      useFilter(makeOptions({ onFiltersChange })),
    );

    act(() => result.current.deleteFilter(0));

    expect(onFiltersChange).toHaveBeenCalledWith([initialFilters[1]]);
  });

  it("clears every filter", () => {
    const onFiltersChange = vi.fn();

    const { result } = renderHook(() =>
      useFilter(makeOptions({ onFiltersChange })),
    );

    act(() => result.current.clearFilters());

    expect(onFiltersChange).toHaveBeenCalledWith([]);
  });

  it("toggles the open state", () => {
    const { result } = renderHook(() => useFilter(makeOptions()));

    act(() => result.current.openFilter());

    expect(result.current.isFilterOpen).toBe(true);

    act(() => result.current.closeFilter());

    expect(result.current.isFilterOpen).toBe(false);
  });

  it("forwards the logical operator change", () => {
    const onLogicalOperatorChange = vi.fn();

    const { result } = renderHook(() =>
      useFilter(makeOptions({ onLogicalOperatorChange })),
    );

    act(() => result.current.changeLogicalOperator("OR"));

    expect(onLogicalOperatorChange).toHaveBeenCalledWith("OR");
  });

  it("tolerates a missing onFiltersChange handler", () => {
    const { result } = renderHook(() =>
      useFilter(makeOptions({ filters: [], onFiltersChange: undefined })),
    );

    expect(() => {
      act(() => result.current.addFilter(initialFilters[0]));
      act(() => result.current.updateFilter({}, 0));
      act(() => result.current.deleteFilter(0));
      act(() => result.current.clearFilters());
    }).not.toThrow();
  });
});
