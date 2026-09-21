import { z } from "zod";
import type { AppTFunction } from "@/i18next";

export const subjectFormSchema = (t: AppTFunction) =>
  z.object({
    name: z.string().trim().min(1, t("common:errors.nameRequired")),
  });

export type SubjectFormValues = z.infer<ReturnType<typeof subjectFormSchema>>;
