import * as React from "react";
import SelectField, { type SelectFieldProps } from "./SelectField";
import type {
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import {
  useSelectApi,
  type QueryResponseType,
  type UseSelectApiOptions,
} from "@/shared/hooks/useSelectApi";
import { SelectItem } from "@/shared/components/ui/select";
import { Spinner } from "@/shared/components/ui/spinner";

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

/**
 *
 * @example
 * ```tsx
 *
 *  <InputPlus
 *    type="selectApi"
 *    title="API Select"
 *    value={itemValue}
 *    onChange={handleChange}
 *    isItemEqualToValue={(item, value) => item.id === value.id}
 *    getInputLabel={(item) => item?.name || "API Select"}
 *    queryProps={{
 *      queryFn: itemsApi.getItems,
 *      queryKey: ["selectItems"],
 *    }}
 *  >
 *    {(data) => (
 *      <SelectGroup>
 *        <SelectLabel>Item</SelectLabel>
 *        {data.data.map((item) => (
 *            <SelectItem key={item.id} value={item}>
 *              {item.name}
 *            </SelectItem>
 *          ))
 *        }
 *      </SelectGroup>
 *    )}
 *  </InputPlus>

 *
 * ```
 */
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
