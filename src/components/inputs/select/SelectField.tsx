import { Select, SelectTrigger } from "@/components/ui/select";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import {
  SyntheticEvent,
  type SyntheticEventHandler,
} from "@/components/utils/events";
import { cn } from "@/components/lib";
import { SelectContext, useSelectContext } from "./contexts/select-context";

export type SelectFieldProps<
  Value,
  Multiple extends boolean | undefined = false,
> = SelectPrimitive.Root.Props<Value, Multiple> & {
  className?: string;
  "aria-invalid"?: boolean;
  onChange?: SyntheticEventHandler<Value>;
};

export default function SelectField<
  Value,
  Multiple extends boolean | undefined = false,
>({
  "aria-invalid": ariaInvalid,
  className,
  ...props
}: SelectFieldProps<Value, Multiple>) {
  return (
    <SelectContext.Provider value={{ "aria-invalid": ariaInvalid, className }}>
      <Select<Value, Multiple>
        {...props}
        onValueChange={(value, ...args) => {
          props.onValueChange?.(value, ...args);

          props?.onChange?.(
            new SyntheticEvent<Value>(props.name, value as Value),
          );
        }}
      />
    </SelectContext.Provider>
  );
}

export function SelectFieldTrigger(props: Parameters<typeof SelectTrigger>[0]) {
  const ctx = useSelectContext();

  return (
    <SelectTrigger
      aria-invalid={ctx["aria-invalid"]}
      {...props}
      className={cn(ctx.className, props.className)}
    />
  );
}
