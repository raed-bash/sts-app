import { type QueryTestDto } from "./dtos/query-test.dto";

export const testsQueryKeys = {
  all: ["tests"] as const,
  list: (query?: QueryTestDto) => [...testsQueryKeys.all, "list", query].filter(Boolean),
  infiniteList: (query?: QueryTestDto) => [...testsQueryKeys.all, "infinite-list", query].filter(Boolean),
  byId: (id: string) => [...testsQueryKeys.all, id],
};