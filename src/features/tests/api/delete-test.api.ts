import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export const deleteTest = async (id: number) =>
  (await api.delete(ep("tests", String(id)))).data;

type UseDeleteTestOptions = {
  mutationConfig?: MutationConfig<typeof deleteTest>;
};

export const useDeleteTest = ({
  mutationConfig,
}: UseDeleteTestOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: deleteTest,
  });
};
