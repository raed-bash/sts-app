import * as React from "react";
import { cn } from "cn";
import {
  useSelectApi,
  type QueryResponseType,
  type UseSelectApiOptions,
} from "@/shared/hooks/useSelectApi";
import { ComboboxItem } from "@/shared/components/ui/combobox";
import ComboboxField, { type ComboboxFieldProps } from "./ComboboxField";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { Spinner } from "@/shared/components/ui/spinner";
import { useDebouncedValue } from "@/shared/hooks";
import { mergeRefs } from "@/shared/utils";

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
  noMoreItemsTitle?: React.ReactNode;
};

function ComboboxApi<Value, Multiple extends boolean | undefined = false>({
  queryProps,
  searchKey = "search",
  noMoreItemsTitle = "No more items",
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
    <ComboboxField<Value, Multiple>
      inputValue={search}

      {...props}
      listProps={{
        ...listBoxProps,
        className: cn("max-h-72", props.listProps?.className),
      }}

      onInputValueChange={(value, e) => {
        setSearch(value);

        props?.onInputValueChange?.(value, e);
      }}

      contentRef={mergeRefs(listBoxProps.ref, props.contentRef)}

      onScroll={(e) => {
        props.onScroll?.(e);

        listBoxProps.onScroll(e);
      }}
    >
      {props.children(data, infiniteQuery)}
      <ComboboxItem
        disabled
        className="justify-center"
        unselectable="on"
        value={crypto.randomUUID()}
      >
        {infiniteQuery.isFetching ? (
          <Spinner className="justify-center" />
        ) : (
          !infiniteQuery.hasNextPage && noMoreItemsTitle
        )}
      </ComboboxItem>
    </ComboboxField>
  );
}

export default ComboboxApi;
