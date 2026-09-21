import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { SubjectDto } from "../dtos/subject.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { CreateSubjectDto } from "../dtos/create-subject.dto";

const createSubject = async (data: CreateSubjectDto): Promise<SubjectDto> => {
  return (await api.post(ep("subjects"), data)).data;
};

type UseCreateSubjectOptions = {
  mutationConfig?: MutationConfig<typeof createSubject>;
};

export const useCreateSubject = ({
  mutationConfig,
}: UseCreateSubjectOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: createSubject,
  });
};
