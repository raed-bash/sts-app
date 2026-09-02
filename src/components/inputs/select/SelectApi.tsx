import * as React from "react";
import {
  useSelectApi,
  type QueryResponseType,
  type UseSelectApiOptions,
} from "../../hooks";
import { SelectContent, SelectItem } from "../../ui/select";
import SelectField, { type SelectFieldProps } from "./SelectField";
import { cn } from "../../lib";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { Spinner } from "../../ui/spinner";
import {
  SelectApiContext,
  useSelectApiContext,
} from "./contexts/select-api-context";

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
};

function SelectApi<Value, Multiple extends boolean | undefined = false>({
  queryProps,
  ...props
}: SelectApiProps<Value, Multiple>) {
  const { listBoxProps, data, infiniteQuery } = useSelectApi<Value>(queryProps);

  return (
    <SelectApiContext.Provider
      value={{
        listBoxProps: listBoxProps,
        hasNextPage: infiniteQuery.hasNextPage,
        isFetching: infiniteQuery.isFetching,
      }}
    >
      <SelectField<Value, Multiple> {...props}>
        {props.children(data, infiniteQuery)}
      </SelectField>
    </SelectApiContext.Provider>
  );
}

export default SelectApi;

export type SelectApiContentProps = Parameters<typeof SelectContent>[0] & {
  noMoreItemsTitle?: React.ReactNode;
};

export function SelectApiContent({
  noMoreItemsTitle = "No more items",
  ...props
}: SelectApiContentProps) {
  const { listBoxProps, hasNextPage, isFetching } = useSelectApiContext();

  return (
    <SelectContent
      alignItemWithTrigger={false}
      {...listBoxProps}
      {...props}
      className={cn("max-h-72", props.className)}
    >
      {props.children}
      <SelectItem
        disabled
        itemTextProps={{ className: "justify-center " }}
        className="pr-0"
        unselectable="on"
        value={crypto.randomUUID()}
      >
        {isFetching ? (
          <Spinner className="justify-center" />
        ) : (
          !hasNextPage && noMoreItemsTitle
        )}
      </SelectItem>
    </SelectContent>
  );
}
