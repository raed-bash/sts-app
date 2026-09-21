import { useAuthContext } from "@/contexts/AuthContext";
import { signUpSchema } from "../schemas/sign-up.schema";
import { SignUpDto } from "../dtos/sign-up.dto";
import { GENDERS, type Gender } from "@/constants/gender";
import { useTranslation } from "react-i18next";
import { translateDynamic } from "@/shared/lib/translate-dynamic";
import { useAppFormik } from "@/shared/lib/formik";
import { Card } from "@/shared/components/ui/card";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { Button } from "@/shared/components/ui/button";
import Alert from "@/shared/components/custom/alert/Alert";
import AppLink from "@/shared/components/custom/AppLink";
import { authPaths } from "../auth.paths";
import { SelectItem } from "@/shared/components/ui/select";
import { useSignUp } from "../api/sign-up.api";

export default function SignUp() {
  const authContext = useAuthContext();

  const signUpMutation = useSignUp();

  const { t } = useTranslation(["common", "auth"]);

  const formik = useAppFormik<
    Omit<SignUpDto, "gender"> & {
      gender: Gender | "";
    }
  >({
    initialValues: {
      username: "",
      password: "",
      fullName: "",
      gender: "",
      isNameViewed: true,
    },
    validationZodSchema: () => signUpSchema(t),
    onSubmit: (values) => {
      signUpMutation.mutate(new SignUpDto(values as SignUpDto), {
        onSuccess: (data) => {
          authContext.login(data);
        },
      });
    },
  });

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h2 className="text-[26px] mb-1 font-medium ">
        {t("auth:signUp.title")}
      </h2>

      <p className="text-muted-foreground text-sm">
        {t("auth:signUp.subtitle")}
      </p>

      <Card
        className="max-w-md w-full mt-5 p-6 aria-invalid:border-destructive aria-invalid:border aria-invalid:ring-[3px] aria-invalid:ring-destructive/30 "
        aria-invalid={signUpMutation.isError}
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
          <LabeledField
            type="text"
            name="fullName"
            title={t("common:fields.fullName")}
            value={formik.values.fullName}
            helperText={formik.touchedErrors.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error
          />
          <LabeledField
            type="select"
            name="gender"
            title={t("common:fields.gender")}
            placeholder={t("auth:signUp.selectGender")}
            value={formik.values.gender}
            helperText={formik.touchedErrors.gender}
            onChange={formik.handleChange}
            error
            getInputLabel={(gender) =>
              gender
                ? translateDynamic(t, `common:gender.${gender.toLowerCase()}`)
                : t("auth:signUp.selectGender")
            }
          >
            {GENDERS.map((gender) => (
              <SelectItem key={gender} value={gender}>
                {translateDynamic(t, `common:gender.${gender.toLowerCase()}`)}
              </SelectItem>
            ))}
          </LabeledField>
          <LabeledField
            type="checkbox"
            title={t("common:fields.viewNamePublicly")}
            name="isNameViewed"
            id="isNameViewed"
            checked={formik.values.isNameViewed}
            onChange={formik.handleChange}
            fieldProps={{ className: " gap-3" }}
            oneline
          />
          <Button
            type="submit"
            disabled={signUpMutation.isPending}
            className="mt-2 w-full"
          >
            {signUpMutation.isPending
              ? t("auth:signUp.submitting")
              : t("auth:signUp.submit")}
          </Button>
          {signUpMutation.isError && (
            <Alert color="danger">{signUpMutation.error.message}</Alert>
          )}
          <div className="flex items-center mt-2">
            <div className="border-b w-full border-gray-300 "></div>
            <div className="mx-3 text-md min-w-max text-gray-400">
              {t("auth:signUp.or")}
            </div>
            <div className="border-b w-full border-gray-300"></div>
          </div>
          <div>
            <p className="inline-block text-gray-400 font-medium me-2">
              {t("auth:signUp.haveAccount")}
            </p>
            <AppLink
              to={`/${authPaths.login}`}
              className="text-primary hover:text-primary/90 mt-1 duration-150 underline text-shadow-2xs w-fit"
            >
              {t("auth:signUp.login")}
            </AppLink>
          </div>
        </form>
      </Card>
    </div>
  );
}
