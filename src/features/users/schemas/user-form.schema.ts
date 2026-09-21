import { z } from "zod";
import type { AppTFunction } from "@/i18next";
import type { UserRole } from "@/constants/user-role";
import type { UserStatus } from "@/constants/user-status";

export const createUserFormSchema = (t: AppTFunction) =>
  z.object({
    username: z.string().trim().min(1, t("common:errors.usernameRequired")),
    password: z
      .string()
      .trim()
      .min(8, t("common:errors.passwordShort"))
      .min(1, t("users:errors.passwordRequired")),
    role: z.enum(["SUPER_ADMIN", "TEACHER", "STUDENT"] as UserRole[]),
    status: z.enum(["PENDING", "ACTIVE", "BLOCKED"] as UserStatus[]),
  });

export const editUserFormSchema = (t: AppTFunction) =>
  z.object({
    username: z.string().trim().min(1, t("common:errors.usernameRequired")),
    role: z.enum(["SUPER_ADMIN", "TEACHER", "STUDENT"] as UserRole[]),
    status: z.enum(["PENDING", "ACTIVE", "BLOCKED"] as UserStatus[]),
  });

export const changePasswordSchema = (t: AppTFunction) =>
  z.object({
    password: z
      .string()
      .trim()
      .min(8, t("common:errors.passwordShort"))
      .min(1, t("users:errors.passwordRequired")),
  });

export type CreateUserFormValues = z.infer<
  ReturnType<typeof createUserFormSchema>
>;
export type EditUserFormValues = z.infer<ReturnType<typeof editUserFormSchema>>;
export type ChangePasswordValues = z.infer<
  ReturnType<typeof changePasswordSchema>
>;
