import { describe, expect, it, vi } from "vitest";
import { TableAdapter } from "./TableAdapter";
import type { TableAdapterLoadMoreSource } from "./TableAdapter";
import type { TableRowItem, TableRowRecord } from "./Table";
import { PER_PAGE } from "@/shared/dtos/pagingated-results-dto";
import type { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import type { UseTableStateReturn } from "@/hooks/useTableState";

type Row = TableRowItem & TableRowRecord;

const row = (id: number): Row => ({ id, username: `user-${id}` });

function makeState(): UseTableStateReturn<string> {
  return {
    pagination: {
      currentPage: 1,
      onPageChange: vi.fn(),
      perPage: PER_PAGE,
      onPerPageChange: vi.fn(),
    },
    loadMore: {
      enabled: false,
      onEnableLoadMore: vi.fn(),
    },
    sorting: {
      sortStatuses: {},
      onSortChange: vi.fn(),
    },
    selection: {
      selectedRows: new Map(),
      onSelectRows: vi.fn(),
    },
    hiding: {
      hiddenColumns: new Set(),
      onHiddenColumnsChange: vi.fn(),
    },
    pinning: {
      pinnedColumns: new Set(),
      onPinnedColumnsChange: vi.fn(),
    },
    ordering: {
      orderedColumns: ["id", "username"],
      onOrderedColumnsChange: vi.fn(),
    },
    filtering: {
      filters: [],
      onFiltersChange: vi.fn(),
      logicalOperator: "AND",
      onLogicalOperatorChange: vi.fn(),
    },
    debouncedFilters: [],
  };
}

const paginatedData = (
  rows: Row[],
  overrides: Partial<PaginatedResultsDto<Row>["meta"]> = {},
): PaginatedResultsDto<Row> => ({
  data: rows,
  meta: {
    currentPage: 1,
    lastPage: 1,
    perPage: PER_PAGE,
    total: rows.length,
    ...overrides,
  },
});

function makeLoadMore(
  overrides: Partial<TableAdapterLoadMoreSource<Row>> = {},
): TableAdapterLoadMoreSource<Row> {
  return {
    enabled: false,
    data: undefined,
    isPending: false,
    isFetching: false,
    isFetchingNextPage: false,
    hasNextPage: undefined,
    onEnableLoadMore: vi.fn(),
    fetchNextPage: vi.fn(),
    ...overrides,
  };
}

describe("TableAdapter", () => {
  describe("paginated mode", () => {
    it("passes rows, count and perPage through from the query result", () => {
      const state = makeState();
      state.pagination.currentPage = 3;

      const result = paginatedData([row(1), row(2)], {
        perPage: 25,
        total: 40,
      });

      const adapter = new TableAdapter(state, {
        data: result,
        isPending: false,
        isFetching: true,
      });

      expect(adapter.tableProps.data.rows).toEqual([row(1), row(2)]);
      expect(adapter.tableProps.pagination).toMatchObject({
        currentPage: 3,
        count: 40,
        perPage: 25,
      });
    });

    it("surfaces the query loading flags", () => {
      const adapter = new TableAdapter(makeState(), {
        data: paginatedData([]),
        isPending: true,
        isFetching: false,
      });

      expect(adapter.tableProps.loading.loading).toBe(true);
      expect(adapter.tableProps.loading.scLoading).toBe(false);
    });

    it("defaults count to zero when no data is available", () => {
      const adapter = new TableAdapter(makeState(), {
        data: undefined,
        isPending: true,
        isFetching: false,
      });

      expect(adapter.tableProps.data.rows).toBeUndefined();
      expect(adapter.tableProps.pagination.count).toBe(0);
    });

    it("forwards the state slices for sorting, selection, hiding, pinning, ordering and filtering", () => {
      const state = makeState();

      const adapter = new TableAdapter(state, {
        data: paginatedData([]),
        isPending: false,
        isFetching: false,
      });

      const props = adapter.tableProps;

      expect(props.sorting).toStrictEqual(state.sorting);
      expect(props.selection).toStrictEqual(state.selection);
      expect(props.hiding).toStrictEqual(state.hiding);
      expect(props.pinning).toStrictEqual(state.pinning);
      expect(props.ordering).toStrictEqual(state.ordering);
      expect(props.filtering).toStrictEqual(state.filtering);
    });
  });

  describe("load-more mode (disabled)", () => {
    it("renders a load-more control that activates instead of fetching", () => {
      const loadMore = makeLoadMore({
        enabled: false,
        hasNextPage: undefined,
      });

      const adapter = new TableAdapter(makeState(), {
        data: paginatedData([row(1)]),
        isPending: false,
        isFetching: false,
        loadMore,
      });

      const props = adapter.tableProps;

      expect(props.data.rows).toEqual([row(1)]);
      expect(props.pagination.loadMore).toMatchObject({
        enabled: false,
        hasMore: true,
        isFetching: false,
        loadedCount: 0,
      });

      props.pagination.loadMore!.onLoadMore();

      expect(loadMore.onEnableLoadMore).toHaveBeenCalledTimes(1);
      expect(loadMore.fetchNextPage).not.toHaveBeenCalled();
    });
  });

  describe("load-more mode (enabled)", () => {
    it("flattens the accumulated pages and uses the latest page meta", () => {
      const loadMore = makeLoadMore({
        enabled: true,
        data: {
          pages: [
            paginatedData([row(1), row(2)], {
              currentPage: 1,
              lastPage: 2,
              perPage: 5,
              total: 4,
            }),
            paginatedData([row(3), row(4)], {
              currentPage: 2,
              lastPage: 2,
              perPage: 5,
              total: 4,
            }),
          ],
        },
        isPending: false,
        isFetching: true,
        isFetchingNextPage: true,
        hasNextPage: false,
      });

      const adapter = new TableAdapter(makeState(), {
        data: undefined,
        isPending: false,
        isFetching: false,
        loadMore,
      });

      const props = adapter.tableProps;

      expect(props.data.rows).toEqual([row(1), row(2), row(3), row(4)]);
      expect(props.pagination.count).toBe(4);
      expect(props.pagination.perPage).toBe(5);
      expect(props.pagination.loadMore).toMatchObject({
        enabled: true,
        hasMore: false,
        isFetching: true,
        loadedCount: 4,
      });
      expect(props.loading.loading).toBe(false);
      expect(props.loading.scLoading).toBe(true);
    });

    it("fetches the next page when the load-more button is pressed", () => {
      const loadMore = makeLoadMore({
        enabled: true,
        data: { pages: [paginatedData([row(1)])] },
        hasNextPage: true,
        isFetchingNextPage: false,
      });

      const adapter = new TableAdapter(makeState(), {
        data: undefined,
        isPending: false,
        isFetching: false,
        loadMore,
      });

      adapter.tableProps.pagination.loadMore!.onLoadMore();

      expect(loadMore.fetchNextPage).toHaveBeenCalledTimes(1);
      expect(loadMore.onEnableLoadMore).not.toHaveBeenCalled();
    });

    it("falls back to an empty result when no pages are loaded yet", () => {
      const loadMore = makeLoadMore({
        enabled: true,
        data: undefined,
        isPending: true,
      });

      const adapter = new TableAdapter(makeState(), {
        data: undefined,
        isPending: false,
        isFetching: false,
        loadMore,
      });

      const props = adapter.tableProps;

      expect(props.data.rows).toEqual([]);
      expect(props.pagination.count).toBe(0);
      expect(props.pagination.perPage).toBeUndefined();
      expect(props.loading.loading).toBe(true);
    });
  });
});
