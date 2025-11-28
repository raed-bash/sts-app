import Skeleton, { type SkeletonProps } from "../skeleton/Skeleton";
import Input, { type InputProps } from "./Input";
import TextArea, { type TextAreaProps } from "./TextArea";
import RawSelect, { type RawSelectProps } from "./select/RawSelect";
import { cn } from "src/utils/cn";
import type { HTMLInputTypeAttribute, ReactNode } from "react";
import type { OptionType } from "./select/hooks/useRawSelectUtils";
import RawAutocomplete, {
  type RawAutocompleteProps,
} from "./select/RawAutocomplete";
import type { OnlyStringLiterals } from "src/types/utils";
import type { AutocompleteApiProps } from "./AutocompleteApi";
import AutocompleteApi from "./AutocompleteApi";
import type { SelectApiProps } from "./SelectApi";
import SelectApi from "./SelectApi";

export type InputPropsWithType = InputProps & {
  type: OnlyStringLiterals<HTMLInputTypeAttribute>;
};

export type SelectPropsWithType<TOption extends OptionType> =
  RawSelectProps<TOption> & {
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

export type AutocompleteApiPropsWithType<TOption extends OptionType> =
  AutocompleteApiProps<TOption> & {
    type: "autocompleteApi";
  };

export type TextAreaPropsWithType = TextAreaProps & {
  type: "textarea";
};

export type InputPlusProps<TOption extends OptionType> = (
  | InputPropsWithType
  | SelectPropsWithType<TOption>
  | AutocompletePropsWithType<TOption>
  | TextAreaPropsWithType
  | AutocompleteApiPropsWithType<TOption>
  | SelectApiPropsWithType<TOption>
) & {
  title: string;

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

function InputPlus<TOption extends OptionType>({
  title,
  titleIcon,
  loading,
  inputPlusContainerProps = {},
  skeletonProps = {},
  titleProps = {},
  error,
  helperText,
  helperTextProps = {},
  ...props
}: InputPlusProps<TOption>) {
  return (
    <div
      {...inputPlusContainerProps}
      className={cn("flex flex-col gap-1", inputPlusContainerProps.className)}
    >
      <h2
        {...titleProps}
        className={cn(
          "max-lg:text-[14px] text-[20px] font-medium flex gap-1",
          titleProps.className
        )}
      >
        <label htmlFor={props.id}>{title}</label>
        {titleIcon}
      </h2>
      {loading ? (
        <Skeleton {...skeletonProps} />
      ) : props.type === "select" ? (
        <RawSelect {...props} />
      ) : props.type === "autocomplete" ? (
        <RawAutocomplete {...props} />
      ) : props.type === "textarea" ? (
        <TextArea {...props} />
      ) : props.type === "selectApi" ? (
        <SelectApi {...props} />
      ) : props.type === "autocompleteApi" ? (
        <AutocompleteApi {...props} />
      ) : (
        <Input {...props} />
      )}
      <p
        {...helperTextProps}
        className={cn(
          error && "text-danger-main ",
          "text-sm",
          helperTextProps.className
        )}
      >
        {helperText}
      </p>
    </div>
  );
}

export default InputPlus;
