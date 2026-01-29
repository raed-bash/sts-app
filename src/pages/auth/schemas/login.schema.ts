import zod from "zod";

export const loginSchema = zod.object({
  username: zod
    .string({ error: "Username is required" })
    .min(1, "Username is required"),
  password: zod
    .string({ error: "Password is required" })
    .min(8, "Password must be longer than or equal to 8 characters"),
});
