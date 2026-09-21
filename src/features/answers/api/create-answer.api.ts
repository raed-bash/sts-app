import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import type { AnswerDto } from "../dtos/answer.dto";
import { CreateAnswerDto } from "../dtos/create-answer.dto";

export const createAnswer = async (data: CreateAnswerDto): Promise<AnswerDto> =>
  (await api.post(ep("answers"), data)).data;

type UseCreateAnswerOptions = {
  mutationConfig?: MutationConfig<typeof createAnswer>;
};

export const useCreateAnswer = ({
  mutationConfig,
}: UseCreateAnswerOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: createAnswer,
  });
};
