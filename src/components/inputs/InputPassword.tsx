import { useState } from "react";
import Input, { type InputProps } from "./Input";
import EyeIcon from "./icons/eye.svg?react";
import EyeSlashIcon from "./icons/eye-slash.svg?react";
import IconButton from "../buttons/IconButton";

const iconStyle =
  "fill-(--text) group-hover:fill-(--primary) duration-75 aria-invalid:fill-(--danger)";

export default function InputPassword(props: Omit<InputProps, "type">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={showPassword ? "text" : "password"} />
      <IconButton
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-1/2 right-2 -translate-y-1/2 p-1 group"
      >
        {showPassword ? (
          <EyeSlashIcon
            className={iconStyle}
            aria-invalid={props["aria-invalid"]}
          />
        ) : (
          <EyeIcon className={iconStyle} aria-invalid={props["aria-invalid"]} />
        )}
      </IconButton>
    </div>
  );
}
