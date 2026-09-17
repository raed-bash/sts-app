import { z } from "zod";
import type { SubjectDto } from "@/features/subjects/dtos/subject.dto";

export const testFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  period: z.preprocess(
    (v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : v),
    z
      .number({ error: "Period must be a number" })
      .int("Period must be a whole number")
      .positive("Period must be a positive number"),
  ),
  subjects: z
    .object({ id: z.number() })
    .loose()
    .array()
    .min(1, "Select at least one subject"),
});

export type TestFormValues = {
  name: string;
  period: number;
  subjects: SubjectDto[];
};
