import type { TestSessionDto } from "../dtos/test-session.dto";
import { QueryTestSessionDto } from "../dtos/query-test-session.dto";
import { useTestSessions } from "../api/get-test-sessions.api";

export function useTestSessionsStudents() {
  const paginated = useTestSessions({
    query: new QueryTestSessionDto({ perPage: 50 }),
  });

  const data = (paginated.data?.data ?? []) as TestSessionDto[];

  return {
    data,
    isLoading: paginated.isLoading,
    isFetching: paginated.isFetching,
    isError: paginated.isError,
  };
}
