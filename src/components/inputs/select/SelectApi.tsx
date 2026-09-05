import * as React from "react";
import {
  useSelectApi,
  type QueryResponseType,
  type UseSelectApiOptions,
} from "../../hooks";
import SelectField, { type SelectFieldProps } from "./SelectField";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { SelectItem } from "../../ui/select";
import { Spinner } from "../../ui/spinner";

export type SelectApiChildren<Value> = (
  data: InfiniteData<QueryResponseType<Value>, unknown> | undefined,
  query: UseInfiniteQueryResult<
    InfiniteData<QueryResponseType<Value>, unknown>,
    Error
  >,
) => React.ReactNode;

export type SelectApiProps<
  Value,
  Multiple extends boolean | undefined = false,
> = Omit<SelectFieldProps<Value, Multiple>, "children"> & {
  queryProps: UseSelectApiOptions<Value>;
  children: SelectApiChildren<Value>;
  noMoreItemsTitle?: React.ReactNode;
};

function SelectApi<Value, Multiple extends boolean | undefined = false>({
  noMoreItemsTitle = "No more items",
  queryProps,
  ...props
}: SelectApiProps<Value, Multiple>) {
  const { listBoxProps, data, infiniteQuery } = useSelectApi<Value>(queryProps);

  return (
    <SelectField<Value, Multiple>
      alignItemWithTrigger={false}
      onScroll={listBoxProps.onScroll}
      contentRef={listBoxProps.ref}
      {...props}
    >
      {props.children(data, infiniteQuery)}
      <SelectItem
        disabled
        itemTextProps={{ className: "justify-center " }}
        className="pr-0"
        unselectable="on"
        value={crypto.randomUUID()}
      >
        {infiniteQuery.isFetching ? (
          <Spinner className="justify-center" />
        ) : (
          !infiniteQuery.hasNextPage && noMoreItemsTitle
        )}
      </SelectItem>
    </SelectField>
  );
}

export default SelectApi;
