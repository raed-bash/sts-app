import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { SubjectDto } from "../dtos/subject.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

const deleteSubject = async (id: number): Promise<SubjectDto> => {
  return (await api.delete(ep("subjects", id))).data;
};

type UseDeleteSubjectOptions = {
  mutationConfig?: MutationConfig<typeof deleteSubject>;
};

export const useDeleteSubject = ({
  mutationConfig,
}: UseDeleteSubjectOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: deleteSubject,
  });
};
