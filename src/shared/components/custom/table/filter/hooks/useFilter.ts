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

export type FilterItem = { name: string; operation?: string; value: any };

export type UseFilterOptions = {
  filters: FilterItem[];

  setFilters?: UseFilterSetStateFiltersAction;
};

export function useFilter({ filters, setFilters }: UseFilterOptions) {
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

  return {
    pushFilter,
    updateFilter,
    deleteFilter,
    openFilter,
    closeFilter,
    isFilterOpen,
    filters,
  };
}
