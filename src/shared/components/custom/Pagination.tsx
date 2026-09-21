import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "@/shared/hooks";
import { cn } from "cn";
import { PER_PAGE } from "@/shared/dtos/pagingated-results-dto";
import { Input } from "@/shared/components/ui/input";
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
  const { t } = useTranslation();

  const totalPages = Math.ceil(count / perPage);

  const jumpWidth = `calc(${Math.max(2, String(totalPages).length) + 4}ch + 1.75rem)`;

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
          <ChevronLeftIcon className="rtl:-scale-x-100" />
        </Button>

        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1 text-foreground/50 select-none"
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
                "h-8 min-w-8 px-2 rounded-md aria-selected:bg-primary aria-selected:text-white aria-selected:font-medium",
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
          <ChevronRightIcon className="rtl:-scale-x-100" />
        </Button>
      </div>

      <label className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium">
        {t("table.go")}
        <Input
          type="number"
          min={1}
          max={totalPages}
          disabled={disabled}
          style={{ width: jumpWidth }}
          className="text-center"
          value={jumpValue}
          onChange={(e) => {
            const newPage = +e.target.value;

            setJumpValue(e.target.value);

            if (e.target.value !== "" && newPage > 0 && newPage <= totalPages) {
              handleJumpChange(newPage);
            }
          }}
        />
      </label>
    </nav>
  );
}

export default Pagination;
