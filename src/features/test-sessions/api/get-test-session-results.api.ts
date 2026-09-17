import type { ResultTestSessionDto } from "../dtos/result-test-session.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import { testSessionsQueryKeys } from "../test-sessions.api-keys";

export const getTestSessionResults = async (
  id: number,
  studentId: number | undefined,
  signal: AbortSignal,
): Promise<ResultTestSessionDto> => {
  const end = studentId
    ? ep("test-sessions", id, "results", studentId)
    : ep("test-sessions", id, "results");

  return (await api.get(end, { signal })).data;
};

export const getTestSessionResultsQueryOptions = (
  id: number,
  studentId?: number,
) => {
  return queryOptions({
    queryKey: testSessionsQueryKeys.results(id, studentId),
    queryFn: ({ signal }) => getTestSessionResults(id, studentId, signal),
  });
};

type UseTestSessionResultsOptions = {
  id: number;
  studentId?: number;
  queryConfig?: QueryConfig<typeof getTestSessionResultsQueryOptions>;
};

export const useTestSessionResults = ({
  id,
  studentId,
  queryConfig,
}: UseTestSessionResultsOptions) => {
  return useQuery({
    ...getTestSessionResultsQueryOptions(id, studentId),
    ...queryConfig,
  });
};