import Skeleton, { type SkeletonProps } from "../skeleton/Skeleton";
import Input, { type InputProps } from "./Input";
import TextArea, { type TextAreaProps } from "./TextArea";
import { cn } from "cn";
import type { HTMLInputTypeAttribute, ReactNode } from "react";
import type { OnlyStringLiterals } from "@/shared/types/utils";
import InputPassword from "./InputPassword";
import Checkbox from "./Checkbox";
import type { SelectFieldProps } from "../select/SelectField";
import type { SelectApiProps } from "../select/SelectApi";
import type { ComboboxApiProps } from "../combobox/ComboboxApi";
import type { ComboboxFieldProps } from "../combobox/ComboboxField";
import { NativeSelect, type NativeSelectProps } from "../../ui/native-select";
import ComboboxApi from "../combobox/ComboboxApi";
import ComboboxField from "../combobox/ComboboxField";
import SelectField from "../select/SelectField";
import SelectApi from "../select/SelectApi";

export type InputPropsWithType = InputProps & {
  type: OnlyStringLiterals<HTMLInputTypeAttribute>;
};

export type SelectPropsWithType<
  Value,
  Multiple extends boolean | undefined = false,
> = SelectFieldProps<Value, Multiple> & {
  type: "select";
};

export type SelectApiPropsWithType<
  Value,
  Multiple extends boolean | undefined = false,
> = SelectApiProps<Value, Multiple> & {
  type: "selectApi";
};
export type ComboboxApiPropsWithType<
  Value,
  Multiple extends boolean | undefined = false,
> = ComboboxApiProps<Value, Multiple> & {
  type: "comboboxApi";
};

export type ComboboxPropsWithType<
  Value,
  Multiple extends boolean | undefined = false,
> = ComboboxFieldProps<Value, Multiple> & {
  type: "combobox";
};

export type TextAreaPropsWithType = TextAreaProps & {
  type: "textarea";
};

export type NativeSelectPropsWithType = NativeSelectProps & {
  type: "nativeSelect";
};

export type InputPlusProps<
  Value,
  Multiple extends boolean | undefined = false,
> = (
  | ComboboxApiPropsWithType<Value, Multiple>
  | ComboboxPropsWithType<Value, Multiple>
  | InputPropsWithType
  | SelectPropsWithType<Value, Multiple>
  | TextAreaPropsWithType
  | SelectApiPropsWithType<Value, Multiple>
  | NativeSelectPropsWithType
) & {
  title?: string;

  oneline?: boolean;

  titleIcon?: ReactNode;

  loading?: boolean;

  inputPlusContainerProps?: React.ComponentProps<"div">;

  skeletonProps?: SkeletonProps;

  titleProps?: React.ComponentProps<"div">;

  id?: string;

  error?: boolean;

  helperText?: string;

  helperTextProps?: React.ComponentProps<"p">;
};

function InputPlus<Value, Multiple extends boolean | undefined = false>({
  title,
  titleIcon,
  loading,
  inputPlusContainerProps = {},
  skeletonProps = {},
  titleProps = {},
  error,
  helperText,
  helperTextProps = {},
  oneline = false,
  ...props
}: InputPlusProps<Value, Multiple>) {
  const hasTitle = Boolean(title || titleIcon);

  const hasMultiChilds = Boolean(hasTitle || helperText);

  return (
    <div
      {...inputPlusContainerProps}
      className={cn(
        "flex flex-col w-full",
        oneline
          ? props.type === "checkbox"
            ? "items-center justify-end  flex-row-reverse "
            : "flex-row items-center"
          : "",
        hasMultiChilds ? "gap-1" : "",
        inputPlusContainerProps.className,
      )}
    >
      {hasTitle && (
        <h2
          {...titleProps}
          className={cn(
            "text-[16px] font-medium flex gap-1 aria-invalid:text-(--danger)",
            titleProps.className,
          )}
          aria-invalid={Boolean(helperText && error)}
        >
          <label htmlFor={props.id}>{title}</label>
          {titleIcon}
        </h2>
      )}
      {loading ? (
        <Skeleton {...skeletonProps} />
      ) : props.type === "comboboxApi" ? (
        <ComboboxApi
          aria-invalid={Boolean(helperText && error)}
          {...props}
          className={cn("w-full", props.className)}
        />
      ) : props.type === "combobox" ? (
        <ComboboxField
          aria-invalid={Boolean(helperText && error)}
          {...props}
          className={cn("w-full", props.className)}
        />
      ) : props.type === "select" ? (
        <SelectField
          aria-invalid={Boolean(helperText && error)}
          {...props}
          className={cn("w-full", props.className)}
        />
      ) : props.type === "nativeSelect" ? (
        <NativeSelect
          aria-invalid={Boolean(helperText && error)}
          {...props}
          className={cn("w-full", props.className)}
        />
      ) : props.type === "textarea" ? (
        <TextArea {...props} />
      ) : props.type === "selectApi" ? (
        <SelectApi
          aria-invalid={Boolean(helperText && error)}
          {...props}
          className={cn("w-full", props.className)}
        />
      ) : props.type === "password" ? (
        <InputPassword {...props} aria-invalid={Boolean(helperText && error)} />
      ) : props.type === "checkbox" ? (
        <Checkbox {...props} aria-invalid={Boolean(helperText && error)} />
      ) : (
        <Input {...props} aria-invalid={Boolean(helperText && error)} />
      )}
      {helperText && (
        <p
          {...helperTextProps}
          className={cn(
            error && "text-(--danger)",
            "text-xs",
            helperTextProps.className,
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export default InputPlus;
