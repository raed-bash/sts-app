import Pagination from "../../Pagination";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import type { TablePaginationProps } from "../Table";

export type TableFooterProps = {
  pagination: TablePaginationProps;
};

export default function TableFooter({ pagination }: TableFooterProps) {
  const { loadMore } = pagination;

  return (
    <div className="flex justify-between items-center gap-4 px-4">
      <div className="flex gap-5 text-(--text)">
        <div className="flex items-center gap-1 font-medium text-sm">
          <p>Total: </p>
          <span>{pagination.count}</span>
        </div>

        <div className="flex items-center gap-1 font-medium text-sm">
          <p>PerPage: </p>
          <span>{pagination.perPage}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {loadMore && (
          <Button
            variant="outline"
            size="sm"
            onClick={loadMore.onLoadMore}
            disabled={!loadMore.hasMore || loadMore.isFetching}
          >
            {loadMore.isFetching && <Spinner />}
            {loadMore.enabled
              ? `Load more (${loadMore.loadedCount})`
              : "Load more"}
          </Button>
        )}

        <Pagination
          currentPage={pagination.currentPage}
          onChange={pagination.onPageChange}
          maxVisibleNeighbors={pagination.maxVisibleNeighbors}
          count={pagination.count}
          perPage={pagination.perPage}
          disabled={loadMore?.enabled ?? false}
        />
      </div>
    </div>
  );
}
