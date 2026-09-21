import { z } from "zod";
import type { AppTFunction } from "@/i18next";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import type { SubjectDto } from "@/features/subjects/dtos/subject.dto";

export const createTestSessionFormSchema = (t: AppTFunction) =>
  z.object({
    startAt: z.string().min(1, t("testSessions:errors.startDateRequired")),
    period: z
      .number({ error: t("testSessions:errors.positiveNumber") })
      .positive(t("testSessions:errors.positiveNumber")),
    test: z.object({ id: z.number() }).loose().nullable(),
    subject: z.object({ id: z.number() }).loose().nullable(),
  });

export const editTestSessionFormSchema = (t: AppTFunction) =>
  z.object({
    startAt: z.string().min(1, t("testSessions:errors.startDateRequired")),
    endAt: z.string().min(1, t("testSessions:errors.endDateRequired")),
  });

export type CreateTestSessionFormValues = {
  startAt: string;
  period: number;
  test: TestDto | null;
  subject: SubjectDto | null;
};
export type EditTestSessionFormValues = z.infer<
  ReturnType<typeof editTestSessionFormSchema>
>;
