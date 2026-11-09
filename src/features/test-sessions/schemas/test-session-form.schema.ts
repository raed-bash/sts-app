import { z } from "zod";
import type { AppTFunction } from "@/i18next";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import type { SubjectDto } from "@/features/subjects/dtos/subject.dto";

const inFuture = (value: string) => new Date(value).getTime() > Date.now();

export const createTestSessionFormSchema = (t: AppTFunction) =>
  z.object({
    startAt: z
      .string()
      .min(1, t("testSessions:errors.startDateRequired"))
      .refine(inFuture, t("testSessions:errors.startInPast")),
    test: z
      .object({ id: z.number() })
      .loose()
      .nullable()
      .refine(Boolean, t("testSessions:errors.testRequired")),
    subject: z
      .object({ id: z.number() })
      .loose()
      .nullable()
      .refine(Boolean, t("testSessions:errors.subjectRequired")),
  });

export const editTestSessionFormSchema = (t: AppTFunction) =>
  z
    .object({
      startAt: z.string().min(1, t("testSessions:errors.startDateRequired")),
      endAt: z.string().min(1, t("testSessions:errors.endDateRequired")),
    })
    .refine((v) => new Date(v.endAt) > new Date(v.startAt), {
      path: ["endAt"],
      message: t("testSessions:errors.endBeforeStart"),
    });

export type CreateTestSessionFormValues = {
  startAt: string;
  test: TestDto | null;
  subject: SubjectDto | null;
};
export type EditTestSessionFormValues = z.infer<
  ReturnType<typeof editTestSessionFormSchema>
>;
