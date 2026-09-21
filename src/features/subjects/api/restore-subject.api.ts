import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { SubjectDto } from "../dtos/subject.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

const restoreSubject = async (id: number): Promise<SubjectDto> => {
  return (await api.post(ep("subjects", id, "restore"))).data;
};

type UseRestoreSubjectOptions = {
  mutationConfig?: MutationConfig<typeof restoreSubject>;
};

export const useRestoreSubject = ({
  mutationConfig,
}: UseRestoreSubjectOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: restoreSubject,
  });
};
