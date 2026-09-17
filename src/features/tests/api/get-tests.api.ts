import { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import { QueryTestDto } from "../dtos/query-test.dto";
import type { TestDto } from "../dtos/test.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import type { InfiniteQueryConfig, QueryConfig } from "@/lib/react-query";
import { testsQueryKeys } from "../tests.api-keys";

export const getTests = async (
  params: QueryTestDto,
  signal: AbortSignal,
): Promise<PaginatedResultsDto<TestDto>> => {
  return (await api.get(ep("tests"), { params, signal })).data;
};

export const getTestsQueryOptions = (query: QueryTestDto) => {
  return queryOptions({
    queryKey: testsQueryKeys.list(query),
    queryFn: ({ signal }) => getTests(query, signal),
  });
};

export const getTestsInfiniteQueryOptions = (query: QueryTestDto) => {
  return infiniteQueryOptions({
    queryKey: testsQueryKeys.infiniteList(query),
    queryFn: ({ pageParam, signal }) =>
      getTests(new QueryTestDto({ ...query, page: pageParam }), signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
  });
};

type UseTestsOptions = {
  query: QueryTestDto;
  queryConfig?: QueryConfig<typeof getTestsQueryOptions>;
};

type UseTestsInfiniteOptions = {
  query: QueryTestDto;
  queryConfig?: InfiniteQueryConfig<typeof getTestsInfiniteQueryOptions>;
};

export const useTests = ({ query, queryConfig }: UseTestsOptions) => {
  return useQuery({ ...getTestsQueryOptions(query), ...queryConfig });
};

export const useTestsInfinite = ({
  query,
  queryConfig,
}: UseTestsInfiniteOptions) => {
  return useInfiniteQuery({
    ...getTestsInfiniteQueryOptions(query),
    ...queryConfig,
  });
};