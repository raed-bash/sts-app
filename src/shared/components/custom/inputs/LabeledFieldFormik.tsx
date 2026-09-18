import LabeledField, { type LabeledFieldProps } from "./LabeledField";

export type LabeledFieldFormikProps<
  Value,
  Multiple extends boolean | undefined = false,
> = LabeledFieldProps<Value, Multiple> & {
  name: string;

  values?: Record<any, any>;

  errors?: Record<any, any>;
};

function LabeledFieldFormik<
  Value,
  Multiple extends boolean | undefined = false,
>({
  values = {},
  errors = {},
  ...props
}: LabeledFieldFormikProps<Value, Multiple>) {
  return (
    <LabeledField<Value, Multiple>
      {...props}
      error
      helperText={errors[props.name]}
      value={values[props.name]}
    />
  );
}

export default LabeledFieldFormik;
