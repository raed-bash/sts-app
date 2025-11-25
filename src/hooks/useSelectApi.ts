import { useInfiniteQuery } from "@tanstack/react-query";

export type ResponseType<TData> = {
  count: number;
  pageParam: number;
  data: TData[];
};

export type QueryFn<TData> = (params: {
  pageParam: number;
}) => ResponseType<TData>;

export type UseSelectApiOptions<TData> = {
  queryFn: QueryFn<TData>;

  queryKey: readonly unknown[];
};
const handleQueryFn =
  <TData>(queryFn: QueryFn<TData>) =>
  ({ pageParam }: Parameters<QueryFn<TData>>[number]) => ({
    ...queryFn({ pageParam }),
    pageParam,
  });

export default function useSelectApi<TData>({
  queryFn,
  queryKey,
}: UseSelectApiOptions<TData>) {
  const { data, ...infiniteQueryOptions } = useInfiniteQuery({
    queryFn: handleQueryFn<TData>(queryFn),
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
