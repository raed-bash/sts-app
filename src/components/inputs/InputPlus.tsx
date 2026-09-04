import Skeleton, { type SkeletonProps } from "../skeleton/Skeleton";
import Input, { type InputProps } from "./Input";
import TextArea, { type TextAreaProps } from "./TextArea";
import { cn } from "src/utils/cn";
import type { HTMLInputTypeAttribute, ReactNode } from "react";
import type { OptionType } from "./select/hooks/useRawSelectUtils";
import RawAutocomplete, {
  type RawAutocompleteProps,
} from "./select/RawAutocomplete";
import type { OnlyStringLiterals } from "src/types/utils";
import type { AutocompleteApiProps } from "./AutocompleteApi";
import AutocompleteApi from "./AutocompleteApi";
import type { SelectApiProps } from "./select/SelectApi";
import SelectApi from "./select/SelectApi";
import InputPassword from "./InputPassword";
import Checkbox from "./Checkbox";
import { NativeSelect, type NativeSelectProps } from "../ui/native-select";
import SelectField, { type SelectFieldProps } from "./select/SelectField";
import ComboboxField, { type ComboboxFieldProps } from "./select/ComboboxField";

export type InputPropsWithType = InputProps & {
  type: OnlyStringLiterals<HTMLInputTypeAttribute>;
};

export type SelectPropsWithType<TOption extends OptionType> =
  SelectFieldProps<TOption> & {
    type: "select";
  };

export type SelectApiPropsWithType<TOption extends OptionType> =
  SelectApiProps<TOption> & {
    type: "selectApi";
  };

export type AutocompletePropsWithType<TOption extends OptionType> =
  RawAutocompleteProps<TOption> & {
    type: "autocomplete";
  };

export type ComboboxPropsWithType<
  TOption extends OptionType,
  Multiple extends boolean | undefined = false,
> = ComboboxFieldProps<TOption, Multiple> & {
  type: "combobox";
};

export type AutocompleteApiPropsWithType<TOption extends OptionType> =
  AutocompleteApiProps<TOption> & {
    type: "autocompleteApi";
  };

export type TextAreaPropsWithType = TextAreaProps & {
  type: "textarea";
};

export type NativeSelectPropsWithType = NativeSelectProps & {
  type: "nativeSelect";
};

export type InputPlusProps<
  TOption extends OptionType,
  Multiple extends boolean | undefined = false,
> = (
  | ComboboxPropsWithType<TOption, Multiple>
  | InputPropsWithType
  | SelectPropsWithType<TOption>
  | AutocompletePropsWithType<TOption>
  | TextAreaPropsWithType
  | AutocompleteApiPropsWithType<TOption>
  | SelectApiPropsWithType<TOption>
  | NativeSelectPropsWithType
) & {
  title?: string;

  oneline?: boolean;

  titleIcon?: ReactNode;

  loading?: boolean;

  inputPlusContainerProps?: React.HTMLAttributes<HTMLDivElement>;

  skeletonProps?: SkeletonProps;

  titleProps?: React.HTMLAttributes<HTMLDivElement>;

  id?: string;

  error?: boolean;

  helperText?: string;

  helperTextProps?: React.HTMLAttributes<HTMLParagraphElement>;
};

function InputPlus<
  TOption extends OptionType,
  Multiple extends boolean | undefined = false,
>({
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
}: InputPlusProps<TOption, Multiple>) {
  const hasTitle = Boolean(title || titleIcon);

  const hasMultiChilds = Boolean(hasTitle || helperText);

  return (
    <div
      {...inputPlusContainerProps}
      className={cn(
        "flex flex-col",
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
      ) : props.type === "autocomplete" ? (
        <RawAutocomplete {...props} />
      ) : props.type === "textarea" ? (
        <TextArea {...props} />
      ) : props.type === "selectApi" ? (
        <SelectApi
          aria-invalid={Boolean(helperText && error)}
          {...props}
          className={cn("w-full", props.className)}
        />
      ) : props.type === "autocompleteApi" ? (
        <AutocompleteApi {...props} />
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
