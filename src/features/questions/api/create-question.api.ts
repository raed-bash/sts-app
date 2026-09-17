import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import type { QuestionDto } from "../dtos/question.dto";
import { CreateQuestionDto } from "../dtos/create-question.dto";

export const createQuestion = async (
  data: CreateQuestionDto,
): Promise<QuestionDto> => (await api.post(ep("questions"), data)).data;

type UseCreateQuestionOptions = {
  mutationConfig?: MutationConfig<typeof createQuestion>;
};

export const useCreateQuestion = ({
  mutationConfig,
}: UseCreateQuestionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: createQuestion,
  });
};