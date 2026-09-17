import { type QuerySubjectDto } from "./dtos/query-subject.dto";

export const subjectsQueryKeys = {
  all: ["subjects"] as const,

  list: (query?: QuerySubjectDto) =>
    [...subjectsQueryKeys.all, "list", query].filter(Boolean),

  infiniteList: (query?: QuerySubjectDto) =>
    [...subjectsQueryKeys.all, "infinite-list", query].filter(Boolean),

  byId: (id: string) => [...subjectsQueryKeys.all, id],
};