import type { QuestionDto } from "../dtos/question.dto";
import { ep } from "@/constants/endpoints";
import { api } from "@/lib/api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { QueryConfig } from "@/lib/react-query";
import { questionsQueryKeys } from "../questions.api-keys";

export const getQuestion = async (
  id: number,
  signal: AbortSignal,
): Promise<QuestionDto> => {
  return (await api.get(ep("questions", String(id)), { signal })).data;
};

export const getQuestionQueryOptions = (id: number) =>
  queryOptions({
    queryKey: questionsQueryKeys.byId(String(id)),
    queryFn: ({ signal }) => getQuestion(id, signal),
  });

type UseQuestionOptions = {
  id: number;
  queryConfig?: QueryConfig<typeof getQuestionQueryOptions>;
};

export const useQuestion = ({ id, queryConfig }: UseQuestionOptions) =>
  useQuery({ ...getQuestionQueryOptions(id), ...queryConfig });
