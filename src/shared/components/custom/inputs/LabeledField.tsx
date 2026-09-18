import Input from "./Input";
import { cn } from "cn";
import type { HTMLInputTypeAttribute, ReactNode } from "react";
import type { OnlyStringLiterals } from "@/shared/types/utils";
import InputPassword from "./InputPassword";
import Checkbox from "./Checkbox";
import { Textarea } from "@/shared/components/ui/textarea";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/shared/components/ui/field";
import type { SelectFieldProps } from "../select/SelectField";
import type { SelectApiProps } from "../select/SelectApi";
import type { ComboboxApiProps } from "../combobox/ComboboxApi";
import type { ComboboxFieldProps } from "../combobox/ComboboxField";
import { NativeSelect, type NativeSelectProps } from "../../ui/native-select";
import ComboboxApi from "../combobox/ComboboxApi";
import ComboboxField from "../combobox/ComboboxField";
import SelectField from "../select/SelectField";
import SelectApi from "../select/SelectApi";

export type InputPropsWithType = React.ComponentProps<"input"> & {
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

export type TextareaPropsWithType = React.ComponentProps<"textarea"> & {
  type: "textarea";
};

export type NativeSelectPropsWithType = NativeSelectProps & {
  type: "nativeSelect";
};

export type LabeledFieldProps<
  Value,
  Multiple extends boolean | undefined = false,
> = (
  | ComboboxApiPropsWithType<Value, Multiple>
  | ComboboxPropsWithType<Value, Multiple>
  | InputPropsWithType
  | SelectPropsWithType<Value, Multiple>
  | TextareaPropsWithType
  | SelectApiPropsWithType<Value, Multiple>
  | NativeSelectPropsWithType
) & {
  title?: string;

  oneline?: boolean;

  titleIcon?: ReactNode;

  loading?: boolean;

  inputPlusContainerProps?: React.ComponentProps<"div">;

  skeletonProps?: React.ComponentProps<typeof Skeleton>;

  titleProps?: React.ComponentProps<"label">;

  id?: string;

  error?: boolean;

  helperText?: string;

  helperTextProps?: React.ComponentProps<"p">;
};

function LabeledField<Value, Multiple extends boolean | undefined = false>({
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
}: LabeledFieldProps<Value, Multiple>) {
  const hasTitle = Boolean(title || titleIcon);

  const invalid = Boolean(helperText && error);

  return (
    <Field
      {...inputPlusContainerProps}
      data-invalid={invalid ? true : undefined}
      orientation={
        oneline && props.type !== "checkbox" ? "horizontal" : "vertical"
      }
      className={cn(
        "w-full gap-1",
        oneline &&
          (props.type === "checkbox"
            ? "flex-row-reverse items-center justify-end [&>*]:w-auto!"
            : "flex-row items-center"),
        inputPlusContainerProps.className,
      )}
    >
      {hasTitle && (
        <FieldLabel
          {...titleProps}
          htmlFor={props.id}
          className={cn(
            "gap-1 text-base",
            oneline && "flex-none",
            titleProps.className,
          )}
        >
          {title}
          {titleIcon}
        </FieldLabel>
      )}
      <FieldContent
        className={cn(
          oneline &&
            props.type === "checkbox" &&
            "flex-none justify-center items-center",
        )}
      >
        {loading ? (
          <Skeleton {...skeletonProps} />
        ) : props.type === "comboboxApi" ? (
          <ComboboxApi
            aria-invalid={invalid ? true : undefined}
            {...props}
            className={cn("w-full", props.className)}
          />
        ) : props.type === "combobox" ? (
          <ComboboxField
            aria-invalid={invalid ? true : undefined}
            {...props}
            className={cn("w-full", props.className)}
          />
        ) : props.type === "select" ? (
          <SelectField
            aria-invalid={invalid ? true : undefined}
            {...props}
            className={cn("w-full", props.className)}
          />
        ) : props.type === "nativeSelect" ? (
          <NativeSelect
            aria-invalid={invalid ? true : undefined}
            {...props}
            className={cn("w-full", props.className)}
          />
        ) : props.type === "textarea" ? (
          <Textarea {...props} aria-invalid={invalid ? true : undefined} />
        ) : props.type === "selectApi" ? (
          <SelectApi
            aria-invalid={invalid ? true : undefined}
            {...props}
            className={cn("w-full", props.className)}
          />
        ) : props.type === "password" ? (
          <InputPassword {...props} aria-invalid={invalid ? true : undefined} />
        ) : props.type === "checkbox" ? (
          <Checkbox {...props} aria-invalid={invalid ? true : undefined} />
        ) : (
          <Input {...props} aria-invalid={invalid ? true : undefined} />
        )}
        {helperText ? (
          invalid ? (
            <FieldError {...helperTextProps}>{helperText}</FieldError>
          ) : (
            <FieldDescription {...helperTextProps}>
              {helperText}
            </FieldDescription>
          )
        ) : null}
      </FieldContent>
    </Field>
  );
}

export default LabeledField;
