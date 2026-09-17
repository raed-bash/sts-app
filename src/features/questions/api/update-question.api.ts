import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import type { QuestionDto } from "../dtos/question.dto";
import { UpdateQuestionDto } from "../dtos/update-question.dto";

export const updateQuestion = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateQuestionDto;
}): Promise<QuestionDto> => (await api.patch(ep("questions", id), data)).data;

type UseUpdateQuestionOptions = {
  mutationConfig?: MutationConfig<typeof updateQuestion>;
};

export const useUpdateQuestion = ({
  mutationConfig,
}: UseUpdateQuestionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: updateQuestion,
  });
};