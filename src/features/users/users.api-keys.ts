import { type QueryUserDto } from "./dtos/query-user.dto";

export const usersQueryKeys = {
  all: ["users"] as const,

  list: (query?: QueryUserDto) =>
    [...usersQueryKeys.all, "list", query].filter(Boolean),

  infiniteList: (query?: QueryUserDto) =>
    [...usersQueryKeys.all, "infinite-list", query].filter(Boolean),

  byId: (id: string) => [...usersQueryKeys.all, id],

  me: () => [...usersQueryKeys.all, "me"],
};
