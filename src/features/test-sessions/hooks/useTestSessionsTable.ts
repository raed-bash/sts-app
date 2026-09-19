import { useTableState } from "@/hooks";
import { TableAdapter } from "@/shared/components/custom/table/TableAdapter";
import { useTestSessions, useTestSessionsInfinite } from "../api/get-test-sessions.api";
import {
  QueryTestSessionDto,
  type TestSessionOrderAttributes,
} from "../dtos/query-test-session.dto";

export function useTestSessionsTable() {
  const state = useTableState<TestSessionOrderAttributes>({
    name: "test-sessions",
  });

  const queryBase = new QueryTestSessionDto({
    ...Object.fromEntries(
      state.debouncedFilters.map((filter) => [filter.name, filter.value]),
    ),
    sorts: state.sorting.sortStatuses,
    perPage: state.pagination.perPage,
  });

  const paginated = useTestSessions({
    query: new QueryTestSessionDto({
      ...queryBase,
      page: state.pagination.currentPage,
    }),
    queryConfig: { enabled: !state.loadMore.enabled },
  });

  const loadMore = useTestSessionsInfinite({
    query: queryBase,
    queryConfig: { enabled: state.loadMore.enabled },
  });

  return {
    tableProps: new TableAdapter(state, {
      data: paginated.data,
      isPending: paginated.isPending,
      isFetching: paginated.isFetching,
      loadMore: {
        enabled: state.loadMore.enabled,
        data: loadMore.data,
        isPending: loadMore.isPending,
        isFetching: loadMore.isFetching,
        isFetchingNextPage: loadMore.isFetchingNextPage,
        hasNextPage: loadMore.hasNextPage,
        onEnableLoadMore: state.loadMore.onEnableLoadMore,
        fetchNextPage: loadMore.fetchNextPage,
      },
    }).tableProps,
  };
}