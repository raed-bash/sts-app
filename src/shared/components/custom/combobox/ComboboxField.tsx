import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { cn } from "cn";
import { SyntheticEvent, type SyntheticEventHandler } from "@/shared/utils";
import {
  Combobox,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
} from "../../ui/combobox";

export type ComboboxFieldProps<
  Value,
  Multiple extends boolean | undefined = false,
> = ComboboxPrimitive.Root.Props<Value, Multiple> & {
  className?: string;
  "aria-invalid"?: boolean;
  onChange?: SyntheticEventHandler<Value>;
  placeholder?: string;
};

export default function ComboboxField<
  Value,
  Multiple extends boolean | undefined = false,
>({
  "aria-invalid": ariaInvalid,
  className,
  placeholder,
  multiple,
  name = "",
  ...props
}: ComboboxFieldProps<Value, Multiple>) {
  return (
    <Combobox<Value, Multiple>
      {...props}
      multiple={multiple}
      name={name}
      onValueChange={(value, ...args) => {
        props.onValueChange?.(value, ...args);

        props?.onChange?.(new SyntheticEvent<Value>(name, value as Value));
      }}
    >
      <ComboboxInput
        aria-invalid={ariaInvalid}
        placeholder={placeholder}
        className={cn(className)}
      />
      <ComboboxContent>
        <ComboboxList>{props.children}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export function ComboboxFieldChipsInput(
  props: Parameters<typeof ComboboxChipsInput>[0],
) {
  // const ctx = useComboboxContext();

  return (
    <ComboboxChipsInput
      // aria-invalid={ctx["aria-invalid"]}
      {...props}
      // className={cn(ctx.className, props.className)}
    />
  );
}
