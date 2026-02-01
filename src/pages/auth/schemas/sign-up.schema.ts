import type { Gender } from "src/constants/gender";
import zod from "zod";

export const signUpSchema = zod.object({
  username: zod
    .string({ error: "Username is required" })
    .min(1, "Username is required"),
  password: zod
    .string({ error: "Password is required" })
    .min(8, "Password must be longer than or equal to 8 characters"),
  full_name: zod
    .string({ error: "Full name is required" })
    .min(1, "Full name is required"),
  gender: zod.enum(["FEMALE", "MALE"] as Gender[], {
    error: "Gender is required",
  }),
  is_name_viewed: zod.boolean({ error: "Is name viewed is required" }),
});
