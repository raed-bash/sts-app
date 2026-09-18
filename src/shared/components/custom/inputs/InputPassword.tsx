import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/shared/components/ui/button";
import InputIcon from "./InputIcon";
import { inputPasswordIconVariants } from "./input-password-variants";

function InputPassword(props: Omit<React.ComponentProps<"input">, "type">) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    className,
    disabled,
    "aria-invalid": ariaInvalid,
    ...inputProps
  } = props;
  const invalid = ariaInvalid === true || ariaInvalid === "true";

  return (
    <InputIcon
      {...inputProps}
      className={className}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      type={showPassword ? "text" : "password"}
      EndIcon={
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="group"
          onClick={() => setShowPassword((visible) => !visible)}
        >
          {showPassword ? (
            <EyeOff className={cn(inputPasswordIconVariants({ invalid }))} />
          ) : (
            <Eye className={cn(inputPasswordIconVariants({ invalid }))} />
          )}
        </Button>
      }
    />
  );
}

export default InputPassword;
