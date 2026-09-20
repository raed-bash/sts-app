import { loginSchema } from "../schemas/login.schema";
import { useAuthContext } from "@/contexts/AuthContext";
import toast from "@/shared/lib/toast";
import { Card } from "@/shared/components/ui/card";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { Button } from "@/shared/components/ui/button";
import Alert from "@/shared/components/custom/alert/Alert";
import AppLink from "@/shared/components/custom/AppLink";
import { authPaths } from "../auth.paths";
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
      <Card
        className="max-w-md w-full mt-5 p-6 aria-invalid:border-(--danger) aria-invalid:border aria-invalid:ring-[3px] aria-invalid:ring-(--danger)/30 "
        aria-invalid={Boolean(loginMutation.isError)}
      >
        <form className="flex flex-col gap-2 " onSubmit={formik.handleSubmit}>
          <LabeledField
            type="text"
            name="username"
            title="Username"
            value={formik.values.username}
            helperText={formik.touchedErrors.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error
          />
          <LabeledField
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
            className="mt-2 w-full"
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
              to={`/${authPaths.signUp}`}
              className="text-(--primary) hover:text-(--primary-hover) mt-1 duration-150 underline text-shadow-2xs w-fit"
            >
              Sign Up
            </AppLink>
          </div>
        </form>
      </Card>
    </div>
  );
}
