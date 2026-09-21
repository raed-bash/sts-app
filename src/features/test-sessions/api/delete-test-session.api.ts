import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { TestSessionDto } from "../dtos/test-session.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

const deleteTestSession = async (id: number): Promise<TestSessionDto> => {
  return (await api.delete(ep("test-sessions", String(id)))).data;
};

type UseDeleteTestSessionOptions = {
  mutationConfig?: MutationConfig<typeof deleteTestSession>;
};

export const useDeleteTestSession = ({
  mutationConfig,
}: UseDeleteTestSessionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: deleteTestSession,
  });
};
