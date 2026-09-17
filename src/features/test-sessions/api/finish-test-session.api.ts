import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { TestSessionDto } from "../dtos/test-session.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

const finishTestSession = async (id: number): Promise<TestSessionDto> => {
  return (await api.post(ep("test-sessions", String(id), "finish"))).data;
};

type UseFinishTestSessionOptions = {
  mutationConfig?: MutationConfig<typeof finishTestSession>;
};

export const useFinishTestSession = ({
  mutationConfig,
}: UseFinishTestSessionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: finishTestSession,
  });
};