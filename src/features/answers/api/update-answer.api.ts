import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import type { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import type { AnswerDto } from "../dtos/answer.dto";
import { UpdateAnswerDto } from "../dtos/update-answer.dto";

export const updateAnswer = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateAnswerDto;
}): Promise<AnswerDto> =>
  (await api.patch(ep("answers", String(id)), data)).data;

type UseUpdateAnswerOptions = {
  mutationConfig?: MutationConfig<typeof updateAnswer>;
};

export const useUpdateAnswer = ({
  mutationConfig,
}: UseUpdateAnswerOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: updateAnswer,
  });
};
