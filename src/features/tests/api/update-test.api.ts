import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { UpdateTestDto } from "../dtos/update-test.dto";
import type { TestDto } from "../dtos/test.dto";

export const updateTest = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateTestDto;
}): Promise<TestDto> => (await api.patch(ep("tests", String(id)), data)).data;

type UseUpdateTestOptions = {
  mutationConfig?: MutationConfig<typeof updateTest>;
};

export const useUpdateTest = ({
  mutationConfig,
}: UseUpdateTestOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: updateTest,
  });
};
