import ArrowLineDownIcon from "src/assets/icons/arrow-line-down.svg?react";
import InputPlus from "../inputs/InputPlus";
import { useDebounce } from "src/hooks/useDebounce";
import IconButton from "../buttons/IconButton";
import { useState } from "react";
import { PER_PAGE } from "@/dtos/pagingated-results-dto";

const getVisiblePages = (
  currentPage: number,
  totalPages: number,
  maxVisibleNeighbors = 2, // Number of neighbors to show on each side of the current page
) => {
  const pages = [];

  // Always show the first page
  if (currentPage > 3 + maxVisibleNeighbors) {
    pages.push(1, 2, "...");
  } else {
    for (let i = 1; i < Math.min(3, totalPages + 1); i++) {
      pages.push(i);
    }
  }

  // Add neighbors and the current page
  for (
    let i = Math.max(1, currentPage - maxVisibleNeighbors);
    i <= Math.min(totalPages, currentPage + maxVisibleNeighbors);
    i++
  ) {
    if (!pages.includes(i)) pages.push(i);
  }

  // Always show the last pages
  if (currentPage < totalPages - 4) {
    pages.push("...", totalPages - 1, totalPages);
  } else {
    for (let i = Math.max(totalPages - 3, 1); i <= totalPages; i++) {
      if (!pages.includes(i) && i > currentPage) pages.push(i);
    }
  }

  return pages;
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
};

function Pagination({
  currentPage,
  count,
  onChange,
  maxVisibleNeighbors = 2,
  perPage = PER_PAGE,
}: PaginationProps) {
  const totalPages = Math.ceil(count / perPage);

  const [pageTracker, setPageTracker] = useState(currentPage);

  const pages = getVisiblePages(currentPage, totalPages, maxVisibleNeighbors);

  const handleChange = (newPage: number) => {
    onChange(newPage);

    setPageTracker(newPage);
  };

  const handleDebounceChange = useDebounce(handleChange, 500);

  return (
    <div className="flex gap-2">
      <div className="flex items-center justify-center gap-x-2 py-4">
        {/* Previous Button */}
        <IconButton
          className="px-2 py-[9.5px] rotate-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => {
            handleChange(currentPage - 1);
          }}
        >
          <ArrowLineDownIcon className="stroke-(--text)" />
        </IconButton>

        {/* Dynamic Page Numbers */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <IconButton
              key={idx}
              className="px-3 py-1 text-[14px] rounded 
             aria-selected:bg-(--primary) aria-selected:text-white"
              aria-selected={page === currentPage}
              onClick={() => {
                if (typeof page === "number") handleChange(page);
              }}
            >
              {page}
            </IconButton>
          ),
        )}

        {/* Next Button */}
        <IconButton
          className="px-2 py-[9.5px] -rotate-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 "
          disabled={currentPage === totalPages}
          onClick={() => {
            onChange(currentPage + 1);
          }}
        >
          <ArrowLineDownIcon className="stroke-(--text)" />
        </IconButton>
      </div>
      <InputPlus
        oneline
        title="Go:"
        type="number"
        inputPlusContainerProps={{ className: "w-30" }}
        onChange={(e) => {
          const newPage = +e.target.value;

          if (newPage > 0 && newPage <= totalPages) {
            handleDebounceChange(newPage);
            setPageTracker(newPage);
          }
        }}
        min={1}
        max={totalPages}
        value={pageTracker}
      />
    </div>
  );
}

export default Pagination;
