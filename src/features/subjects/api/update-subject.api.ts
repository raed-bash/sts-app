import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { SubjectDto } from "../dtos/subject.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { UpdateSubjectDto } from "../dtos/update-subject.dto";

const updateSubject = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateSubjectDto;
}): Promise<SubjectDto> => {
  return (await api.patch(ep("subjects", id), data)).data;
};

type UseUpdateSubjectOptions = {
  mutationConfig?: MutationConfig<typeof updateSubject>;
};

export const useUpdateSubject = ({
  mutationConfig,
}: UseUpdateSubjectOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: updateSubject,
  });
};
