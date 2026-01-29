import { useState } from "react";
import Button from "src/components/buttons/Button";
import InputPlus from "src/components/inputs/InputPlus";
import Paper from "src/components/paper/Paper";
import { authApi } from "../auth.api";
import { useAppFormik } from "src/app/formik";
import { loginSchema } from "../schemas/login.schema";
import Alert from "src/components/alert/Alert";
import { useAuthContext } from "src/contexts/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const authContext = useAuthContext();

  const formik = useAppFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationZodSchema: loginSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      setError(null);

      authApi
        .login(values)
        .then((data) => {
          setError(null);

          authContext.login(data);

          toast.success(data.message);
        })
        .catch((error) => {
          setError(error?.response?.data?.message || "Something went wrong");
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  return (
    <div className="h-screen flex items-center justify-center bg-(--background)">
      <Paper
        className="max-w-lg px-10 py-8 w-full aria-invalid:border-(--danger-main) aria-invalid:border aria-invalid:ring-[3px] aria-invalid:ring-(--danger-main)/30 "
        aria-invalid={Boolean(error)}
      >
        <h2 className="text-[24px] mb-3 font-medium ">
          Login in to Student Testing System
        </h2>
        <form className="flex flex-col gap-2 " onSubmit={formik.handleSubmit}>
          <InputPlus
            type="text"
            name="username"
            title="Username"
            value={formik.values.username}
            helperText={formik.touchedErrors.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error
          />
          <InputPlus
            type="password"
            name="password"
            title="Password"
            value={formik.values.password}
            helperText={formik.touchedErrors.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error
          />
          <Button type="submit" disabled={formik.isSubmitting} className="mt-2">
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </Button>

          {error && <Alert color="danger">{error}</Alert>}

          <div className="flex items-center mt-2">
            <div className="border-b w-full border-gray-300 "></div>
            <div className="mx-3 text-md min-w-max text-gray-400">OR</div>
            <div className="border-b w-full border-gray-300"></div>
          </div>
          <div>
            <p className="inline-block text-gray-400 font-medium me-2">
              Don't have an account?
            </p>
            <a
              href="/sign-up"
              className="text-(--accent) hover:text-(--primary) mt-1 duration-150 underline text-shadow-2xs w-fit"
            >
              Sign Up
            </a>
          </div>
        </form>
      </Paper>
    </div>
  );
}
