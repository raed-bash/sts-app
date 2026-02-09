import zod from "zod";

export const loginSchema = zod.object({
  username: zod.string().nonempty("Username is required"),
  password: zod
    .string()
    .min(8, "Password must be longer than or equal to 8 characters")
    .nonempty("Password is required"),
});
