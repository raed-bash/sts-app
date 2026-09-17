import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

const registerTestSession = async (id: number): Promise<void> => {
  await api.post(ep("test-sessions", String(id), "register"));
};

type UseRegisterTestSessionOptions = {
  mutationConfig?: MutationConfig<typeof registerTestSession>;
};

export const useRegisterTestSession = ({
  mutationConfig,
}: UseRegisterTestSessionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: registerTestSession,
  });
};