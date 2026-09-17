import { api } from "@/lib/api";
import { ep } from "@/constants/endpoints";
import type { ResultTestSessionDto } from "../dtos/result-test-session.dto";
import { useMutation } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";

export type SubmitAnswerInput = {
  answerId: number;
};

export type SubmitQuestionInput = {
  questionId: number;
  answers: SubmitAnswerInput[];
};

export type SubmitTestSessionInput = {
  id: number;
  questions: SubmitQuestionInput[];
};

const submitTestSession = async ({
  id,
  questions,
}: SubmitTestSessionInput): Promise<ResultTestSessionDto> => {
  return (await api.post(ep("test-sessions", String(id), "submit"), { questions }))
    .data;
};

type UseSubmitTestSessionOptions = {
  mutationConfig?: MutationConfig<typeof submitTestSession>;
};

export const useSubmitTestSession = ({
  mutationConfig,
}: UseSubmitTestSessionOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: submitTestSession,
  });
};