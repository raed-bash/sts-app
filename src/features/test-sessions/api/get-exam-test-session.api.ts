import type { ExamTestSessionDto } from "../dtos/exam-test-session.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import { testSessionsQueryKeys } from "../test-sessions.api-keys";

export const getExamTestSession = async (
  id: number,
  signal: AbortSignal,
): Promise<ExamTestSessionDto> => {
  return (await api.get(ep("test-sessions", id, "exam"), { signal })).data;
};

export const getExamTestSessionQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: testSessionsQueryKeys.exam(id),
    queryFn: ({ signal }) => getExamTestSession(id, signal),
  });
};

type UseExamTestSessionOptions = {
  id: number;
  queryConfig?: QueryConfig<typeof getExamTestSessionQueryOptions>;
};

export const useExamTestSession = ({
  id,
  queryConfig,
}: UseExamTestSessionOptions) => {
  return useQuery({
    ...getExamTestSessionQueryOptions(id),
    ...queryConfig,
  });
};
