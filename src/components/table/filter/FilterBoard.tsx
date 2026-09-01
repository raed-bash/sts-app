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
        <div className="">
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
                        type="select"
                        getInputLabel={(o) => o}
                        getOptionLabel={(o) => o}
                        getUniqueValue={(o) => o}
                        multiple={false}
                        options={["AND", "OR"]}
                        onChange={() => {}}
                        title=""
                        value={"OR"}
                      />
                    )
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <InputPlus<{ name: string; headerName: string }>
                    type="select"
                    name="name"
                    multiple={false}
                    options={filterColumns.map((column) => ({
                      name: column.name as string,
                      headerName: column.headerName,
                    }))}
                    getInputLabel={(o) => o.headerName}
                    getOptionLabel={(o) => o.headerName}
                    getUniqueValue={(o) => o.name}
                    onChange={(e) =>
                      createFilterOperationChangeHandler(i)({
                        target: {
                          name: e.target.name,
                          value: e.target.value?.name,
                        },
                      })
                    }
                    title=""
                    value={{
                      name: name || "",
                      headerName: column?.headerName || "",
                    }}
                  />
                  <InputPlus
                    type="select"
                    name="operation"
                    options={filterOps}
                    placeholder="Operation"
                    multiple={false}
                    onChange={createFilterOperationChangeHandler(i)}
                    getInputLabel={(option) => option}
                    getOptionLabel={(option) => option}
                    getUniqueValue={(o) => o}
                    value={filter.operation || ""}
                    title=""
                  />
                  <InputPlus
                    name="value"
                    type={filterProps?.type || "text"}
                    value={filter.value || ""}
                    onChange={createFilterOperationChangeHandler(i)}
                    title=""
                    placeholder={`${column?.headerName}`}
                    // type={column.filterProps?.type || "text"}
                    // name={column.name.toString()}
                    // value={column.filterProps?.value}
                    // onChange={column.filterProps?.onChange}

                    // {...{
                    // omitOps: column.filterProps?.omitOps,
                    // selectOps: column.filterProps?.selectOps,
                    // }}
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
