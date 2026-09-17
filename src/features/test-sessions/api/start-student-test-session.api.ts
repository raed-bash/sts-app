import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { StudentTestSessionDto } from "../dtos/student-test-session.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

const startStudentTestSession = async (
  id: number,
): Promise<StudentTestSessionDto> => {
  return (
    await api.post(ep("test-sessions", String(id), "start-student-test-session"))
  ).data;
};

type UseStartStudentTestSessionOptions = {
  mutationConfig?: MutationConfig<typeof startStudentTestSession>;
};

export const useStartStudentTestSession = ({
  mutationConfig,
}: UseStartStudentTestSessionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: startStudentTestSession,
  });
};