import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

export type QueryResponseType<TData> = {
  count: number;
  pageParam: number;
  data: TData[];
};

export type QueryFnParams = {
  pageParam: number;
};

export type QueryFn<TData> = (
  params: QueryFnParams,
) => Promise<QueryResponseType<TData>>;

export type UseSelectApiOptions<TData> = {
  queryFn: QueryFn<TData>;

  queryKey: readonly unknown[];
};

export default function useSelectApi<TData>({
  queryFn,
  queryKey,
}: UseSelectApiOptions<TData>) {
  const { data, ...infiniteQueryOptions } = useInfiniteQuery({
    queryFn: queryFn,
    queryKey: queryKey,
    getNextPageParam: (lastPage, allPages) => {
      const length = allPages.reduce(
        (prevL, currL) => prevL + currL?.data?.length,
        0,
      );

      if (length >= lastPage?.count) {
        return null;
      }

      return lastPage?.pageParam + 1;
    },
    initialPageParam: 1,
  });

  const allData = data?.pages
    ? data?.pages.reduce<TData[]>(
        (prev, curr) => [...prev, ...(curr?.data || [])],
        [],
      )
    : [];

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const listbox = event.currentTarget;

    if (infiniteQueryOptions.isFetching) return;

    if (listbox.scrollTop + listbox.clientHeight + 10 >= listbox.scrollHeight) {
      if (infiniteQueryOptions.hasNextPage) {
        infiniteQueryOptions.fetchNextPage();
      }
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
      infiniteQueryOptions.hasNextPage &&
      !infiniteQueryOptions.isFetching
    ) {
      infiniteQueryOptions.fetchNextPage();
    }
  };

  return {
    allData,
    handleScroll,
    infiniteQueryOptions,
    listBoxProps: {
      onScroll: handleScroll,
      ref: ref,
    },
  };
}
