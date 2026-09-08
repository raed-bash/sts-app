import { useFilterState } from "./useFilterState";
import { useDebouncedFilter } from "./useDebouncedFilter";
import { useSorts } from "./useSorts";
import { useSelectedRows } from "./useSelectedRows";
import { usePaginationState } from "./usePaginationState";

type UseTableFiltersOptions = {
  defaultFilters?: Record<string, any>;
  defaultDebouncedFilter?: Record<string, any>;
  name?: string;
  debounceDelay?: number;
  defaultSorts?: Record<string, any>;
  sortOptions?: Record<string, any>;
  defaultSelectRows?: Set<any>;
  defaultPage?: number;
  caching?: boolean;
};
const defaultObject: Record<string, any> = {};

const defaultSelectedRows = new Set<any>();

export function useTableFilters({
  defaultFilters = defaultObject,
  defaultDebouncedFilter = defaultObject,
  name = "",
  debounceDelay,
  defaultSorts = defaultObject,
  sortOptions = defaultObject,
  defaultSelectRows = defaultSelectedRows,
  defaultPage = 1,
  caching = true,
}: UseTableFiltersOptions) {
  const paginationUtils = usePaginationState(name, defaultPage, { caching });

  const resetPage = () => {
    paginationUtils.setPage(1);
  };

  const filtersUtils = useFilterState(name, defaultFilters, resetPage, {
    caching,
  });

  const debouncedFilterUtils = useDebouncedFilter(
    name,
    defaultDebouncedFilter,
    debounceDelay,
    resetPage,
    { caching },
  );

  const selectedRowUtils = useSelectedRows(name, defaultSelectRows, {
    caching,
  });

  const sortUtils = useSorts(name, defaultSorts, { ...sortOptions, caching });

  const { setFilters } = filtersUtils;
  const { setFilters: setDebouncedFilters } = debouncedFilterUtils;

  const handleResetFilter = () => {
    setFilters(defaultFilters);
    setDebouncedFilters(defaultDebouncedFilter);
  };

  return {
    filtersUtils,
    debouncedFilterUtils,
    selectedRowUtils,
    sortUtils,
    handleResetFilter,
    paginationUtils,
  };
}
