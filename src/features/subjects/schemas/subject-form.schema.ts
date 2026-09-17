import { z } from "zod";

export const subjectFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export type SubjectFormValues = z.infer<typeof subjectFormSchema>;