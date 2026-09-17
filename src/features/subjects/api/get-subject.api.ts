import type { SubjectDto } from "../dtos/subject.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import { subjectsQueryKeys } from "../subjects.api-keys";

export const getSubject = async (
  id: number,
  signal: AbortSignal,
): Promise<SubjectDto> => {
  return (await api.get(ep("subjects", String(id)), { signal })).data;
};

export const getSubjectQueryOptions = (id: number) =>
  queryOptions({
    queryKey: subjectsQueryKeys.byId(String(id)),
    queryFn: ({ signal }) => getSubject(id, signal),
  });

type UseSubjectOptions = {
  id: number;
  queryConfig?: QueryConfig<typeof getSubjectQueryOptions>;
};

export const useSubject = ({ id, queryConfig }: UseSubjectOptions) =>
  useQuery({ ...getSubjectQueryOptions(id), ...queryConfig });