import type { SessionStudentResultDto } from "../dtos/session-student-result.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import { testSessionsQueryKeys } from "../test-sessions.api-keys";

export const getTestSessionStudents = async (
  id: number,
  signal: AbortSignal,
): Promise<SessionStudentResultDto[]> => {
  return (
    await api.get(ep("test-sessions", id, "students"), {
      signal,
    })
  ).data;
};

export const getTestSessionStudentsQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: testSessionsQueryKeys.students(id),
    queryFn: ({ signal }) => getTestSessionStudents(id, signal),
  });
};

type UseTestSessionStudentsOptions = {
  id: number;
  queryConfig?: QueryConfig<typeof getTestSessionStudentsQueryOptions>;
};

export const useTestSessionStudents = ({
  id,
  queryConfig,
}: UseTestSessionStudentsOptions) => {
  return useQuery({
    ...getTestSessionStudentsQueryOptions(id),
    ...queryConfig,
  });
};
