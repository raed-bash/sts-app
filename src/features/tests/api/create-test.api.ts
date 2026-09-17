import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { CreateTestDto } from "../dtos/create-test.dto";
import type { TestDto } from "../dtos/test.dto";

export const createTest = async (data: CreateTestDto): Promise<TestDto> =>
  (await api.post(ep("tests"), data)).data;

type UseCreateTestOptions = {
  mutationConfig?: MutationConfig<typeof createTest>;
};

export const useCreateTest = ({ mutationConfig }: UseCreateTestOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: createTest,
  });
};