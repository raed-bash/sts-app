import { useState } from "react";
import { useCachedState } from "./useCachedState";
import { useDebouncedValue } from "@/shared/hooks";
import { useHiddenColumns } from "./useHiddenColumns";
import { useOrderedColumns } from "./useOrderedColumns";
import { usePinnedColumns } from "./usePinnedColumns";
import { useSelectedRows } from "./useSelectedRows";
import { useSortStatuses, type DefaultSortStatuses } from "./useSortStatuses";
import { PER_PAGE } from "@/shared/dtos/pagingated-results-dto";
import type { SortButtonStatus } from "@/shared/components/custom/buttons/SortButton";
import type {
  FilterCondition,
  FilterLogicalOperator,
} from "@/shared/components/custom/filter";
import type { TableRowItem } from "@/shared/components/custom/table/Table";

export type UseTableStateOptions<SortKey extends string> = {
  /** Base key used for caching/local storage (e.g. "users") */
  name: string;
  defaultSortStatuses?: DefaultSortStatuses<SortKey>;
  defaultPerPage?: number;
  multi?: boolean;
  caching?: boolean;
};

export type UseTableStateReturn<SortKey extends string> = {
  pagination: {
    currentPage: number;
    onPageChange: (page: number) => void;
    perPage: number;
    onPerPageChange: (perPage: number) => void;
  };
  loadMore: {
    enabled: boolean;
    onEnableLoadMore: () => void;
  };
  sorting: {
    sortStatuses: DefaultSortStatuses<SortKey>;
    onSortChange: (name: string, sortStatus: SortButtonStatus) => void;
  };
  selection: {
    selectedRows: Map<string | number, TableRowItem>;
    onSelectRows: (selectedRows: Map<string | number, TableRowItem>) => void;
  };
  hiding: {
    hiddenColumns: Set<string>;
    onHiddenColumnsChange: (hiddenColumns: Set<string>) => void;
  };
  pinning: {
    pinnedColumns: Set<string>;
    onPinnedColumnsChange: (pinnedColumns: Set<string>) => void;
  };
  ordering: {
    orderedColumns: string[];
    onOrderedColumnsChange: (orderedColumns: string[]) => void;
  };
  filtering: {
    filters: FilterCondition[];
    onFiltersChange: (filters: FilterCondition[]) => void;
    logicalOperator: FilterLogicalOperator;
    onLogicalOperatorChange: (operator: FilterLogicalOperator) => void;
  };
  debouncedFilters: FilterCondition[];
};

const defaultSortStatusesDefault: DefaultSortStatuses<string> = {};

export function useTableState<SortKey extends string>({
  name,
  defaultSortStatuses = defaultSortStatusesDefault,
  defaultPerPage = PER_PAGE,
  multi = false,
  caching = true,
}: UseTableStateOptions<SortKey>): UseTableStateReturn<SortKey> {
  const [page, setPage] = useState(1);

  const [perPage, setPerPage] = useState(defaultPerPage);

  const [isLoadMore, setIsLoadMore] = useState(false);

  const handlePerPageChange = (nextPerPage: number) => {
    if (nextPerPage === perPage) return;

    setPerPage(nextPerPage);

    setPage(1);
  };

  const { sortStatuses, handleSortChange } = useSortStatuses<SortKey>(
    name,
    defaultSortStatuses,
    {
      multi,
      caching,
    },
  );

  const { selectedRows, setSelectedRows } = useSelectedRows(name, undefined, {
    caching,
  });

  const [filters, setFilters] = useCachedState<FilterCondition[]>(
    `${name}TableFilters`,
    [],
  );

  const [logicalOperator, setLogicalOperator] =
    useState<FilterLogicalOperator>("AND");

  const { orderedColumns, setOrderedColumns } = useOrderedColumns(name);

  const { hiddenColumns, setHiddenColumns } = useHiddenColumns(name);

  const { pinnedColumns, setPinnedColumns } = usePinnedColumns(name);

  const debouncedFilters = useDebouncedValue(filters);

  return {
    pagination: {
      currentPage: page,
      onPageChange: setPage,
      perPage,
      onPerPageChange: handlePerPageChange,
    },
    loadMore: {
      enabled: isLoadMore,
      onEnableLoadMore: () => setIsLoadMore(true),
    },
    sorting: { sortStatuses, onSortChange: handleSortChange },
    selection: { selectedRows, onSelectRows: setSelectedRows },
    hiding: { hiddenColumns, onHiddenColumnsChange: setHiddenColumns },
    pinning: { pinnedColumns, onPinnedColumnsChange: setPinnedColumns },
    ordering: {
      orderedColumns,
      onOrderedColumnsChange: setOrderedColumns,
    },
    filtering: {
      filters,
      onFiltersChange: setFilters,
      logicalOperator,
      onLogicalOperatorChange: setLogicalOperator,
    },
    debouncedFilters,
  };
}
