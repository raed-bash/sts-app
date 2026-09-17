import { z } from "zod";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import type { SubjectDto } from "@/features/subjects/dtos/subject.dto";

export const createTestSessionFormSchema = z.object({
  startAt: z.string().min(1, "Start date is required"),
  period: z
    .number({ error: "Must be a positive number" })
    .positive("Must be a positive number"),
  test: z.object({ id: z.number() }).loose().nullable(),
  subject: z.object({ id: z.number() }).loose().nullable(),
});

export const editTestSessionFormSchema = z.object({
  startAt: z.string().min(1, "Start date is required"),
  endAt: z.string().min(1, "End date is required"),
});

export type CreateTestSessionFormValues = {
  startAt: string;
  period: number;
  test: TestDto | null;
  subject: SubjectDto | null;
};
export type EditTestSessionFormValues = z.infer<typeof editTestSessionFormSchema>;