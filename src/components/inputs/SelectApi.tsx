import { memo, useMemo } from "react";
import Option from "./RawSelect/Option";
import RawSelect from "./RawSelect/RawSelect";
import Loading from "../skeleton/Loading";
import useSelectApi from "../../hooks/useSelectApi";
import { twMerge } from "tailwind-merge";

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
function SelectApi({
  fetchData = () => {},
  queryKey = [],
  children = () => {},
  useInfiniteQueryOptions = () => {},
  helperText,
  helperTextProps = {},
  error,
  noneValue = true,
  ...props
}) {
  const {
    handleScroll,
    allData,
    infiniteQueryOptions: { isFetching },
    uniqueKeys,
  } = useSelectApi({
    fetchData,
    queryKey,
    useInfiniteQueryOptions,
  });
  const classNameMemo = useMemo(
    () =>
      twMerge(
        `w-full h-[35px] ${helperText && error ? "border-danger-main" : ""}`,
        props.className
      ),
    [props.className, helperText, error]
  );

  return (
    <div>
      <RawSelect
        optionsContainer={{
          onScroll: handleScroll,
        }}
        {...props}
        className={classNameMemo}
      >
        {allData?.length &&
          [
            ...(!props.multipleSelect && noneValue
              ? [
                  {
                    info: true,
                    content: (
                      <Option key={uniqueKeys[0] + 1} value="">
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
                  key={uniqueKeys[0]}
                >
                  <Loading className="w-5 h-5" />
                </Option>
              ) : (
                <Option
                  disabled
                  value={null}
                  className="flex justify-center py-1"
                  key={uniqueKeys[1]}
                >
                  لا يوجد بيانات آخرى...
                </Option>
              ),
            },
          ].map((data) => (data.info === true ? data.content : children(data)))}
      </RawSelect>
      <p
        {...helperTextProps}
        className={
          (error && "text-red-600 ") + helperTextProps.className + " text-sm"
        }
      >
        {helperText}
      </p>
    </div>
  );
}

export default memo(SelectApi);
