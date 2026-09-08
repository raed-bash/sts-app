import * as React from "react";
import type { BaseUIEvent } from "@base-ui/react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "cn";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { SyntheticEvent, type SyntheticEventHandler } from "@/shared/utils";

export type SelectFieldProps<
  Value,
  Multiple extends boolean | undefined = false,
> = SelectPrimitive.Root.Props<Value, Multiple> & {
  className?: string;
  "aria-invalid"?: boolean;
  onChange?: SyntheticEventHandler<Value>;
  placeholder?: React.ReactNode;
  contentRef?: React.Ref<HTMLDivElement> | undefined;
  onScroll?:
    | ((event: BaseUIEvent<React.UIEvent<HTMLDivElement, UIEvent>>) => void)
    | undefined;
  alignItemWithTrigger?: boolean | undefined;
  getInputLabel?:
    | React.ReactNode
    | ((
        value: Multiple extends true ? Value[] : Value | undefined,
      ) => React.ReactNode);
};

export default function SelectField<
  Value,
  Multiple extends boolean | undefined = false,
>({
  "aria-invalid": ariaInvalid,
  className,
  placeholder,
  contentRef,
  onScroll,
  alignItemWithTrigger,
  getInputLabel,
  name = "",
  ...props
}: SelectFieldProps<Value, Multiple>) {
  return (
    <Select<Value, Multiple>
      {...props}
      onValueChange={(value, ...args) => {
        props.onValueChange?.(value, ...args);

        props?.onChange?.(new SyntheticEvent<Value>(name, value as Value));
      }}
      name={name}
    >
      <SelectTrigger aria-invalid={ariaInvalid} className={cn(className)}>
        <SelectValue placeholder={placeholder}>{getInputLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent
        ref={contentRef}
        onScroll={onScroll}
        className={cn("max-h-72")}
        alignItemWithTrigger={alignItemWithTrigger}
      >
        {props.children}
      </SelectContent>
    </Select>
  );
}
