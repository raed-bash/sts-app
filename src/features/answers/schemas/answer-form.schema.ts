import { z } from "zod";
import type { AppTFunction } from "@/i18next";
import type { QuestionDto } from "@/features/questions/dtos/question.dto";

export const answerFormSchema = (t: AppTFunction) =>
  z.object({
    text: z.string().trim().min(1, t("common:errors.textRequired")),
    isCorrect: z.boolean(),
    order: z.number(),
    correctIndex: z.number(),
    question: z.object({ id: z.number() }).loose().nullable(),
  });

export type AnswerFormValues = {
  text: string;
  isCorrect: boolean;
  order: number;
  correctIndex: number;
  question: QuestionDto | null;
};
