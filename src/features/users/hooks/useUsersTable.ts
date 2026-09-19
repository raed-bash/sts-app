import { useTableState } from "@/hooks";
import { TableAdapter } from "@/shared/components/custom/table/TableAdapter";
import { useUsers, useUsersInfinite } from "../api/get-users.api";
import { QueryUserDto, type UserOrderAttributes } from "../dtos/query-user.dto";

export function useUsersTable() {
  const state = useTableState<UserOrderAttributes>({ name: "users" });

  const queryBase = new QueryUserDto({
    ...Object.fromEntries(
      state.debouncedFilters.map((filter) => [filter.name, filter.value]),
    ),
    sorts: state.sorting.sortStatuses,
    perPage: state.pagination.perPage,
  });

  const paginated = useUsers({
    query: new QueryUserDto({
      ...queryBase,
      page: state.pagination.currentPage,
    }),
    queryConfig: { enabled: !state.loadMore.enabled },
  });

  const loadMore = useUsersInfinite({
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
