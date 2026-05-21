import { useState } from "react";
import Button from "src/components/buttons/Button";
import InputPlus from "src/components/inputs/InputPlus";
import Paper from "src/components/paper/Paper";
import { authApi } from "../auth.api";
import { useAppFormik } from "src/app/formik";
import Alert from "src/components/alert/Alert";
import { useAuthContext } from "src/contexts/AuthContext";
import { signUpSchema } from "../schemas/sign-up.schema";
import { SignUpDto } from "../dtos/sign-up.dto";
import { type Gender } from "src/constants/gender";
import { capitalize } from "lodash";
import AppLink from "src/components/AppLink";

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const authContext = useAuthContext();

  const formik = useAppFormik<
    Omit<SignUpDto, "gender"> & {
      gender: Gender | string;
    }
  >({
    initialValues: {
      username: "",
      password: "",
      fullName: "",
      gender: "",
      isNameViewed: true,
    },
    validationZodSchema: signUpSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      setError(null);

      authApi
        .signUp(new SignUpDto(values as SignUpDto))
        .then((data) => {
          setError(null);

          authContext.login(data);
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
      <h2 className="text-[26px] mb-1 font-medium ">
        Welcome to Student Testing System
      </h2>

      <p className="text-(--text-muted) text-sm">Please sign up to continue</p>

      <Paper
        className="max-w-md w-full mt-5 aria-invalid:border-(--danger-main) aria-invalid:border aria-invalid:ring-[3px] aria-invalid:ring-(--danger-main)/30 "
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
          <InputPlus
            type="text"
            name="fullName"
            title="Full Name"
            value={formik.values.fullName}
            helperText={formik.touchedErrors.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error
          />
          <InputPlus
            type="select"
            name="gender"
            title="Gender"
            value={formik.values.gender}
            helperText={formik.touchedErrors.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error
            options={["MALE", "FEMALE"] as Gender[]}
            getInputLabel={(gender) => capitalize(gender)}
            getOptionLabel={(gender) => capitalize(gender)}
            getUniqueValue={(gender) => gender}
            multiple={false}
          />
          <InputPlus
            type="checkbox"
            title="View name publicly"
            name="isNameViewed"
            id="isNameViewed"
            checked={formik.values.isNameViewed}
            onChange={formik.handleChange}
            inputPlusContainerProps={{ className: " gap-3" }}
            oneline
          />
          <Button type="submit" disabled={formik.isSubmitting} className="mt-2">
            {formik.isSubmitting ? "Signing up..." : "Sign up"}
          </Button>
          {error && <Alert color="danger">{error}</Alert>}
          <div className="flex items-center mt-2">
            <div className="border-b w-full border-gray-300 "></div>
            <div className="mx-3 text-md min-w-max text-gray-400">OR</div>
            <div className="border-b w-full border-gray-300"></div>
          </div>
          <div>
            <p className="inline-block text-gray-400 font-medium me-2">
              Have an account?
            </p>
            <AppLink
              to="/login"
              className="text-(--accent) hover:text-(--primary) mt-1 duration-150 underline text-shadow-2xs w-fit"
            >
              Login
            </AppLink>
          </div>
        </form>
      </Paper>
    </div>
  );
}
