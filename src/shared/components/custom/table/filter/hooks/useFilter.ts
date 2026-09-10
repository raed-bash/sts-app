import React, { useState } from "react";

export type UseFilterPushEventAction = (filter: FilterItem) => void;

export type UseFilterUpdateEventAction = (
  filter: Partial<FilterItem>,
  index: number,
) => void;

export type UseFilterDeleteEventAction = (index: number) => void;

export type UseFilterSetStateFiltersAction = React.Dispatch<
  React.SetStateAction<FilterItem[]>
>;

export type LogicalOperator = "AND" | "OR";

export type UseFilterSetStateLogicalOperatorAction = React.Dispatch<
  React.SetStateAction<LogicalOperator>
>;

export type FilterItem = { name: string; operation?: string; value: any };

export type UseFilterChangeLogicalOperatorAction = (
  operator: LogicalOperator,
) => void;

export type UseFilterOptions = {
  filters: FilterItem[];

  setFilters?: UseFilterSetStateFiltersAction;

  logicalOperator: LogicalOperator;

  setLogicalOperator: UseFilterSetStateLogicalOperatorAction;
};

export function useFilter({
  filters,
  setFilters,
  logicalOperator,
  setLogicalOperator,
}: UseFilterOptions) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const closeFilter = () => setIsFilterOpen(false);

  const openFilter = () => setIsFilterOpen(true);

  const pushFilter: UseFilterPushEventAction = (newFilter) => {
    setFilters?.((prevFilters) => [...prevFilters, newFilter]);
  };

  const updateFilter: UseFilterUpdateEventAction = (filter, targetIndex) => {
    setFilters?.((prevFilters) => {
      const newFilter = [...prevFilters];

      newFilter[targetIndex] = { ...newFilter[targetIndex], ...filter };

      return newFilter;
    });
  };

  const deleteFilter: UseFilterDeleteEventAction = (targetIndex: number) => {
    setFilters?.((prevFilters) =>
      prevFilters.filter((_, i) => i !== targetIndex),
    );
  };

  const changeLogicalOperator: UseFilterChangeLogicalOperatorAction = (
    operator: LogicalOperator,
  ) => {
    setLogicalOperator(operator);
  };

  return {
    pushFilter,
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
