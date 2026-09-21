import { loginSchema } from "../schemas/login.schema";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
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

  const { t } = useTranslation(["common", "auth"]);

  const loginMutation = useLogin();
  const formik = useAppFormik<LoginDto>({
    initialValues: {
      username: "",
      password: "",
    },
    validationZodSchema: () => loginSchema(t),
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
      <h2 className="text-[26px] mb-1 font-medium ">{t("auth:login.title")}</h2>
      <p className="text-(--text-muted) text-sm">{t("auth:login.subtitle")}</p>
      <Card
        className="max-w-md w-full mt-5 p-6 aria-invalid:border-(--danger) aria-invalid:border aria-invalid:ring-[3px] aria-invalid:ring-(--danger)/30 "
        aria-invalid={Boolean(loginMutation.isError)}
      >
        <form className="flex flex-col gap-2 " onSubmit={formik.handleSubmit}>
          <LabeledField
            type="text"
            name="username"
            title={t("common:fields.username")}
            value={formik.values.username}
            helperText={formik.touchedErrors.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error
          />
          <LabeledField
            type="password"
            name="password"
            title={t("common:fields.password")}
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
            {loginMutation.isPending
              ? t("auth:login.submitting")
              : t("auth:login.submit")}
          </Button>

          {loginMutation.isError && (
            <Alert color="danger">{loginMutation.error.message}</Alert>
          )}

          <div className="flex items-center mt-2">
            <div className="border-b w-full border-gray-300 "></div>
            <div className="mx-3 text-md min-w-max text-gray-400">
              {t("auth:login.or")}
            </div>
            <div className="border-b w-full border-gray-300"></div>
          </div>
          <div>
            <p className="inline-block text-gray-400 font-medium me-2">
              {t("auth:login.noAccount")}
            </p>
            <AppLink
              to={`/${authPaths.signUp}`}
              className="text-(--primary) hover:text-(--primary-hover) mt-1 duration-150 underline text-shadow-2xs w-fit"
            >
              {t("auth:login.signUp")}
            </AppLink>
          </div>
        </form>
      </Card>
    </div>
  );
}
