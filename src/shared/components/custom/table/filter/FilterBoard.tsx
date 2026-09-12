import { cn } from "cn";
import { FunnelIcon, FunnelXIcon, Plus, XIcon } from "lucide-react";
import { getAvailableFilterOps } from "./utils/utils";
import type { TableRowRecord, TableColumn } from "../Table";
import type {
  FilterCondition,
  FilterLogicalOperator,
  UseFilterLogicalOperatorChangeHandler,
  UseFilterDeleteHandler,
  UseFilterAddHandler,
  UseFilterUpdateHandler,
} from "./hooks/useFilter";
import type { SyntheticEvent } from "@/shared/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/shared/components/ui/select";
import InputPlus, { type InputPlusProps } from "../../inputs/InputPlus";
import { NativeSelectOption } from "@/shared/components/ui/native-select";
import { filterOperations } from "./constants/constants";
import type {
  FilterDateOperationsWithTypes,
  FilterNumberOperationsWithTypes,
  FilterSelectOperationsWithTypes,
  FilterTextOperationsWithTypes,
} from "./types";

export type FilterFieldProps<
  Option,
  Multiple extends boolean | undefined = false,
> = InputPlusProps<Option, Multiple> &
  (
    | FilterTextOperationsWithTypes
    | FilterSelectOperationsWithTypes
    | FilterNumberOperationsWithTypes
    | FilterDateOperationsWithTypes
  );

export type FilterBoardProps<Row extends TableRowRecord> = {
  data: {
    columns: TableColumn<Row>[];
  };

  filtering: {
    filters: FilterCondition[];

    onAddFilter: UseFilterAddHandler;

    onUpdateFilter: UseFilterUpdateHandler;

    onDeleteFilter: UseFilterDeleteHandler;

    logicalOperator: FilterLogicalOperator;

    onLogicalOperatorChange: UseFilterLogicalOperatorChangeHandler;
  };

  popup?: {
    isOpen?: boolean;

    onOpen?: () => void;

    onClose?: () => void;
  };
};

export default function FilterBoard<Row extends TableRowRecord>({
  data,
  filtering,
  popup = {},
}: FilterBoardProps<Row>) {
  const { columns } = data;

  const {
    filters,
    onAddFilter,
    onUpdateFilter,
    onDeleteFilter,
    onLogicalOperatorChange,
    logicalOperator,
  } = filtering;

  const { isOpen, onOpen, onClose } = popup;

  const filterColumns = columns.filter((column) => column.filterable);

  const createFilterDeleteHandler = (i: number) => () => {
    onDeleteFilter(i);

    if (filters.length === 1) {
      onClose?.();
    }
  };

  const handleOpenChangeBoard = (open: boolean) => {
    if (!open) {
      onClose?.();
      return;
    }

    if (filters.length > 0) {
      onOpen?.();
      return;
    }

    addFilter();

    onOpen?.();
  };

  const addFilter = () => {
    const filterColumn = filterColumns[0];

    const filterProps = filterColumn.filterProps;

    const filterOps = getAvailableFilterOps(filterProps?.type || "text", {
      omittedOps: filterProps?.omitOps,
      selectedOps: filterProps?.selectOps,
    });

    onAddFilter({
      name: filterColumn.name.toString(),
      operation: filterOps[0],
      value: "",
    });
  };

  const handleAddFilter = () => {
    addFilter();
  };

  const createFilterOperationChangeHandler =
    (i: number) => (e: SyntheticEvent<any>) => {
      const name = e.target.name;
      const value = e.target.value;

      onUpdateFilter(
        {
          [name]: value,
        },
        i,
      );
    };

  const createFilterColumnChangeHandler =
    (i: number) => (e: SyntheticEvent<any>) => {
      const value = e.target.value;

      const column = columns.find((col) => col.name === value);

      const op = getAvailableFilterOps(column?.filterProps?.type || "text");

      onUpdateFilter({ name: value, operation: op[0], value: "" }, i);
    };

  const handleChangeLogicalOperator = (e: SyntheticEvent<any>) => {
    const value = e.target.value;

    onLogicalOperatorChange(value);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChangeBoard}>
      <Tooltip>
        <PopoverTrigger
          render={
            <TooltipTrigger
              render={
                <Button variant="ghost" size="icon-lg">
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
              <div className={cn("flex gap-4 items-center ")} key={i}>
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
                        onChange={handleChangeLogicalOperator}
                        value={logicalOperator}
                      >
                        <NativeSelectOption value="AND">AND</NativeSelectOption>
                        <NativeSelectOption value="OR">OR</NativeSelectOption>
                      </InputPlus>
                    )
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                  <InputPlus
                    type="select"
                    name="name"
                    onChange={createFilterColumnChangeHandler(i)}
                    value={name}
                    placeholder="Select column"
                    getInputLabel={column.headerName}
                  >
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
                        {filterOperations[op]}
                      </NativeSelectOption>
                    ))}
                  </InputPlus>
                  <InputPlus
                    name="value"
                    onChange={createFilterOperationChangeHandler(i)}
                    value={filters[i].value}
                    {...{ placeholder: `${column?.headerName}` }}
                    {...filterProps}
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
