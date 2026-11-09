import { z } from "zod";
import type { AppTFunction } from "@/i18next";
import type { QuestionType } from "@/constants/question-type";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import type { Choice } from "../components/form/choices";
import { parseBlanks } from "../utils/blanks";

export type QuestionFormValues = {
  text: string;
  type: QuestionType;
  points: number;
  tests: TestDto[];
  /** COMPLETE / DRAG_DROP: sentence with [answer] blanks */
  sentence: string;
  /** CHOOSE: options */
  choices: Choice[];
};

export const filledChoices = (choices: Choice[]) =>
  choices.filter((choice) => choice.text.trim());

export const questionFormSchema = (t: AppTFunction) =>
  z
    .object({
      text: z
        .string()
        .trim()
        .min(1, t("common:errors.textRequired"))
        .max(191, t("questions:errors.textTooLong")),
      type: z.enum(["CHOOSE", "DRAG_DROP", "COMPLETE"] as QuestionType[]),
      points: z
        .number({ error: t("questions:errors.pointsPositive") })
        .positive(t("questions:errors.pointsPositive")),
      tests: z.object({ id: z.number() }).loose().array(),
      sentence: z.string(),
      choices: z
        .object({ key: z.string(), text: z.string(), isCorrect: z.boolean() })
        .array(),
    })
    .superRefine((values, ctx) => {
      if (values.type === "CHOOSE") {
        const filled = filledChoices(values.choices);
        const message =
          filled.length < 2
            ? t("questions:errors.twoOptions")
            : filled.filter((c) => c.isCorrect).length !== 1
              ? t("questions:errors.markCorrect")
              : null;
        if (message)
          ctx.addIssue({ code: "custom", message, path: ["choices"] });
        return;
      }

      const { error } = parseBlanks(values.sentence);
      if (error)
        ctx.addIssue({
          code: "custom",
          path: ["sentence"],
          message: {
            none: t("questions:errors.blanksNone"),
            empty: t("questions:errors.blanksEmpty"),
            unbalanced: t("questions:errors.blanksUnbalanced"),
            nested: t("questions:errors.blanksNested"),
            reserved: t("questions:errors.blanksReserved"),
          }[error],
        });
    });
