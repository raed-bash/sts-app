import { useTableState } from "@/hooks";
import { TableAdapter } from "@/shared/components/custom/table/TableAdapter";
import { useUsers } from "../api/get-users.api";
import {
  QueryUserDto,
  type UserOrderAttributes,
} from "../dtos/query-user.dto";

export function useUsersTable() {
  const state = useTableState<UserOrderAttributes>({ name: "users" });

  const { data, isPending, isFetching } = useUsers({
    query: new QueryUserDto({
      ...Object.fromEntries(
        state.debouncedFilters.map((filter) => [filter.name, filter.value]),
      ),
      sorts: state.sorting.sortStatuses,
      page: state.pagination.currentPage,
    }),
  });

  return {
    tableProps: new TableAdapter(state, { data, isPending, isFetching })
      .tableProps,
  };
}