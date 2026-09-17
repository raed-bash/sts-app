import type { Gender } from "@/constants/gender";
import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z
    .string()
    .min(8, "Password must be longer than or equal to 8 characters"),
  fullName: z.string().trim().min(1, "Full name is required"),
  gender: z
    .enum(["FEMALE", "MALE"] as Gender[], { error: "Gender is required" }),
  isNameViewed: z
    .boolean({ error: "View name publicly is required" }),
});
