import { useCallback } from "react";
import useFilters from "./useFilters";
import useFiltersDebounce from "./useFiltersDebounce";
import useSorts from "./useSorts";
import useSelectRows from "./useSelectRows";
import usePagination from "./usePagination";

const defaultObj = {};

const defaultSetObj = new Set();

export default function useTableFiltersUtils({
  defaultFilters = defaultObj,
  defaultDebounceFilters = defaultObj,
  name = "",
  debounceDelay,
  defaultSorts = defaultObj,
  sortOptions = defaultObj,
  defaultSelectRows = defaultSetObj,
  defaultPage = 1,
  cashing = true,
}) {
  const paginationUtils = usePagination(name, defaultPage, { cashing });

  const setPage_1 = useCallback(() => {
    paginationUtils.setPage(1);

    // eslint-disable-next-line
  }, []);

  const filtersUtils = useFilters(name, defaultFilters, setPage_1, { cashing });

  const filtersDebounceUtils = useFiltersDebounce(
    name,
    defaultDebounceFilters,
    debounceDelay,
    setPage_1,
    { cashing }
  );

  const selectRowsUtils = useSelectRows(name, defaultSelectRows, { cashing });

  const sortsUtils = useSorts(name, defaultSorts, { ...sortOptions, cashing });

  const handleResetFilter = useCallback(() => {
    filtersUtils.setFilters(defaultFilters);
    filtersDebounceUtils.setDebounceFilters(defaultDebounceFilters);
  }, [
    filtersDebounceUtils,
    filtersUtils,
    defaultFilters,
    defaultDebounceFilters,
  ]);

  return {
    filtersUtils,
    filtersDebounceUtils,
    selectRowsUtils,
    sortsUtils,
    handleResetFilter,
    paginationUtils,
  };
}
