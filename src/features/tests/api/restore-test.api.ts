import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import type { TestDto } from "../dtos/test.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export const restoreTest = async (id: number): Promise<TestDto> =>
  (await api.post(ep("tests", String(id), "restore"))).data;

type UseRestoreTestOptions = {
  mutationConfig?: MutationConfig<typeof restoreTest>;
};

export const useRestoreTest = ({ mutationConfig }: UseRestoreTestOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: restoreTest,
  });
};