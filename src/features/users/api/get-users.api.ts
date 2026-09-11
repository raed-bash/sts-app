import { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import { type QueryUserDto } from "../dtos/query-user.dto";
import type { UserDto } from "../dtos/user.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
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

type UseUsersOptions = {
  query: QueryUserDto;
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useUsers = ({ query, queryConfig }: UseUsersOptions) => {
  return useQuery({ ...getUsersQueryOptions(query), ...queryConfig });
};
