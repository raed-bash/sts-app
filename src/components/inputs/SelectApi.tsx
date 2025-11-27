import React from "react";
import RawSelect, { type RawSelectProps } from "./select/RawSelect";
import Loading from "../skeleton/Loading";
import useSelectApi, {
  type UseSelectApiOptions,
} from "../../hooks/useSelectApi";
import { cn } from "src/utils/cn";
import type {
  MultiSelectProps,
  OptionType,
  SignleSelectProps,
} from "./select/hooks/useRawSelectUtils";
import { wrapInArrayIf } from "src/utils/wrapInArrayIf";
import type { OptionProps } from "./select/Option";

export type SelectApiProps<TData extends OptionType> = Omit<
  RawSelectProps<TData>,
  "onChange" | "multiple" | "getInputLabel" | "value" | "options"
> &
  UseSelectApiOptions<TData> &
  (SignleSelectProps<TData> | MultiSelectProps<TData>) & {
    helperText?: string;

    error?: boolean;

    helperTextProps?: React.HTMLAttributes<HTMLParagraphElement>;

    /**
     * @default true
     */
    noneValue?: boolean;
  };

function SelectApi<TData extends OptionType>({
  queryFn,
  queryKey = [],
  helperText,
  helperTextProps = {},
  error,
  noneValue = true,
  ...props
}: SelectApiProps<TData>) {
  const {
    handleScroll,
    allData,
    infiniteQueryOptions: { isFetching },
  } = useSelectApi<TData>({
    queryFn,
    queryKey,
  });

  return (
    <div>
      <RawSelect
        optionsContainer={{
          onScroll: handleScroll,
        }}
        {...props}
        className={cn(
          `w-full h-[35px]`,
          helperText && error ? "border-danger-main" : "",
          props.className
        )}
        options={allData}
        startHelperOptions={[
          ...wrapInArrayIf(!props.multiple || noneValue, {
            value: "",
            children: "لا شيء",
            selected: props.value === "" || props.value === undefined,
          } as OptionProps),
        ]}
        endHelperOptions={[
          isFetching
            ? {
                disabled: true,
                value: null,
                className: "flex justify-center py-1",
                children: <Loading className="w-5 h-5" />,
              }
            : {
                disabled: true,
                value: null,
                className: "flex justify-center py-1",
                children: "لا يوجد بيانات آخرى...",
              },
        ]}
      />
      <p
        {...helperTextProps}
        className={cn(
          "text-sm",
          error && "text-red-600 ",
          helperTextProps.className
        )}
      >
        {helperText}
      </p>
    </div>
  );
}

export default SelectApi;
