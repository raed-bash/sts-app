import { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import { QueryQuestionDto } from "../dtos/query-question.dto";
import type { QuestionDto } from "../dtos/question.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import type { InfiniteQueryConfig, QueryConfig } from "@/lib/react-query";
import { questionsQueryKeys } from "../questions.api-keys";

export const getQuestions = async (
  params: QueryQuestionDto,
  signal: AbortSignal,
): Promise<PaginatedResultsDto<QuestionDto>> => {
  return (await api.get(ep("questions"), { params, signal })).data;
};

export const getQuestionsQueryOptions = (query: QueryQuestionDto) => {
  return queryOptions({
    queryKey: questionsQueryKeys.list(query),
    queryFn: ({ signal }) => getQuestions(query, signal),
  });
};

export const getQuestionsInfiniteQueryOptions = (query: QueryQuestionDto) => {
  return infiniteQueryOptions({
    queryKey: questionsQueryKeys.infiniteList(query),
    queryFn: ({ pageParam, signal }) =>
      getQuestions(new QueryQuestionDto({ ...query, page: pageParam }), signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
  });
};

type UseQuestionsOptions = {
  query: QueryQuestionDto;
  queryConfig?: QueryConfig<typeof getQuestionsQueryOptions>;
};

type UseQuestionsInfiniteOptions = {
  query: QueryQuestionDto;
  queryConfig?: InfiniteQueryConfig<typeof getQuestionsInfiniteQueryOptions>;
};

export const useQuestions = ({ query, queryConfig }: UseQuestionsOptions) => {
  return useQuery({ ...getQuestionsQueryOptions(query), ...queryConfig });
};

export const useQuestionsInfinite = ({
  query,
  queryConfig,
}: UseQuestionsInfiniteOptions) => {
  return useInfiniteQuery({
    ...getQuestionsInfiniteQueryOptions(query),
    ...queryConfig,
  });
};