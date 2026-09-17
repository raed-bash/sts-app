import { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import type { SettingDto } from "../dtos/setting.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import { settingsQueryKeys } from "../settings.api-keys";

const getSettings = async (
  signal: AbortSignal,
): Promise<PaginatedResultsDto<SettingDto>> => {
  return (
    await api.get(ep("settings"), { signal, params: { perPage: 100 } })
  ).data;
};

export const getSettingsQueryOptions = () => {
  return queryOptions({
    queryKey: settingsQueryKeys.list(),
    queryFn: ({ signal }) => getSettings(signal),
  });
};

type UseSettingsOptions = {
  queryConfig?: QueryConfig<typeof getSettingsQueryOptions>;
};

export const useSettings = ({ queryConfig }: UseSettingsOptions = {}) => {
  return useQuery({ ...getSettingsQueryOptions(), ...queryConfig });
};