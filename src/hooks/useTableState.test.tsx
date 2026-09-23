import { describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useTableState } from "./useTableState";
import { PER_PAGE } from "@/shared/dtos/pagingated-results-dto";

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe("useTableState", () => {
  it("initializes with defaults", () => {
    const { result } = renderHook(() => useTableState({ name: "users" }), {
      wrapper,
    });

    expect(result.current.pagination.currentPage).toBe(1);
    expect(result.current.pagination.perPage).toBe(PER_PAGE);
    expect(result.current.loadMore.enabled).toBe(false);
    expect(result.current.sorting.sortStatuses).toEqual({});
    expect(result.current.selection.selectedRows.size).toBe(0);
    expect(result.current.hiding.hiddenColumns.size).toBe(0);
    expect(result.current.pinning.pinnedColumns.size).toBe(0);
    expect(result.current.ordering.orderedColumns).toEqual([]);
    expect(result.current.filtering.filters).toEqual([]);
    expect(result.current.filtering.logicalOperator).toBe("AND");
    expect(result.current.debouncedFilters).toEqual([]);
  });

  it("updates pagination and resets the page when the page size changes", () => {
    const { result } = renderHook(
      () => useTableState({ name: "users", defaultPerPage: 5 }),
      { wrapper },
    );

    act(() => {
      result.current.pagination.onPageChange(3);
    });

    expect(result.current.pagination.currentPage).toBe(3);

    act(() => {
      result.current.pagination.onPerPageChange(10);
    });

    expect(result.current.pagination.perPage).toBe(10);
    expect(result.current.pagination.currentPage).toBe(1);
  });

  it("ignores page size changes to the same value", () => {
    const { result } = renderHook(() => useTableState({ name: "users" }), {
      wrapper,
    });

    act(() => {
      result.current.pagination.onPageChange(2);
      result.current.pagination.onPerPageChange(PER_PAGE);
    });

    expect(result.current.pagination.currentPage).toBe(2);
  });

  it("tracks load more, sorting, selection, hiding, pinning and ordering", async () => {
    const { result } = renderHook(() => useTableState({ name: "users" }), {
      wrapper,
    });

    act(() => {
      result.current.loadMore.onEnableLoadMore();
      result.current.sorting.onSortChange("name", "asc");
      result.current.filtering.onLogicalOperatorChange("OR");
      result.current.filtering.onFiltersChange([{ value: "a" }] as never);
      result.current.selection.onSelectRows(new Map([[1, { id: 1 } as never]]));
      result.current.hiding.onHiddenColumnsChange(new Set(["id"]));
      result.current.pinning.onPinnedColumnsChange(new Set(["name"]));
      result.current.ordering.onOrderedColumnsChange(["name", "id"]);
    });

    expect(result.current.loadMore.enabled).toBe(true);

    await waitFor(() => {
      expect(result.current.sorting.sortStatuses).toEqual({ name: "asc" });
    });

    await waitFor(() => {
      expect(result.current.filtering.logicalOperator).toBe("OR");
    });

    await waitFor(() => {
      expect(result.current.filtering.filters).toEqual([{ value: "a" }]);
    });

    await waitFor(() => {
      expect(result.current.selection.selectedRows.size).toBe(1);
    });

    expect(result.current.hiding.hiddenColumns).toEqual(new Set(["id"]));
    expect(result.current.pinning.pinnedColumns).toEqual(new Set(["name"]));
    expect(result.current.ordering.orderedColumns).toEqual(["name", "id"]);
  });
});
