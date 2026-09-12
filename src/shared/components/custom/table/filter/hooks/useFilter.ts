import { useState } from "react";
import type { TableFilteringProps } from "../../Table";

export type UseFilterAddHandler = (filter: FilterCondition) => void;

export type UseFilterUpdateHandler = (
  filter: Partial<FilterCondition>,
  index: number,
) => void;

export type UseFilterDeleteHandler = (index: number) => void;

export type FilterLogicalOperator = "AND" | "OR";

export type FilterCondition = { name: string; operation?: string; value: any };

export type UseFilterLogicalOperatorChangeHandler = (
  operator: FilterLogicalOperator,
) => void;

export type UseFilterOptions = TableFilteringProps;

export function useFilter({
  filters,
  onFiltersChange,
  logicalOperator,
  onLogicalOperatorChange,
}: UseFilterOptions) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const closeFilter = () => setIsFilterOpen(false);

  const openFilter = () => setIsFilterOpen(true);

  const addFilter: UseFilterAddHandler = (newFilter) => {
    onFiltersChange?.([...filters, newFilter]);
  };

  const updateFilter: UseFilterUpdateHandler = (filter, targetIndex) => {
    onFiltersChange?.(
      filters.map((prevFilter, i) =>
        i === targetIndex ? { ...prevFilter, ...filter } : prevFilter,
      ),
    );
  };

  const deleteFilter: UseFilterDeleteHandler = (targetIndex: number) => {
    onFiltersChange?.(filters.filter((_, i) => i !== targetIndex));
  };

  const changeLogicalOperator: UseFilterLogicalOperatorChangeHandler = (
    operator: FilterLogicalOperator,
  ) => {
    onLogicalOperatorChange(operator);
  };

  return {
    addFilter,
    updateFilter,
    deleteFilter,
    openFilter,
    closeFilter,
    isFilterOpen,
    filters,
    logicalOperator,
    changeLogicalOperator,
  };
}
