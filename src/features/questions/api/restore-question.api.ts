import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import type { QuestionDto } from "../dtos/question.dto";

export const restoreQuestion = async (id: number): Promise<QuestionDto> =>
  (await api.post(ep("questions", id, "restore"))).data;

type UseRestoreQuestionOptions = {
  mutationConfig?: MutationConfig<typeof restoreQuestion>;
};

export const useRestoreQuestion = ({
  mutationConfig,
}: UseRestoreQuestionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: restoreQuestion,
  });
};
