import type { Gender } from "src/constants/gender";
import zod from "zod";

export const signUpSchema = zod.object({
  username: zod.string().nonempty("Username is required"),
  password: zod
    .string()
    .min(8, "Password must be longer than or equal to 8 characters")
    .nonempty("Password is required"),
  fullName: zod.string().nonempty("Full name is required"),
  gender: zod
    .enum(["FEMALE", "MALE"] as Gender[], { error: "Gender is required" })
    .nonoptional(),
  isNameViewed: zod
    .boolean({ error: "Is name viewed is required" })
    .nonoptional(),
});
