import { type QueryTestSessionDto } from "./dtos/query-test-session.dto";

export const testSessionsQueryKeys = {
  all: ["test-sessions"] as const,

  list: (query?: QueryTestSessionDto) =>
    [...testSessionsQueryKeys.all, "list", query].filter(Boolean),

  infiniteList: (query?: QueryTestSessionDto) =>
    [...testSessionsQueryKeys.all, "infinite-list", query].filter(Boolean),

  byId: (id: string) => [...testSessionsQueryKeys.all, id],

  exam: (id: number | string) => [
    ...testSessionsQueryKeys.all,
    "exam",
    id,
  ],

  results: (id: number | string, studentId?: number | string) =>
    studentId !== undefined
      ? [...testSessionsQueryKeys.all, "results", id, studentId]
      : [...testSessionsQueryKeys.all, "results", id],

  students: (id: number | string) => [
    ...testSessionsQueryKeys.all,
    "students",
    id,
  ],

  checkStudentTestSessions: () => [
    ...testSessionsQueryKeys.all,
    "check-student-test-sessions",
  ],
};