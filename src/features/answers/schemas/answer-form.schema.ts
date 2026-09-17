import { z } from "zod";
import type { QuestionDto } from "@/features/questions/dtos/question.dto";

export const answerFormSchema = z.object({
  text: z.string().trim().min(1, "Text is required"),
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