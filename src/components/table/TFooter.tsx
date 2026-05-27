import Pagination, { type PaginationProps } from "./Pagination";

export type TFooterProps = {
  maxVisibleNeighbors?: PaginationProps["maxVisibleNeighbors"];

  onPageChange: PaginationProps["onChange"];

  count: PaginationProps["count"];

  currentPage: PaginationProps["currentPage"];

  perPage?: PaginationProps["perPage"];
};

export default function TFooter(props: TFooterProps) {
  return (
    <div className="flex justify-between items-center px-4">
      <div className="flex gap-5 text-(--text)">
        <div className="flex items-center gap-1 font-medium text-sm">
          <p>Total: </p>
          <span>{props.count}</span>
        </div>

        <div className="flex items-center gap-1 font-medium text-sm">
          <p>PerPage: </p>
          <span>{props.perPage}</span>
        </div>
      </div>

      <Pagination
        currentPage={props.currentPage}
        onChange={props.onPageChange}
        maxVisibleNeighbors={props.maxVisibleNeighbors}
        count={props.count}
        perPage={props.perPage}
      />
    </div>
  );
}
