import { z } from "zod";
import type { AppTFunction } from "@/i18next";
import type { QuestionType } from "@/constants/question-type";
import type { TestDto } from "@/features/tests/dtos/test.dto";

export const questionFormSchema = (t: AppTFunction) =>
  z
    .object({
      text: z.string().trim().min(1, t("common:errors.textRequired")),
      type: z.enum(["CHOOSE", "DRAG_DROP", "COMPLETE"] as QuestionType[]),
      points: z
        .number({ error: t("questions:errors.pointsPositive") })
        .positive(t("questions:errors.pointsPositive")),
      tests: z.object({ id: z.number() }).loose().array(),
      completeQuestion: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      if (values.type === "COMPLETE" && !values.completeQuestion?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: t("questions:errors.completeTextRequired"),
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
