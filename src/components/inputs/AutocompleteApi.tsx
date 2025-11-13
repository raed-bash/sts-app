import { useMemo, useState } from "react";
import useSelectApi from "../../hooks/useSelectApi";
import RawAutocomplete from "./RawAutocomplete";
import Loading from "../skeleton/Loading";
import { twMerge } from "tailwind-merge";
import ParentOption from "./RawSelect/ParentOption";
import useDebouncedValue from "../../hooks/useDebouncedValue";

/**
 * @typedef utils
 * @property {any[]} options
 */

/**
 * @typedef selectApiProps
 * @type {import("./RawSelect/RawSelect").rawSelectProps & utils & import("../../hooks/useSelectApi").useSelectApiOptions & import("./Input").utils}
 */

/**
 * @param {selectApiProps} props
 */
function AutocompleteApi({
  fetchData = () => {},
  queryKey = [],
  useInfiniteQueryOptions = () => {},
  helperText,
  helperTextProps = {},
  error,
  options,
  delay = 500,
  ...props
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, delay);

  const {
    allData,
    handleScroll,
    infiniteQueryOptions: { isFetching },
    uniqueKeys,
  } = useSelectApi({
    fetchData: (query, ...args) =>
      fetchData({ search: debouncedSearch, ...query }, ...args),
    queryKey: [...queryKey, debouncedSearch],
    useInfiniteQueryOptions: {
      ...useInfiniteQueryOptions,
      enabled: !props.disabled,
    },
  });

  const classNameMemo = useMemo(
    () =>
      twMerge(
        `w-full h-[35px] ${helperText && error && "border-danger-main"}`,
        props.className
      ),
    [props.className, error, helperText]
  );
  const helperTextClassNameMemo = useMemo(
    () =>
      twMerge(
        (error && "text-danger-main ") + " text-sm",
        helperTextProps.className
      ),
    [error, helperTextProps.className]
  );

  return (
    <div>
      <RawAutocomplete
        optionsContainer={{
          onScroll: handleScroll,
        }}
        onInputChange={(e) => {
          setSearch(e.target.value);
        }}
        options={[
          ...(allData || []),
          ...(isFetching
            ? [
                {
                  helperElement: true,
                  content: () => (
                    <ParentOption
                      disabled
                      value={null}
                      className="flex justify-center py-1 "
                      key={uniqueKeys[0]}
                    >
                      <Loading className="w-5 h-5" />
                    </ParentOption>
                  ),
                },
              ]
            : [
                {
                  helperElement: true,
                  content: () => (
                    <ParentOption
                      disabled
                      value={null}
                      className="flex justify-center py-1"
                      key={uniqueKeys[1]}
                    >
                      لايوجد بيانات آخرى...
                    </ParentOption>
                  ),
                },
              ]),
        ]}
        {...props}
        className={classNameMemo}
      ></RawAutocomplete>
      <p {...helperTextProps} className={helperTextClassNameMemo}>
        {helperText}
      </p>
    </div>
  );
}

export default AutocompleteApi;
