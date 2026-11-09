import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { TestSessionDto } from "../dtos/test-session.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

const cancelTestSession = async (id: number): Promise<TestSessionDto> => {
  return (await api.post(ep("test-sessions", String(id), "cancel"))).data;
};

type UseCancelTestSessionOptions = {
  mutationConfig?: MutationConfig<typeof cancelTestSession>;
};

export const useCancelTestSession = ({
  mutationConfig,
}: UseCancelTestSessionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: cancelTestSession,
  });
};
