import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { getUniqueKey } from "src/utils/getUniqueKey";

/**
 * @typedef fetchDataReturn
 * @property {number} count
 * @property {number} pageParam
 * @property {any[]} data
 */

/**
 * @callback fetchData
 * @param {object} params
 * @param {number} params.pageParam
 * @returns {fetchDataReturn}
 */

/**
 * @typedef utils
 * @property {fetchData} fetchData
 * @property {any[]} queryKey
 * @property {import("@tanstack/react-query").DefinedInitialDataInfiniteOptions<any, Error, InfiniteData<any, unknown>} useInfiniteQueryOptions
 */

/**
 * @typedef useSelectApiOptions
 * @type {utils}
 */

/**
 * @param {useSelectApiOptions} options
 */
export default function useSelectApi({
  useInfiniteQueryOptions,
  fetchData,
  queryKey,
}) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    ...infiniteQueryOptions
  } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam = 1 }) =>
      fetchData({
        pageParam,
      }),
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
    ...useInfiniteQueryOptions,
  });

  const [allData, setAllData] = useState([]);

  useEffect(() => {
    if (data?.pages) {
      setAllData(
        data?.pages.reduce((prev, curr) => [...prev, ...(curr?.data || [])], [])
      );
    }
  }, [data?.pages]);

  const handleScroll = useCallback(
    (event) => {
      const listbox = event.currentTarget;
      if (
        listbox.scrollTop + listbox.clientHeight + 10 >=
        listbox.scrollHeight
      ) {
        if (hasNextPage) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, hasNextPage]
  );

  const [uniqueKeys] = useState(() => [getUniqueKey(), getUniqueKey()]);

  return {
    uniqueKeys,
    allData,
    handleScroll,
    infiniteQueryOptions: {
      hasNextPage,
      fetchNextPage,
      isFetching,
      infiniteQueryOptions,
      ...infiniteQueryOptions,
    },
  };
}
