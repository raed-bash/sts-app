import { useState } from "react";
import useSelectApi, {
  type QueryFnParams,
  type QueryResponseType,
  type UseSelectApiOptions,
} from "../../hooks/useSelectApi";
import RawAutocomplete, {
  type RawAutocompleteProps,
} from "./select/RawAutocomplete";
import Loading from "../skeleton/Loading";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import type {
  MultiSelectProps,
  OptionType,
  SignleSelectProps,
} from "./select/hooks/useRawSelectUtils";
import { cn } from "src/utils/cn";

export type AutocompleteApiFnParams = QueryFnParams & { search: string };

export type AutocompleteApiProps<TData extends OptionType> = Omit<
  RawAutocompleteProps<TData>,
  "onChange" | "multiple" | "getInputLabel" | "value" | "options"
> &
  (SignleSelectProps<TData> | MultiSelectProps<TData>) &
  Omit<UseSelectApiOptions<TData>, "queryFn"> & {
    delay?: number;

    helperText?: string;

    error?: boolean;

    helperTextProps?: React.HTMLAttributes<HTMLParagraphElement>;

    /**
     * @default true
     */
    noneValue?: boolean;

    queryFn: (
      params: AutocompleteApiFnParams
    ) => Promise<QueryResponseType<TData>>;
  };

function AutocompleteApi<TData extends OptionType>({
  queryFn,
  queryKey = [],
  helperText,
  helperTextProps = {},
  error,
  delay = 500,
  ...props
}: AutocompleteApiProps<TData>) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, delay);

  const {
    allData,
    handleScroll,
    infiniteQueryOptions: { isFetching },
  } = useSelectApi({
    queryFn: (query, ...args) =>
      queryFn({ search: debouncedSearch, ...query }, ...args),
    queryKey: [...queryKey, debouncedSearch],
  });

  return (
    <div>
      <RawAutocomplete
        optionsContainer={{
          onScroll: handleScroll,
        }}
        onInputChange={(e) => {
          setSearch(e.target.value);
        }}
        options={allData}
        {...props}
        className={cn(
          helperText && error && "border-danger-main",
          props.className
        )}
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
        localFilter={false}
      />
      <p
        {...helperTextProps}
        className={cn(
          "text-sm",
          error && "text-danger-main ",
          helperTextProps.className
        )}
      >
        {helperText}
      </p>
    </div>
  );
}

export default AutocompleteApi;
