import {
  useFormik,
  type FormikConfig,
  type FormikErrors,
  type FormikValues,
} from "formik";
import { useMemo } from "react";
import type { ZodError, ZodObject } from "zod";

export function useAppFormik<Values extends FormikValues = FormikValues>(
  formikConfig: FormikConfig<Values> & {
    validationZodSchema?: ZodObject;
  },
) {
  const getValidate = () => {
    return (values: Values) => {
      if (formikConfig.validate) return formikConfig.validate(values);

      if (!formikConfig.validationZodSchema) return;

      const result = formikConfig.validationZodSchema.safeParse(values);

      if (!result.success) {
        return zodToFormikErrors(result.error);
      }
    };
  };

  const formik = useFormik<Values>({
    ...formikConfig,
    validate: getValidate(),
  });

  const touchedErrors = useMemo(() => {
    const touchedErrors: FormikErrors<Values> = {};

    const errors = formik.errors;

    const touched = formik.touched;

    for (const key in errors) {
      if (touched[key]) {
        touchedErrors[key] = errors[key];
      }
    }

    return touchedErrors;
  }, [formik]);

  return { ...formik, touchedErrors };
}

const zodToFormikErrors = (error: ZodError) => {
  const formikErrors: Record<string, string> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");

    formikErrors[path] = err.message;
  });
  return formikErrors;
};
