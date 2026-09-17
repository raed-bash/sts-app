import { useState } from "react";
import Input from "./Input";
import { Eye, EyeOff } from "lucide-react";
import IconButton from "../buttons/IconButton";

const iconStyle =
  "stroke-(--text) group-hover:stroke-(--primary) duration-75 aria-invalid:stroke-(--danger)";

export default function InputPassword(
  props: Omit<Parameters<typeof Input>[0], "type">,
) {
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
          <EyeOff
            className={iconStyle}
            aria-invalid={props["aria-invalid"]}
          />
        ) : (
          <Eye className={iconStyle} aria-invalid={props["aria-invalid"]} />
        )}
      </IconButton>
    </div>
  );
}
