import InputPlus, { type InputPlusProps } from "./InputPlus";
import type { OptionType } from "./select/hooks/useRawSelectUtils";

export type InputPlusFormikProps<TOption extends OptionType> =
  InputPlusProps<TOption> & {
    name: string;

    values?: Record<any, any>;

    errors?: Record<any, any>;
  };

function InputPlusFormik<TOption extends OptionType>({
  values = {},
  errors = {},
  ...props
}: InputPlusFormikProps<TOption>) {
  return (
    <InputPlus
      {...props}
      error
      helperText={errors[props.name]}
      value={values[props.name]}
    />
  );
}

export default InputPlusFormik;
