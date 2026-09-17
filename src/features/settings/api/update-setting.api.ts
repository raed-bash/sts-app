import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export type UpdateSettingInput = {
  key: string;
  value: string;
};

const updateSetting = async (data: UpdateSettingInput): Promise<void> => {
  await api.patch(ep("settings"), data);
};

type UseUpdateSettingOptions = {
  mutationConfig?: MutationConfig<typeof updateSetting>;
};

export const useUpdateSetting = ({
  mutationConfig,
}: UseUpdateSettingOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: updateSetting,
  });
};