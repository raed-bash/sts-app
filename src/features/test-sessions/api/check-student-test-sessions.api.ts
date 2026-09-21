import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import { testSessionsQueryKeys } from "../test-sessions.api-keys";

export type CheckStudentTestSessions = {
  status: "NONE" | "STARTED";
  message?: string;
};

const getCheckStudentTestSessions = async (
  signal: AbortSignal,
): Promise<CheckStudentTestSessions> => {
  return (
    await api.get(ep("test-sessions", "check-student-test-sessions"), {
      signal,
    })
  ).data;
};

export const getCheckStudentTestSessionsQueryOptions = () => {
  return queryOptions({
    queryKey: testSessionsQueryKeys.checkStudentTestSessions(),
    queryFn: ({ signal }) => getCheckStudentTestSessions(signal),
  });
};

type UseCheckStudentTestSessionsOptions = {
  queryConfig?: QueryConfig<typeof getCheckStudentTestSessionsQueryOptions>;
};

export const useCheckStudentTestSessions = ({
  queryConfig,
}: UseCheckStudentTestSessionsOptions = {}) => {
  return useQuery({
    ...getCheckStudentTestSessionsQueryOptions(),
    ...queryConfig,
  });
};
