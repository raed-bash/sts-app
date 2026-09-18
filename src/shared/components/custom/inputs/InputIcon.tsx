import * as React from "react";
import { cn } from "cn";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/components/ui/input-group";

export type InputIconProps = Omit<React.ComponentProps<"input">, "ref"> & {
  error?: boolean;

  StartIcon?: React.ReactNode;

  EndIcon?: React.ReactNode;

  iconClassName?: string;
};

const InputIcon = React.forwardRef<HTMLInputElement, InputIconProps>(
  function InputIcon(
    {
      className,
      error,
      disabled,
      StartIcon,
      EndIcon,
      iconClassName,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) {
    const invalid =
      Boolean(error) || ariaInvalid === true || ariaInvalid === "true";

    return (
      <InputGroup className={className}>
        {StartIcon && (
          <InputGroupAddon align="inline-start">
            <span className={cn("flex items-center", iconClassName)}>
              {StartIcon}
            </span>
          </InputGroupAddon>
        )}
        <InputGroupInput
          {...props}
          ref={ref}
          disabled={disabled}
          aria-invalid={invalid ? true : undefined}
        />
        {EndIcon && (
          <InputGroupAddon align="inline-end">
            <span className={cn("flex items-center", iconClassName)}>
              {EndIcon}
            </span>
          </InputGroupAddon>
        )}
      </InputGroup>
    );
  },
);

export default InputIcon;
