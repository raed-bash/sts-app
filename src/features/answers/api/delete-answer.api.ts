import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import type { AnswerDto } from "../dtos/answer.dto";

export const deleteAnswer = async (id: number): Promise<AnswerDto> =>
  (await api.delete(ep("answers", String(id)))).data;

type UseDeleteAnswerOptions = {
  mutationConfig?: MutationConfig<typeof deleteAnswer>;
};

export const useDeleteAnswer = ({
  mutationConfig,
}: UseDeleteAnswerOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: deleteAnswer,
  });
};
