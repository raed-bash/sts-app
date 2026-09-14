import { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import { QueryUserDto } from "../dtos/query-user.dto";
import type { UserDto } from "../dtos/user.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import type { InfiniteQueryConfig, QueryConfig } from "@/lib/react-query";
import { usersQueryKeys } from "../users.api-keys";

export const getUsers = async (
  params: QueryUserDto,
  signal: AbortSignal,
): Promise<PaginatedResultsDto<UserDto>> => {
  return (await api.get(ep("users"), { params, signal })).data;
};

export const getUsersQueryOptions = (query: QueryUserDto) => {
  return queryOptions({
    queryKey: usersQueryKeys.list(query),
    queryFn: ({ signal }) => getUsers(query, signal),
  });
};

export const getUsersInfiniteQueryOptions = (query: QueryUserDto) => {
  return infiniteQueryOptions({
    queryKey: usersQueryKeys.infiniteList(query),
    queryFn: ({ pageParam, signal }) =>
      getUsers(new QueryUserDto({ ...query, page: pageParam }), signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
  });
};

type UseUsersOptions = {
  query: QueryUserDto;
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

type UseUsersInfiniteOptions = {
  query: QueryUserDto;
  queryConfig?: InfiniteQueryConfig<typeof getUsersInfiniteQueryOptions>;
};

export const useUsers = ({ query, queryConfig }: UseUsersOptions) => {
  return useQuery({ ...getUsersQueryOptions(query), ...queryConfig });
};

export const useUsersInfinite = ({
  query,
  queryConfig,
}: UseUsersInfiniteOptions) => {
  return useInfiniteQuery({
    ...getUsersInfiniteQueryOptions(query),
    ...queryConfig,
  });
};
