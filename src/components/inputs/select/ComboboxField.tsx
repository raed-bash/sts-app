import {
  Combobox,
  ComboboxChipsInput,
  ComboboxInput,
} from "@/components/ui/combobox";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import {
  SyntheticEvent,
  type SyntheticEventHandler,
} from "@/components/utils/events";
import { cn } from "@/components/lib";
import {
  ComboboxContext,
  useComboboxContext,
} from "./contexts/combobox-context";

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

          props?.onChange?.(
            new SyntheticEvent<Value>(props.name, value as Value),
          );
        }}
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
