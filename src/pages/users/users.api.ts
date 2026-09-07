import { api } from "@/app/api";
import { ep } from "@/constants/endpoints";
import { UserDto } from "./dtos/user.dto";
import type { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import type { QueryUserDto } from "./dtos/query-user.dto";

export const usersApi = {
  getUsers: async (params: QueryUserDto) =>
    (await api.get<PaginatedResultsDto<UserDto>>(ep("users"), { params })).data,

  me: async () => (await api.get<UserDto>(ep("users", "me"))).data,
};
