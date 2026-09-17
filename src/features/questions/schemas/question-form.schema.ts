import { z } from "zod";
import type { QuestionType } from "@/constants/question-type";
import type { TestDto } from "@/features/tests/dtos/test.dto";

export const questionFormSchema = z
  .object({
    text: z.string().trim().min(1, "Text is required"),
    type: z.enum(["CHOOSE", "DRAG_DROP", "COMPLETE"] as QuestionType[]),
    points: z
      .number({ error: "Points must be a positive number" })
      .positive("Points must be a positive number"),
    tests: z.object({ id: z.number() }).loose().array(),
    completeQuestion: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.type === "COMPLETE" && !values.completeQuestion?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "An answer text is required for COMPLETE",
        path: ["completeQuestion"],
      });
    }
  });

export type QuestionFormValues = {
  text: string;
  type: QuestionType;
  points: number;
  tests: TestDto[];
  completeQuestion?: string;
};