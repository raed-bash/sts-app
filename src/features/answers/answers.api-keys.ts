import { type QueryAnswerDto } from "./dtos/query-answer.dto";

export const answersQueryKeys = {
  all: ["answers"] as const,

  list: (query?: QueryAnswerDto) =>
    [...answersQueryKeys.all, "list", query].filter(Boolean),

  infiniteList: (query?: QueryAnswerDto) =>
    [...answersQueryKeys.all, "infinite-list", query].filter(Boolean),

  byId: (id: string) => [...answersQueryKeys.all, id],
};
