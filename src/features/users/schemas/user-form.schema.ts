import { z } from "zod";
import type { UserRole } from "@/constants/user-role";
import type { UserStatus } from "@/constants/user-status";

export const createUserFormSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be longer than or equal to 8 characters")
    .min(1, "Password is required"),
  role: z.enum(["SUPER_ADMIN", "TEACHER", "STUDENT"] as UserRole[]),
  status: z.enum(["PENDING", "ACTIVE", "BLOCKED"] as UserStatus[]),
});

export const editUserFormSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  role: z.enum(["SUPER_ADMIN", "TEACHER", "STUDENT"] as UserRole[]),
  status: z.enum(["PENDING", "ACTIVE", "BLOCKED"] as UserStatus[]),
});

export const changePasswordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(8, "Password must be longer than or equal to 8 characters")
    .min(1, "Password is required"),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
export type EditUserFormValues = z.infer<typeof editUserFormSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;