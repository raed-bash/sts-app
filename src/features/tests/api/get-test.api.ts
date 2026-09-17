import type { TestDto } from "../dtos/test.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import { testsQueryKeys } from "../tests.api-keys";

export const getTest = async (
  id: number,
  signal: AbortSignal,
): Promise<TestDto> => {
  return (await api.get(ep("tests", String(id)), { signal })).data;
};

export const getTestQueryOptions = (id: number) =>
  queryOptions({
    queryKey: testsQueryKeys.byId(String(id)),
    queryFn: ({ signal }) => getTest(id, signal),
  });

type UseTestOptions = {
  id: number;
  queryConfig?: QueryConfig<typeof getTestQueryOptions>;
};

export const useTest = ({ id, queryConfig }: UseTestOptions) =>
  useQuery({ ...getTestQueryOptions(id), ...queryConfig });