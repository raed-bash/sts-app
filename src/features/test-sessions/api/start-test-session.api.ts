import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { TestSessionDto } from "../dtos/test-session.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

const startTestSession = async (id: number): Promise<TestSessionDto> => {
  return (await api.post(ep("test-sessions", String(id), "start"))).data;
};

type UseStartTestSessionOptions = {
  mutationConfig?: MutationConfig<typeof startTestSession>;
};

export const useStartTestSession = ({
  mutationConfig,
}: UseStartTestSessionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: startTestSession,
  });
};
