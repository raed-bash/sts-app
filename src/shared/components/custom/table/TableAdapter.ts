import type { PaginatedResultsDto } from "@/shared/dtos/pagingated-results-dto";
import type { SortButtonStatus } from "@/shared/components/custom/buttons/SortButton";
import type {
  TableFilteringProps,
  TableLoadingProps,
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
  ordering: {
    orderedColumns: string[];
    onOrderedColumnsChange: (orderedColumns: string[]) => void;
  };
  filtering: TableFilteringProps;
  loading: TableLoadingProps;
};

/**
 * Pure adapter: adapts the table state (via useTableState) together with the
 * entity query result (data/isPending/isFetching) into `<Table>` props.
 * Kept stateless on purpose so no hooks are involved here.
 */
export class TableAdapter<Row extends TableRowRecord, SortKey extends string> {
  constructor(
    private readonly state: UseTableStateReturn<SortKey>,
    private readonly result: {
      data?: PaginatedResultsDto<Row>;
      isPending: boolean;
      isFetching: boolean;
    },
  ) {}

  get tableProps(): TableAdapterProps<Row> {
    return {
      data: { rows: this.result.data?.data },
      pagination: {
        ...this.state.pagination,
        count: this.result.data?.meta?.total ?? 0,
        perPage: this.result.data?.meta?.perPage,
      },
      sorting: {
        sortStatuses: this.state.sorting.sortStatuses as TableSortStatuses,
        onSortChange: this.state.sorting.onSortChange,
      },
      selection: this.state.selection,
      hiding: this.state.hiding,
      ordering: this.state.ordering,
      filtering: this.state.filtering,
      loading: {
        loading: this.result.isPending,
        scLoading: this.result.isFetching,
      },
    };
  }
}
