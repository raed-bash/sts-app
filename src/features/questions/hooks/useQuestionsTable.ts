import { useTableState } from "@/hooks";
import { TableAdapter } from "@/shared/components/custom/table/TableAdapter";
import { useQuestions, useQuestionsInfinite } from "../api/get-questions.api";
import {
  QueryQuestionDto,
  type QuestionOrderAttributes,
} from "../dtos/query-question.dto";

export function useQuestionsTable(
  options: { testIds?: number[] } = {},
) {
  const state = useTableState<QuestionOrderAttributes>({ name: "questions" });

  const queryBase = new QueryQuestionDto({
    ...Object.fromEntries(
      state.debouncedFilters.map((filter) => [filter.name, filter.value]),
    ),
    ...(options.testIds?.length ? { testIds: options.testIds } : {}),
    sorts: state.sorting.sortStatuses,
    perPage: state.pagination.perPage,
  });

  const paginated = useQuestions({
    query: new QueryQuestionDto({
      ...queryBase,
      page: state.pagination.currentPage,
    }),
    queryConfig: { enabled: !state.loadMore.enabled },
  });

  const loadMore = useQuestionsInfinite({
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