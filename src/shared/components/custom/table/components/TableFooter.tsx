import Pagination from "../../Pagination";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "cn";
import type { TablePaginationProps } from "../Table";

export type TableFooterProps = {
  pagination: TablePaginationProps;
};

export default function TableFooter({ pagination }: TableFooterProps) {
  const { loadMore } = pagination;

  const disabled = loadMore?.enabled ?? false;

  return (
    <div className="flex justify-between items-center gap-4 px-4">
      <div className="flex gap-5 text-(--text)">
        <div className="flex items-center gap-1 font-medium text-sm">
          <p>Total: </p>
          <span>{pagination.count}</span>
        </div>

        <div className="flex items-center gap-1 font-medium text-sm">
          <p>Rows per page: </p>
          <Select
            value={pagination.perPage}
            onValueChange={(value) =>
              value != null && pagination.onPerPageChange?.(value)
            }
            disabled={disabled}
          >
            <SelectTrigger
              size="sm"
              className={cn("w-16 justify-center px-2")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pagination.perPageOptions?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          disabled={disabled}
        />
      </div>
    </div>
  );
}
