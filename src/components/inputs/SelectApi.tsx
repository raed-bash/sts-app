import React, { useId, type ReactNode } from "react";
import Option from "./select/Option";
import RawSelect from "./select/RawSelect";
import Loading from "../skeleton/Loading";
import useSelectApi, { type QueryFn } from "../../hooks/useSelectApi";
import { cn } from "src/utils/cn";

export type SelectApiProps<TData> = {
  queryFn: QueryFn<TData>;

  queryKey: readonly unknown[];

  helperText?: string;

  error?: boolean;

  helperTextProps?: React.HTMLAttributes<HTMLParagraphElement>;

  /**
   * @default true
   */
  noneValue: boolean;

  children?: (data: TData) => ReactNode;
};

/**
 * @callback children
 * @param {object} data
 * @returns {Option}
 */

/**
 * @typedef utils
 * @property {children} children
 */

/**
 * @typedef selectApiProps
 * @type {import("./RawSelect/RawSelect").rawSelectProps & utils & import("../../hooks/useSelectApi").useSelectApiOptions & import("./Input").utils}
 */

/**
 * @param {selectApiProps} props
 */
function SelectApi<TData>({
  queryFn,
  queryKey = [],
  children = () => "",
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

  const [id1, id2] = [useId(), useId()];

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
      >
        {allData.length &&
          [
            ...(!props.multiple && noneValue
              ? [
                  {
                    info: true,
                    content: (
                      <Option key={id1 + 1} value="">
                        لا شيء
                      </Option>
                    ),
                  },
                ]
              : []),
            ...allData,
            {
              info: true,
              content: isFetching ? (
                <Option
                  disabled
                  value={null}
                  className="flex justify-center py-1 "
                  key={id1}
                >
                  <Loading className="w-5 h-5" />
                </Option>
              ) : (
                <Option
                  disabled
                  value={null}
                  className="flex justify-center py-1"
                  key={id2}
                >
                  لا يوجد بيانات آخرى...
                </Option>
              ),
            },
          ].map((data) =>
            data.info === true ? data.content : children(data as TData)
          )}
      </RawSelect>
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
