import { loginSchema } from "../schemas/login.schema";
import { useAuthContext } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import Paper from "@/shared/components/custom/paper/Paper";
import InputPlus from "@/shared/components/custom/inputs/InputPlus";
import Button from "@/shared/components/custom/buttons/Button";
import Alert from "@/shared/components/custom/alert/Alert";
import AppLink from "@/shared/components/custom/AppLink";
import { useAppFormik } from "@/shared/lib/formik";
import { useLogin } from "../api/login.api";
import { LoginDto } from "../dtos/login.dto";

export default function Login() {
  const authContext = useAuthContext();

  const loginMutation = useLogin();
  const formik = useAppFormik<LoginDto>({
    initialValues: {
      username: "",
      password: "",
    },
    validationZodSchema: loginSchema,
    onSubmit: (values) => {
      loginMutation.mutate(values, {
        onSuccess: (data) => {
          authContext.login(data);

          toast.success(data.message);
        },
      });
    },
  });

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-(--background) text-(--text)">
      <h2 className="text-[26px] mb-1 font-medium ">Welcome Back</h2>
      <p className="text-(--text-muted) text-sm">Please Login to continue</p>
      <Paper
        className="max-w-md w-full mt-5 aria-invalid:border-(--danger) aria-invalid:border aria-invalid:ring-[3px] aria-invalid:ring-(--danger)/30 "
        aria-invalid={Boolean(loginMutation.isError)}
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
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-2"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>

          {loginMutation.isError && (
            <Alert color="danger">{loginMutation.error.message}</Alert>
          )}

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
