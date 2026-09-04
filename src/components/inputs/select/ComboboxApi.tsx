import * as React from "react";
import {
  useSelectApi,
  type QueryResponseType,
  type UseSelectApiOptions,
} from "../../hooks";
import { ComboboxList, ComboboxItem } from "../../ui/combobox";
import ComboboxField, { type ComboboxFieldProps } from "./ComboboxField";
import { cn } from "../../lib";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { Spinner } from "../../ui/spinner";
import {
  ComboboxApiContext,
  useComboboxApiContext,
} from "./contexts/combobox-api-context";

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
};

function ComboboxApi<Value, Multiple extends boolean | undefined = false>({
  queryProps,
  ...props
}: ComboboxApiProps<Value, Multiple>) {
  const { listBoxProps, data, infiniteQuery } = useSelectApi<Value>(queryProps);

  return (
    <ComboboxApiContext.Provider
      value={{
        listBoxProps: listBoxProps,
        hasNextPage: infiniteQuery.hasNextPage,
        isFetching: infiniteQuery.isFetching,
      }}
    >
      <ComboboxField<Value, Multiple> {...props}>
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
