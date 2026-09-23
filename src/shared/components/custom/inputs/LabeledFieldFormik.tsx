import LabeledField, { type LabeledFieldProps } from "./LabeledField";
import type { FormikValues } from "formik";

export type LabeledFieldFormikProps<
  Value,
  Multiple extends boolean | undefined = false,
> = LabeledFieldProps<Value, Multiple> & {
  name: string;

  values?: FormikValues;

  errors?: FormikValues;
};

function LabeledFieldFormik<
  Value,
  Multiple extends boolean | undefined = false,
>({
  name,
  values = {},
  errors = {},
  ...props
}: LabeledFieldFormikProps<Value, Multiple>) {
  const binding =
    props.type === "checkbox"
      ? { checked: Boolean(values[name]) }
      : { value: values[name] };

  return (
    <LabeledField<Value, Multiple>
      {...props}
      {...binding}
      error={Boolean(errors[name])}
      helperText={errors[name]}
    />
  );
}

export default LabeledFieldFormik;
