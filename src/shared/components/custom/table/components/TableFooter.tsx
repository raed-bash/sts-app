import Pagination from "../../Pagination";
import type { TablePaginationProps } from "../Table";

export type TableFooterProps = {
  pagination: TablePaginationProps;
};

export default function TableFooter({ pagination }: TableFooterProps) {
  return (
    <div className="flex justify-between items-center px-4">
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

      <Pagination
        currentPage={pagination.currentPage}
        onChange={pagination.onPageChange}
        maxVisibleNeighbors={pagination.maxVisibleNeighbors}
        count={pagination.count}
        perPage={pagination.perPage}
      />
    </div>
  );
}
