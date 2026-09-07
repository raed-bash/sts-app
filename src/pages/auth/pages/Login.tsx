import { useState } from "react";
import { authApi } from "../auth.api";
import { loginSchema } from "../schemas/login.schema";
import { useAuthContext } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import Paper from "@/shared/components/custom/paper/Paper";
import InputPlus from "@/shared/components/custom/inputs/InputPlus";
import Button from "@/shared/components/custom/buttons/Button";
import Alert from "@/shared/components/custom/alert/Alert";
import AppLink from "@/shared/components/custom/AppLink";
import { useAppFormik } from "@/shared/lib/formik";

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
    <div className="h-screen flex flex-col items-center justify-center bg-(--background) text-(--text)">
      <h2 className="text-[26px] mb-1 font-medium ">Welcome Back</h2>
      <p className="text-(--text-muted) text-sm">Please Login to continue</p>
      <Paper
        className="max-w-md w-full mt-5 aria-invalid:border-(--danger) aria-invalid:border aria-invalid:ring-[3px] aria-invalid:ring-(--danger)/30 "
        aria-invalid={Boolean(error)}
      >
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
            <AppLink
              to="/sign-up"
              className="text-(--accent) hover:text-(--primary) mt-1 duration-150 underline text-shadow-2xs w-fit"
            >
              Sign Up
            </AppLink>
          </div>
        </form>
      </Paper>
    </div>
  );
}
