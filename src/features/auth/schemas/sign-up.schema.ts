import type { Gender } from "@/constants/gender";
import { z } from "zod";
import type { AppTFunction } from "@/i18next";

export const signUpSchema = (t: AppTFunction) =>
  z.object({
    username: z.string().trim().min(1, t("common:errors.usernameRequired")),
    password: z.string().min(8, t("common:errors.passwordShort")),
    fullName: z.string().trim().min(1, t("auth:errors.fullNameRequired")),
    gender: z.enum(["FEMALE", "MALE"] as Gender[], {
      error: t("auth:errors.genderRequired"),
    }),
    isNameViewed: z.boolean({ error: t("auth:errors.viewNameRequired") }),
  });
