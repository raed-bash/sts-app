import { useAuthContext } from "@/contexts/AuthContext";
import { signUpSchema } from "../schemas/sign-up.schema";
import { SignUpDto } from "../dtos/sign-up.dto";
import { GENDERS, type Gender } from "@/constants/gender";
import { capitalize } from "lodash";
import { useAppFormik } from "@/shared/lib/formik";
import Paper from "@/shared/components/custom/paper/Paper";
import InputPlus from "@/shared/components/custom/inputs/InputPlus";
import Button from "@/shared/components/custom/buttons/Button";
import Alert from "@/shared/components/custom/alert/Alert";
import AppLink from "@/shared/components/custom/AppLink";
import { SelectItem } from "@/shared/components/ui/select";
import { useSignUp } from "../api/sign-up.api";

export default function SignUp() {
  const authContext = useAuthContext();

  const signUpMutation = useSignUp();

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
    validationZodSchema: signUpSchema,
    onSubmit: (values) => {
      signUpMutation.mutate(new SignUpDto(values as SignUpDto), {
        onSuccess: (data) => {
          authContext.login(data);
        },
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
        className="max-w-md w-full mt-5 aria-invalid:border-(--danger) aria-invalid:border aria-invalid:ring-[3px] aria-invalid:ring-(--danger)/30 "
        aria-invalid={signUpMutation.isError}
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
            error
            getInputLabel={(gender) => capitalize(gender)}
          >
            {GENDERS.map((gender) => (
              <SelectItem key={gender} value={gender}>
                {capitalize(gender)}
              </SelectItem>
            ))}
          </InputPlus>
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
          <Button
            type="submit"
            disabled={signUpMutation.isPending}
            className="mt-2"
          >
            {signUpMutation.isPending ? "Signing up..." : "Sign up"}
          </Button>
          {signUpMutation.isError && (
            <Alert color="danger">{signUpMutation.error.message}</Alert>
          )}
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
