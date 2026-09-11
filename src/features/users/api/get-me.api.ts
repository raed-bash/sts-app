import type { UserDto } from "../dtos/user.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import { usersQueryKeys } from "../users.api-keys";

export const getMe = async (signal: AbortSignal): Promise<UserDto> => {
  return (await api.get(ep("users", "me"), { signal })).data;
};

export const getMeQueryOptions = () => {
  return queryOptions({
    queryKey: usersQueryKeys.me(),
    queryFn: ({ signal }) => getMe(signal),
  });
};

type UseMeOptions = QueryConfig<typeof getMeQueryOptions>;

export const useMe = (queryConfig?: UseMeOptions) => {
  return useQuery({ ...getMeQueryOptions(), ...queryConfig });
};
