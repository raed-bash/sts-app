import InputPlus from "@/components/inputs/InputPlus";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { FunnelIcon, FunnelXIcon, Plus, XIcon } from "lucide-react";
import { getAvailableFilterOps } from "./utils/filterUtils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { RowType, TableColumn } from "../Table";
import { type FilterInputProps } from "./FilterInput";
import type {
  FilterItem,
  UseFilterDeleteEventAction,
  UseFilterPushEventAction,
  UseFilterUpdateEventAction,
} from "./hooks/useFilter";
import type { EventTarget } from "@/utils/EventTarget";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NativeSelectOption } from "@/components/ui/native-select";
import { SelectFieldTrigger } from "@/components/inputs/select/SelectField";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";

export type FilterFilter = Pick<
  FilterInputProps,
  "type" | "selectOps" | "omitOps"
>;

export type FilterBoardProps<Row extends RowType> = {
  columns: TableColumn<Row>[];
  isFilterOpen?: boolean;
  onOpenFilter?: () => void;
  onCloseFilter?: () => void;
  onPushFilter: UseFilterPushEventAction;
  onUpdateFilter: UseFilterUpdateEventAction;
  onDeleteFilter: UseFilterDeleteEventAction;
  filters: FilterItem[];
};

export default function FilterBoard<Row extends RowType>({
  columns,
  onCloseFilter,
  onOpenFilter,
  isFilterOpen,
  onPushFilter,
  onUpdateFilter,
  onDeleteFilter,
  filters,
}: FilterBoardProps<Row>) {
  const filterColumns = columns.filter((column) => column.filterable);

  const createFilterDeleteHandler = (i: number) => () => {
    onDeleteFilter(i);

    if (filters.length === 1) {
      onCloseFilter?.();
    }
  };

  const handleOpenChangeBoard = (open: boolean) => {
    if (!open) {
      onCloseFilter?.();
      return;
    }

    if (filters.length > 0) {
      onOpenFilter?.();
      return;
    }

    pushFilter();

    onOpenFilter?.();
  };

  const pushFilter = () => {
    const filterColumn = filterColumns[0];

    const filterProps = filterColumn.filterProps;

    const filterOps = getAvailableFilterOps(filterProps?.type || "text", {
      omittedOps: filterProps?.omitOps,
      selectedOps: filterProps?.selectOps,
    });

    onPushFilter({
      name: filterColumn.name.toString(),
      operation: filterOps[0],
      value: "",
    });
  };

  const handleAddFilter = () => {
    pushFilter();
  };

  const createFilterOperationChangeHandler =
    (i: number) => (e: EventTarget<any>) => {
      const name = e.target.name?.toString();
      const value = e.target.value;
      if (!name) return;

      onUpdateFilter(
        {
          [name]: value,
        },
        i,
      );
    };

  return (
    <Popover open={isFilterOpen} onOpenChange={handleOpenChangeBoard}>
      <Tooltip>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <Button variant="outline" size="icon-lg">
                  {filters.length > 0 ? <FunnelXIcon /> : <FunnelIcon />}
                </Button>
              }
            />
          }
        />
        <TooltipContent>Filters</TooltipContent>
      </Tooltip>
      <PopoverContent
        alignOffset={0}
        align="start"
        side="top"
        className="w-[37vw]"
      >
        <div className="flex flex-col gap-2">
          {filters.map((filter, i) => {
            const name = filter.name;

            const column = filterColumns.find((column) => column.name === name);

            const filterProps = column?.filterProps;

            if (!filterProps) return null;

            const filterOps = getAvailableFilterOps(filterProps.type, {
              selectedOps: filterProps.selectOps,
              omittedOps: filterProps.omitOps,
            });

            return (
              <div
                className={cn("flex gap-4 items-center ", "grid-cols-3")}
                key={i}
              >
                <div
                  className={cn(
                    "flex",
                    filters.length > 1 ? "min-w-32 gap-5" : undefined,
                  )}
                >
                  <Button
                    variant={"destructive"}
                    size="icon-lg"
                    onClick={createFilterDeleteHandler(i)}
                  >
                    <XIcon />
                  </Button>
                  {filters.length && i === 0 ? (
                    <div></div>
                  ) : (
                    i > 0 && (
                      <InputPlus
                        type="nativeSelect"
                        onChange={() => {}}
                        value="AND"
                      >
                        <NativeSelectOption value="AND">AND</NativeSelectOption>
                        <NativeSelectOption value="OR">OR</NativeSelectOption>
                      </InputPlus>
                    )
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <InputPlus
                    type="select"
                    name="name"
                    onChange={createFilterOperationChangeHandler(i)}
                    value={name}
                  >
                    <SelectFieldTrigger>
                      <SelectValue placeholder="Select column">
                        {column.headerName}
                      </SelectValue>
                    </SelectFieldTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>User</SelectLabel>
                        {filterColumns.map((column) => (
                          <SelectItem
                            key={column.name.toString()}
                            value={column.name}
                          >
                            {column.headerName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </InputPlus>

                  <InputPlus
                    type="nativeSelect"
                    name="operation"
                    multiple={false}
                    onChange={createFilterOperationChangeHandler(i)}
                    value={filter.operation || ""}
                  >
                    {filterOps.map((op) => (
                      <NativeSelectOption key={op} value={op}>
                        {op}
                      </NativeSelectOption>
                    ))}
                  </InputPlus>
                  <InputPlus
                    name="value"
                    type={filterProps?.type || "text"}
                    value={filter.value || ""}
                    onChange={createFilterOperationChangeHandler(i)}
                    placeholder={`${column?.headerName}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-lg"
                  onClick={handleAddFilter}
                >
                  <Plus />
                </Button>
              }
            />
            <TooltipContent side="bottom">Add Filter</TooltipContent>
          </Tooltip>
        </div>
      </PopoverContent>
    </Popover>
  );
}
