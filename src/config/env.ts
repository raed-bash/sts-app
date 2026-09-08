import * as z from "zod";

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string().default("http://localhost:3000"),
    PER_PAGE: z.coerce.number().int().positive().default(10),
    DEBOUNCE_DELAY: z.coerce.number().positive().default(300),
  });

  const envVars = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((acc, curr) => {
    const [key, value] = curr;
    if (key.startsWith("VITE_APP_")) {
      acc[key.replace("VITE_APP_", "")] = value;
    }
    return acc;
  }, {});

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    const errorDetails = parsedEnv.error.issues
      .map((issue) => {
        const key = issue.path.length > 0 ? issue.path.join(".") : "root";
        return `- ${key}: ${issue.message}`;
      })
      .join("\n");

    throw new Error(
      `Invalid env provided.
The following variables are missing or invalid:
${errorDetails}
`,
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
