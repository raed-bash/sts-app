import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { cn } from "cn";
import {
  ComboboxContext,
  useComboboxContext,
} from "./contexts/combobox-context";
import { SyntheticEvent, type SyntheticEventHandler } from "@/shared/utils";
import {
  Combobox,
  ComboboxChipsInput,
  ComboboxInput,
} from "@/shared/components/ui/combobox";

export type ComboboxFieldProps<
  Value,
  Multiple extends boolean | undefined = false,
> = ComboboxPrimitive.Root.Props<Value, Multiple> & {
  className?: string;
  "aria-invalid"?: boolean;
  onChange?: SyntheticEventHandler<Value>;
};

export default function ComboboxField<
  Value,
  Multiple extends boolean | undefined = false,
>({
  "aria-invalid": ariaInvalid,
  className,
  name = "",
  ...props
}: ComboboxFieldProps<Value, Multiple>) {
  return (
    <ComboboxContext.Provider
      value={{ "aria-invalid": ariaInvalid, className }}
    >
      <Combobox<Value, Multiple>
        {...props}
        onValueChange={(value, ...args) => {
          props.onValueChange?.(value, ...args);

          props?.onChange?.(new SyntheticEvent<Value>(name, value as Value));
        }}
        name={name}
      />
    </ComboboxContext.Provider>
  );
}

export function ComboboxFieldInput(props: Parameters<typeof ComboboxInput>[0]) {
  const ctx = useComboboxContext();

  return (
    <ComboboxInput
      aria-invalid={ctx["aria-invalid"]}
      {...props}
      className={cn(ctx.className, props.className)}
    />
  );
}

export function ComboboxFieldChipsInput(
  props: Parameters<typeof ComboboxChipsInput>[0],
) {
  const ctx = useComboboxContext();

  return (
    <ComboboxChipsInput
      aria-invalid={ctx["aria-invalid"]}
      {...props}
      className={cn(ctx.className, props.className)}
    />
  );
}
