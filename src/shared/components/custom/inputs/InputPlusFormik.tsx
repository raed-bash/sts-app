import InputPlus, { type InputPlusProps } from "./InputPlus";

export type InputPlusFormikProps<
  Value,
  Multiple extends boolean | undefined = false,
> = InputPlusProps<Value, Multiple> & {
  name: string;

  values?: Record<any, any>;

  errors?: Record<any, any>;
};

function InputPlusFormik<Value, Multiple extends boolean | undefined = false>({
  values = {},
  errors = {},
  ...props
}: InputPlusFormikProps<Value, Multiple>) {
  return (
    <InputPlus<Value, Multiple>
      {...props}
      error
      helperText={errors[props.name]}
      value={values[props.name]}
    />
  );
}

export default InputPlusFormik;
