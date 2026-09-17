import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { TestSessionDto } from "../dtos/test-session.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { UpdateTestSessionDto } from "../dtos/update-test-session.dto";

const updateTestSession = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateTestSessionDto;
}): Promise<TestSessionDto> => {
  return (await api.patch(ep("test-sessions", id), data)).data;
};

type UseUpdateTestSessionOptions = {
  mutationConfig?: MutationConfig<typeof updateTestSession>;
};

export const useUpdateTestSession = ({
  mutationConfig,
}: UseUpdateTestSessionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: updateTestSession,
  });
};