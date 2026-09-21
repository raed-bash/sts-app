import { z } from "zod";
import type { AppTFunction } from "@/i18next";
import type { SubjectDto } from "@/features/subjects/dtos/subject.dto";

export const testFormSchema = (t: AppTFunction) =>
  z.object({
    name: z.string().trim().min(1, t("common:errors.nameRequired")),
    period: z.preprocess(
      (v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : v),
      z
        .number({ error: t("tests:errors.periodNumber") })
        .int(t("tests:errors.periodWhole"))
        .positive(t("tests:errors.periodPositive")),
    ),
    subjects: z
      .object({ id: z.number() })
      .loose()
      .array()
      .min(1, t("tests:errors.subjectsMin")),
  });

export type TestFormValues = {
  name: string;
  period: number;
  subjects: SubjectDto[];
};
