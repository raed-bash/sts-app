import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useFilter, type FilterCondition } from "./useFilter";

const empty = {
  filters: [] as FilterCondition[],
  logicalOperator: "AND" as const,
  onLogicalOperatorChange: () => {},
};

describe("useFilter", () => {
  it("adds a filter by appending to the current list", () => {
    const onFiltersChange = vi.fn();

    const { result } = renderHook(() =>
      useFilter({ ...empty, onFiltersChange }),
    );

    const filter: FilterCondition = {
      name: "username",
      operation: "contains",
      value: "a",
    };

    act(() => result.current.addFilter(filter));

    expect(onFiltersChange).toHaveBeenCalledWith([filter]);
  });

  it("updates only the targeted filter", () => {
    const onFiltersChange = vi.fn();

    const { result } = renderHook(() =>
      useFilter({
        ...empty,
        filters: [
          { name: "username", operation: "contains", value: "a" },
          { name: "role", operation: "equals", value: "ADMIN" },
        ],
        onFiltersChange,
      }),
    );

    act(() => result.current.updateFilter({ operation: "startsWith" }, 0));

    expect(onFiltersChange).toHaveBeenCalledWith([
      { name: "username", operation: "startsWith", value: "a" },
      { name: "role", operation: "equals", value: "ADMIN" },
    ]);
  });

  it("removes the filter at the given index", () => {
    const onFiltersChange = vi.fn();

    const { result } = renderHook(() =>
      useFilter({
        ...empty,
        filters: [
          { name: "username", operation: "contains", value: "a" },
          { name: "role", operation: "equals", value: "ADMIN" },
        ],
        onFiltersChange,
      }),
    );

    act(() => result.current.deleteFilter(1));

    expect(onFiltersChange).toHaveBeenCalledWith([
      { name: "username", operation: "contains", value: "a" },
    ]);
  });

  it("clears all filters", () => {
    const onFiltersChange = vi.fn();

    const { result } = renderHook(() =>
      useFilter({
        ...empty,
        filters: [{ name: "role", operation: "equals", value: "ADMIN" }],
        onFiltersChange,
      }),
    );

    act(() => result.current.clearFilters());

    expect(onFiltersChange).toHaveBeenCalledWith([]);
  });

  it("toggles the filter panel open state", () => {
    const { result } = renderHook(() => useFilter(empty));

    expect(result.current.isFilterOpen).toBe(false);

    act(() => result.current.openFilter());

    expect(result.current.isFilterOpen).toBe(true);

    act(() => result.current.closeFilter());

    expect(result.current.isFilterOpen).toBe(false);
  });

  it("forwards logical operator changes", () => {
    const onLogicalOperatorChange = vi.fn();

    const { result } = renderHook(() =>
      useFilter({ ...empty, onLogicalOperatorChange }),
    );

    act(() => result.current.changeLogicalOperator("OR"));

    expect(onLogicalOperatorChange).toHaveBeenCalledWith("OR");
  });
});
