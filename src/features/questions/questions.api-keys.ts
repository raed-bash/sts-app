import { type QueryQuestionDto } from "./dtos/query-question.dto";

export const questionsQueryKeys = {
  all: ["questions"] as const,

  list: (query?: QueryQuestionDto) =>
    [...questionsQueryKeys.all, "list", query].filter(Boolean),

  infiniteList: (query?: QueryQuestionDto) =>
    [...questionsQueryKeys.all, "infinite-list", query].filter(Boolean),

  byId: (id: string) => [...questionsQueryKeys.all, id],
};