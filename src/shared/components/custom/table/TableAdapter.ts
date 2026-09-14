import type { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import { PER_PAGE } from "@/shared/dtos/pagingated-results-dto";
import type { SortButtonStatus } from "@/shared/components/custom/buttons/SortButton";
import type {
  TableFilteringProps,
  TableLoadingProps,
  TableLoadMoreProps,
  TablePaginationProps,
  TableRowRecord,
  TableSelectionProps,
  TableSortStatuses,
} from "@/shared/components/custom/table/Table";
import type { UseTableStateReturn } from "@/hooks/useTableState";

export type TableAdapterProps<Row extends TableRowRecord> = {
  data: { rows?: Row[] };
  pagination: TablePaginationProps;
  sorting: {
    sortStatuses: TableSortStatuses;
    onSortChange: (name: string, sortStatus: SortButtonStatus) => void;
  };
  selection: TableSelectionProps;
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
  filtering: TableFilteringProps;
  loading: TableLoadingProps;
};

export type TableAdapterLoadMoreSource<Row extends TableRowRecord> = {
  enabled: boolean;

  data?: { pages: Array<PaginatedResultsDto<Row>> };

  isPending: boolean;

  isFetching: boolean;

  isFetchingNextPage: boolean;

  hasNextPage: boolean | undefined;

  onEnableLoadMore: () => void;

  fetchNextPage: () => void;
};

const emptyMeta = {
  currentPage: 1,
  lastPage: 0,
  perPage: PER_PAGE,
  total: 0,
};

/**
 * Pure adapter: adapts the table state (via useTableState) together with the
 * entity query result (data/isPending/isFetching) into `<Table>` props.
 *
 * When a `loadMore` source is provided, it also merges the load-more
 * accumulation (flattened infinite pages) and lets load-more mode take over
 * the rows/pagination/loading view.
 *
 * Kept stateless on purpose so no hooks are involved here.
 */
export class TableAdapter<Row extends TableRowRecord, SortKey extends string> {
  constructor(
    private readonly state: UseTableStateReturn<SortKey>,
    private readonly result: {
      data?: PaginatedResultsDto<Row>;
      isPending: boolean;
      isFetching: boolean;
      loadMore?: TableAdapterLoadMoreSource<Row>;
    },
  ) {}

  get tableProps(): TableAdapterProps<Row> {
    const loadMore = this.result.loadMore;
    const isLoadMore = loadMore?.enabled === true;

    const pages = loadMore?.data?.pages;
    const loadedRows = pages?.flatMap((page) => page.data) ?? [];
    const meta = pages?.at(-1)?.meta;

    const data: PaginatedResultsDto<Row> | undefined = isLoadMore
      ? { data: loadedRows, meta: meta ?? emptyMeta }
      : this.result.data;

    const count = isLoadMore
      ? (meta?.total ?? 0)
      : (this.result.data?.meta?.total ?? 0);

    const perPage = isLoadMore
      ? meta?.perPage
      : this.result.data?.meta?.perPage;

    return {
      data: { rows: data?.data },
      pagination: {
        ...this.state.pagination,
        count,
        perPage,
        ...(loadMore && {
          loadMore: {
            enabled: loadMore.enabled,
            onLoadMore: () =>
              loadMore.enabled
                ? loadMore.fetchNextPage()
                : loadMore.onEnableLoadMore(),
            hasMore: loadMore.enabled ? (loadMore.hasNextPage ?? false) : true,
            isFetching: loadMore.isFetchingNextPage,
            loadedCount: loadedRows.length,
          } satisfies TableLoadMoreProps,
        }),
      },
      sorting: {
        sortStatuses: this.state.sorting.sortStatuses as TableSortStatuses,
        onSortChange: this.state.sorting.onSortChange,
      },
      selection: this.state.selection,
      hiding: this.state.hiding,
      pinning: this.state.pinning,
      ordering: this.state.ordering,
      filtering: this.state.filtering,
      loading: {
        loading: isLoadMore
          ? (loadMore?.isPending ?? false)
          : this.result.isPending,
        scLoading: isLoadMore
          ? (loadMore?.isFetching ?? false)
          : this.result.isFetching,
      },
    };
  }
}
