import { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import { QueryTestSessionDto } from "../dtos/query-test-session.dto";
import type { TestSessionDto } from "../dtos/test-session.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import type { InfiniteQueryConfig, QueryConfig } from "@/lib/react-query";
import { testSessionsQueryKeys } from "../test-sessions.api-keys";

export const getTestSessions = async (
  params: QueryTestSessionDto,
  signal: AbortSignal,
): Promise<PaginatedResultsDto<TestSessionDto>> => {
  return (await api.get(ep("test-sessions"), { params, signal })).data;
};

export const getTestSessionsQueryOptions = (query: QueryTestSessionDto) => {
  return queryOptions({
    queryKey: testSessionsQueryKeys.list(query),
    queryFn: ({ signal }) => getTestSessions(query, signal),
  });
};

export const getTestSessionsInfiniteQueryOptions = (query: QueryTestSessionDto) => {
  return infiniteQueryOptions({
    queryKey: testSessionsQueryKeys.infiniteList(query),
    queryFn: ({ pageParam, signal }) =>
      getTestSessions(new QueryTestSessionDto({ ...query, page: pageParam }), signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
  });
};

type UseTestSessionsOptions = {
  query: QueryTestSessionDto;
  queryConfig?: QueryConfig<typeof getTestSessionsQueryOptions>;
};

type UseTestSessionsInfiniteOptions = {
  query: QueryTestSessionDto;
  queryConfig?: InfiniteQueryConfig<typeof getTestSessionsInfiniteQueryOptions>;
};

export const useTestSessions = ({
  query,
  queryConfig,
}: UseTestSessionsOptions) => {
  return useQuery({ ...getTestSessionsQueryOptions(query), ...queryConfig });
};

export const useTestSessionsInfinite = ({
  query,
  queryConfig,
}: UseTestSessionsInfiniteOptions) => {
  return useInfiniteQuery({
    ...getTestSessionsInfiniteQueryOptions(query),
    ...queryConfig,
  });
};