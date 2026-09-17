import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import type { QuestionDto } from "../dtos/question.dto";

export const deleteQuestion = async (id: number): Promise<QuestionDto> =>
  (await api.delete(ep("questions", id))).data;

type UseDeleteQuestionOptions = {
  mutationConfig?: MutationConfig<typeof deleteQuestion>;
};

export const useDeleteQuestion = ({
  mutationConfig,
}: UseDeleteQuestionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: deleteQuestion,
  });
};