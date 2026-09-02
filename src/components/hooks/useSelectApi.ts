import {
  PER_PAGE,
  type PaginatedResultsDto,
} from "@/dtos/pagingated-results-dto";
import {
  useInfiniteQuery,
  type GetNextPageParamFunction,
} from "@tanstack/react-query";
import { useRef } from "react";

export type QueryResponseType<TData> = PaginatedResultsDto<TData>;

export type QueryFnParams = {
  page: number;

  perPage?: number;
};

export type QueryFn<TData> = (
  params: QueryFnParams,
) => Promise<QueryResponseType<TData>>;

export type UseSelectApiOptions<TData> = {
  queryFn: QueryFn<TData>;

  queryKey: readonly unknown[];

  perPage?: number;

  getNextPageParam?: GetNextPageParamFunction<number, QueryResponseType<TData>>;

  initialPageParam?: number;

  enabled?: boolean;
};

export function useSelectApi<TData>({
  queryFn,
  queryKey,
  perPage = PER_PAGE,
  getNextPageParam = (lastPage) => lastPage.meta.next,
  initialPageParam = 1,
  enabled = true,
}: UseSelectApiOptions<TData>) {
  const infiniteQuery = useInfiniteQuery({
    queryFn: async (params) =>
      await queryFn({ page: params.pageParam, perPage }),
    queryKey: queryKey,
    getNextPageParam,
    initialPageParam,
    enabled,
  });

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const listbox = event.currentTarget;

    if (infiniteQuery.isFetching || !infiniteQuery.hasNextPage) return;

    if (listbox.scrollTop + listbox.clientHeight + 10 >= listbox.scrollHeight) {
      infiniteQuery.fetchNextPage();
    }
  };

  const listBoxRef = useRef<HTMLDivElement>(null);

  const ref = (node: HTMLDivElement | null) => {
    if (!node) return;

    listBoxRef.current = node;
    const el = listBoxRef.current;

    // if there's no scrollbar yet but there's page exist, keep fetching
    if (
      el.scrollHeight <= el.clientHeight &&
      infiniteQuery.hasNextPage &&
      !infiniteQuery.isFetching
    ) {
      infiniteQuery.fetchNextPage();
    }
  };

  return {
    data: infiniteQuery.data,
    infiniteQuery,
    listBoxProps: {
      onScroll: handleScroll,
      ref: ref,
    },
  };
}
