import { useInfiniteQuery } from "@tanstack/react-query";

export type QueryResponseType<TData> = {
  count: number;
  pageParam: number;
  data: TData[];
};

export type QueryFnParams = {
  pageParam: number;
};

export type QueryFn<TData> = (
  params: QueryFnParams
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
        0
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
        []
      )
    : [];

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const listbox = event.currentTarget;
    if (listbox.scrollTop + listbox.clientHeight + 10 >= listbox.scrollHeight) {
      if (infiniteQueryOptions.hasNextPage) {
        infiniteQueryOptions.fetchNextPage();
      }
    }
  };

  return {
    allData,
    handleScroll,
    infiniteQueryOptions,
  };
}
