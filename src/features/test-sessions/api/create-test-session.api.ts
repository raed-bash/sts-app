import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { TestSessionDto } from "../dtos/test-session.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { CreateTestSessionDto } from "../dtos/create-test-session.dto";

const createTestSession = async (
  data: CreateTestSessionDto,
): Promise<TestSessionDto> => {
  return (await api.post(ep("test-sessions"), data)).data;
};

type UseCreateTestSessionOptions = {
  mutationConfig?: MutationConfig<typeof createTestSession>;
};

export const useCreateTestSession = ({
  mutationConfig,
}: UseCreateTestSessionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: createTestSession,
  });
};