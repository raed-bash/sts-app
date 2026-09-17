import { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import { QueryAnswerDto } from "../dtos/query-answer.dto";
import type { AnswerDto } from "../dtos/answer.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import type { InfiniteQueryConfig, QueryConfig } from "@/lib/react-query";
import { answersQueryKeys } from "../answers.api-keys";

export const getAnswers = async (
  params: QueryAnswerDto,
  signal: AbortSignal,
): Promise<PaginatedResultsDto<AnswerDto>> => {
  return (await api.get(ep("answers"), { params, signal })).data;
};

export const getAnswersQueryOptions = (query: QueryAnswerDto) => {
  return queryOptions({
    queryKey: answersQueryKeys.list(query),
    queryFn: ({ signal }) => getAnswers(query, signal),
  });
};

export const getAnswersInfiniteQueryOptions = (query: QueryAnswerDto) => {
  return infiniteQueryOptions({
    queryKey: answersQueryKeys.infiniteList(query),
    queryFn: ({ pageParam, signal }) =>
      getAnswers(new QueryAnswerDto({ ...query, page: pageParam }), signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
  });
};

type UseAnswersOptions = {
  query: QueryAnswerDto;
  queryConfig?: QueryConfig<typeof getAnswersQueryOptions>;
};

type UseAnswersInfiniteOptions = {
  query: QueryAnswerDto;
  queryConfig?: InfiniteQueryConfig<typeof getAnswersInfiniteQueryOptions>;
};

export const useAnswers = ({ query, queryConfig }: UseAnswersOptions) => {
  return useQuery({ ...getAnswersQueryOptions(query), ...queryConfig });
};

export const useAnswersInfinite = ({
  query,
  queryConfig,
}: UseAnswersInfiniteOptions) => {
  return useInfiniteQuery({
    ...getAnswersInfiniteQueryOptions(query),
    ...queryConfig,
  });
};
