import { useTableState } from "@/hooks";
import { TableAdapter } from "@/shared/components/custom/table/TableAdapter";
import { useSubjects, useSubjectsInfinite } from "../api/get-subjects.api";
import {
  QuerySubjectDto,
  type SubjectOrderAttributes,
} from "../dtos/query-subject.dto";

export function useSubjectsTable(options: { isDeleted?: boolean } = {}) {
  const state = useTableState<SubjectOrderAttributes>({
    name: "subjects",
    defaultHiddenColumns: ["updatedAt", "deletedAt"],
  });

  const queryBase = new QuerySubjectDto({
    ...Object.fromEntries(
      state.debouncedFilters.map((filter) => [filter.name, filter.value]),
    ),
    isDeleted: options.isDeleted ?? false,
    sorts: state.sorting.sortStatuses,
    perPage: state.pagination.perPage,
  });

  const paginated = useSubjects({
    query: new QuerySubjectDto({
      ...queryBase,
      page: state.pagination.currentPage,
    }),
    queryConfig: { enabled: !state.loadMore.enabled },
  });

  const loadMore = useSubjectsInfinite({
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
