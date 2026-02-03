import { api } from "src/app/axios";
import { ep } from "src/constants/endpoints";
import { UserDto } from "./dtos/user.dto";
import type { PaginatedResultsDto } from "src/dtos/pagingated-results-dto";

export const usersApi = {
  getUsers: async () =>
    (await api.get<PaginatedResultsDto<UserDto>>(ep("users"))).data,
  me: async () => (await api.get<UserDto>(ep("users", "me"))).data,
};
