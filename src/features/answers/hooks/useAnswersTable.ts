import { useTableState } from "@/hooks";
import { TableAdapter } from "@/shared/components/custom/table/TableAdapter";
import { useAnswers, useAnswersInfinite } from "../api/get-answers.api";
import { QueryAnswerDto, type AnswerOrderAttributes } from "../dtos/query-answer.dto";

export function useAnswersTable(options: { questionId?: number } = {}) {
  const state = useTableState<AnswerOrderAttributes>({ name: "answers" });

  const queryBase = new QueryAnswerDto({
    ...Object.fromEntries(
      state.debouncedFilters.map((filter) => [filter.name, filter.value]),
    ),
    ...(options.questionId ? { questionId: options.questionId } : {}),
    sorts: state.sorting.sortStatuses,
    perPage: state.pagination.perPage,
  });

  const paginated = useAnswers({
    query: new QueryAnswerDto({
      ...queryBase,
      page: state.pagination.currentPage,
    }),
    queryConfig: { enabled: !state.loadMore.enabled },
  });

  const loadMore = useAnswersInfinite({
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
