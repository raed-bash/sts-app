import * as React from "react";
import {
  useSelectApi,
  type QueryResponseType,
  type UseSelectApiOptions,
} from "@/shared/hooks/useSelectApi";
import { ComboboxList, ComboboxItem } from "@/shared/components/ui/combobox";
import ComboboxField, { type ComboboxFieldProps } from "./ComboboxField";
import { cn } from "cn";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  ComboboxApiContext,
  useComboboxApiContext,
} from "./contexts/combobox-api-context";
import { useDebouncedValue } from "@/shared/hooks";

export type ComboboxApiChildren<Value> = (
  data: InfiniteData<QueryResponseType<Value>, unknown> | undefined,
  query: UseInfiniteQueryResult<
    InfiniteData<QueryResponseType<Value>, unknown>,
    Error
  >,
) => React.ReactNode;

export type ComboboxApiProps<
  Value,
  Multiple extends boolean | undefined = false,
> = Omit<ComboboxFieldProps<Value, Multiple>, "children"> & {
  queryProps: UseSelectApiOptions<Value>;
  children: ComboboxApiChildren<Value>;
  searchKey: string;
};

function ComboboxApi<Value, Multiple extends boolean | undefined = false>({
  queryProps,
  searchKey = "search",
  ...props
}: ComboboxApiProps<Value, Multiple>) {
  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebouncedValue(search);

  const { listBoxProps, data, infiniteQuery } = useSelectApi<Value>({
    ...queryProps,
    queryKey: [...queryProps.queryKey, debouncedSearch],
    queryFn: (query, ...args) =>
      queryProps.queryFn({ ...query, [searchKey]: debouncedSearch }, ...args),
  });

  return (
    <ComboboxApiContext.Provider
      value={{
        listBoxProps: listBoxProps,
        hasNextPage: infiniteQuery.hasNextPage,
        isFetching: infiniteQuery.isFetching,
      }}
    >
      <ComboboxField<Value, Multiple>
        {...props}
        onInputValueChange={(value) => {
          setSearch(value);
        }}
        inputValue={search}
      >
        {props.children(data, infiniteQuery)}
      </ComboboxField>
    </ComboboxApiContext.Provider>
  );
}

export default ComboboxApi;

export type ComboboxApiListProps = Parameters<typeof ComboboxList>[0] & {
  noMoreItemsTitle?: React.ReactNode;
};

export function ComboboxApiList({
  noMoreItemsTitle = "No more items",
  ...props
}: ComboboxApiListProps) {
  const { listBoxProps, hasNextPage, isFetching } = useComboboxApiContext();

  return (
    <ComboboxList
      {...listBoxProps}
      {...props}
      className={cn("max-h-72", props.className)}
    >
      {(() => {
        if (props.children && typeof props.children === "function")
          return props.children;

        return (
          <>
            {props.children}
            <ComboboxItem
              disabled
              className="justify-center"
              unselectable="on"
              value={crypto.randomUUID()}
            >
              {isFetching ? (
                <Spinner className="justify-center" />
              ) : (
                !hasNextPage && noMoreItemsTitle
              )}
            </ComboboxItem>
          </>
        );
      })()}
    </ComboboxList>
  );
}
