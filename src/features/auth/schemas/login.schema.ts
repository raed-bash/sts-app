import { z } from "zod";
import type { AppTFunction } from "@/i18next";

export const loginSchema = (t: AppTFunction) =>
  z.object({
    username: z.string().trim().min(1, t("common:errors.usernameRequired")),
    password: z.string().min(8, t("common:errors.passwordShort")),
  });
