import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useDebounce } from "@/shared/hooks";
import { cn } from "cn";
import { PER_PAGE } from "@/shared/dtos/pagingated-results-dto";
import LabeledField from "./inputs/LabeledField";
import { Button } from "@/shared/components/ui/button";

type PageItem = number | "ellipsis";

const getVisiblePages = (
  totalPages: number,
  currentPage: number,
  maxVisibleNeighbors: number,
): PageItem[] => {
  const pages = new Set<number>();

  // Always show the first page
  pages.add(1);

  // Neighbors around the current page
  for (
    let page = Math.max(2, currentPage - maxVisibleNeighbors);
    page <= Math.min(totalPages - 1, currentPage + maxVisibleNeighbors);
    page++
  ) {
    pages.add(page);
  }

  // Always show the last page
  if (totalPages > 1) pages.add(totalPages);

  const items: PageItem[] = [];
  let previous = 0;

  for (const page of [...pages].sort((a, b) => a - b)) {
    if (page - previous > 1) items.push("ellipsis");

    items.push(page);

    previous = page;
  }

  return items;
};

export type PaginationProps = {
  currentPage: number;
  count: number;
  onChange: (page: number) => void;
  /**
   * @default 2
   */
  maxVisibleNeighbors?: number;
  /**
   * @default 10
   */
  perPage?: number;
  /**
   * Disables all pagination controls (used when load-more takes over)
   */
  disabled?: boolean;
};

function Pagination({
  currentPage,
  count,
  onChange,
  maxVisibleNeighbors = 2,
  perPage = PER_PAGE,
  disabled = false,
}: PaginationProps) {
  const totalPages = Math.ceil(count / perPage);

  const [prevCurrentPage, setPrevCurrentPage] = useState(currentPage);
  const [jumpValue, setJumpValue] = useState<string | number>(currentPage);

  const pages = getVisiblePages(totalPages, currentPage, maxVisibleNeighbors);

  // Keep the jump input in sync with external page changes
  if (prevCurrentPage !== currentPage) {
    setPrevCurrentPage(currentPage);

    setJumpValue(currentPage);
  }

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    onChange(page);

    setJumpValue(page);
  };

  const handleJumpChange = useDebounce(handleChange, 500);

  if (totalPages === 0) return null;

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex items-center gap-3",
        disabled && "opacity-50 pointer-events-none select-none",
      )}
    >
      <div className="flex items-center justify-center gap-1 py-4 min-w-64">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous page"
          disabled={disabled || currentPage === 1}
          onClick={() => handleChange(currentPage - 1)}
        >
          <ChevronLeftIcon />
        </Button>

        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1 text-(--text)/50 select-none"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              variant="ghost"
              size="sm"
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "h-8 min-w-8 px-2 rounded-md aria-selected:bg-(--primary) aria-selected:text-white aria-selected:font-medium",
                page === currentPage && "aria-selected:pointer-events-none",
              )}
              aria-selected={page === currentPage}
              disabled={disabled}
              onClick={() => handleChange(page)}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="icon"
          aria-label="Next page"
          disabled={disabled || currentPage === totalPages}
          onClick={() => handleChange(currentPage + 1)}
        >
          <ChevronRightIcon />
        </Button>
      </div>

      <LabeledField
        oneline
        title="Go:"
        type="number"
        disabled={disabled}
        fieldProps={{ className: "w-30" }}
        onChange={(e) => {
          const newPage = +e.target.value;

          setJumpValue(e.target.value);

          if (e.target.value !== "" && newPage > 0 && newPage <= totalPages) {
            handleJumpChange(newPage);
          }
        }}
        min={1}
        max={totalPages}
        value={jumpValue}
      />
    </nav>
  );
}

export default Pagination;
