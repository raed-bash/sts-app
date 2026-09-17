import { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import { QuerySubjectDto } from "../dtos/query-subject.dto";
import type { SubjectDto } from "../dtos/subject.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import type { InfiniteQueryConfig, QueryConfig } from "@/lib/react-query";
import { subjectsQueryKeys } from "../subjects.api-keys";

export const getSubjects = async (
  params: QuerySubjectDto,
  signal: AbortSignal,
): Promise<PaginatedResultsDto<SubjectDto>> => {
  return (await api.get(ep("subjects"), { params, signal })).data;
};

export const getSubjectsQueryOptions = (query: QuerySubjectDto) => {
  return queryOptions({
    queryKey: subjectsQueryKeys.list(query),
    queryFn: ({ signal }) => getSubjects(query, signal),
  });
};

export const getSubjectsInfiniteQueryOptions = (query: QuerySubjectDto) => {
  return infiniteQueryOptions({
    queryKey: subjectsQueryKeys.infiniteList(query),
    queryFn: ({ pageParam, signal }) =>
      getSubjects(new QuerySubjectDto({ ...query, page: pageParam }), signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
  });
};

type UseSubjectsOptions = {
  query: QuerySubjectDto;
  queryConfig?: QueryConfig<typeof getSubjectsQueryOptions>;
};

type UseSubjectsInfiniteOptions = {
  query: QuerySubjectDto;
  queryConfig?: InfiniteQueryConfig<typeof getSubjectsInfiniteQueryOptions>;
};

export const useSubjects = ({ query, queryConfig }: UseSubjectsOptions) => {
  return useQuery({ ...getSubjectsQueryOptions(query), ...queryConfig });
};

export const useSubjectsInfinite = ({
  query,
  queryConfig,
}: UseSubjectsInfiniteOptions) => {
  return useInfiniteQuery({
    ...getSubjectsInfiniteQueryOptions(query),
    ...queryConfig,
  });
};