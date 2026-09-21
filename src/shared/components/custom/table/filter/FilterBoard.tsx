import { FunnelIcon, FunnelXIcon, Plus, XIcon } from "lucide-react";
import { getAvailableFilterOps } from "./utils/utils";
import type { TableRowRecord, TableColumn } from "../Table";
import { translateHeader } from "../utils/translate-header";
import type {
  FilterCondition,
  FilterLogicalOperator,
  UseFilterLogicalOperatorChangeHandler,
  UseFilterDeleteHandler,
  UseFilterAddHandler,
  UseFilterUpdateHandler,
  UseFilterClearHandler,
} from "./hooks/useFilter";
import type { SyntheticEvent } from "@/shared/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/custom/popover/Popover";
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
import LabeledField, {
  type LabeledFieldProps,
} from "../../inputs/LabeledField";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/shared/components/ui/native-select";
import { filterOperations } from "./constants/constants";
import { useTranslation } from "react-i18next";
import type {
  FilterDateOperationsWithTypes,
  FilterNumberOperationsWithTypes,
  FilterSelectOperationsWithTypes,
  FilterTextOperationsWithTypes,
} from "./types";

export type FilterFieldProps<
  Option,
  Multiple extends boolean | undefined = false,
> = LabeledFieldProps<Option, Multiple> &
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

    onClearFilters: UseFilterClearHandler;

    logicalOperator: FilterLogicalOperator;

    onLogicalOperatorChange: UseFilterLogicalOperatorChangeHandler;
  };

  popup?: {
    isOpen?: boolean;

    onOpen?: () => void;

    onClose?: () => void;
  };
};

const NULL_OPS = new Set(["isNull", "isNotNull"]);

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
    onClearFilters,
    onLogicalOperatorChange,
    logicalOperator,
  } = filtering;

  const { isOpen, onOpen, onClose } = popup;

  const { t } = useTranslation();

  const filterColumns = columns.filter((column) => column.filterable);

  const createFilterDeleteHandler = (i: number) => () => {
    onDeleteFilter(i);

    if (filters.length === 1) {
      onClose?.();
    }
  };

  const handleClearFilters = () => {
    onClearFilters();

    onClose?.();
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
                <Button
                  variant="ghost"
                  size="icon-lg"
                  aria-label={t("table.filters")}
                  className="relative"
                >
                  {filters.length > 0 ? <FunnelXIcon /> : <FunnelIcon />}
                  {filters.length > 0 && (
                    <span className="absolute -top-0.5 -end-0.5 flex size-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                      {filters.length}
                    </span>
                  )}
                </Button>
              }
            />
          }
        />
        <TooltipContent>{t("table.filters")}</TooltipContent>
      </Tooltip>

      <PopoverContent
        alignOffset={0}
        align="start"
        side="top"
        className="w-[min(40rem,calc(100vw-2rem))]"
      >
        <div className="flex items-center justify-between gap-3 pr-1.5">
          <span className="flex items-center gap-2 text-sm font-medium">
            <FunnelIcon className="size-4 text-muted-foreground" />
            {t("table.filters")}
            {filters.length > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {filters.length}
              </span>
            )}
          </span>

          {filters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground"
            >
              <XIcon />
              {t("table.clearAll")}
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 pt-2.5">
          {filters.map((filter, i) => {
            const name = filter.name;

            const column = filterColumns.find((column) => column.name === name);

            const filterProps = column?.filterProps;

            if (!filterProps) return null;

            const filterOps = getAvailableFilterOps(filterProps.type, {
              selectedOps: filterProps.selectOps,
              omittedOps: filterProps.omitOps,
            });

            const needsValue = !NULL_OPS.has(filter.operation ?? "");

            return (
              <div key={i} className="flex items-start gap-2">
                <div className="flex shrink-0 items-center gap-1.5">
                  <Button
                    variant={"destructive"}
                    size="icon-sm"
                    onClick={createFilterDeleteHandler(i)}
                    aria-label={t("table.removeFilter")}
                  >
                    <XIcon />
                  </Button>

                  {i > 0 && (
                    <NativeSelect
                      size="sm"
                      aria-label={t("table.logicalOperator")}
                      value={logicalOperator}
                      onChange={handleChangeLogicalOperator}
                      className="w-[4.5rem]"
                    >
                      <NativeSelectOption value="AND">AND</NativeSelectOption>
                      <NativeSelectOption value="OR">OR</NativeSelectOption>
                    </NativeSelect>
                  )}
                </div>

                <div className="grid flex-1 grid-cols-3 gap-2">
                  <LabeledField
                    type="select"
                    name="name"
                    onChange={createFilterColumnChangeHandler(i)}
                    value={name}
                    placeholder={t("table.selectColumn")}
                    getInputLabel={translateHeader(column.headerName)}
                  >
                    <SelectGroup>
                      <SelectLabel>{t("table.user")}</SelectLabel>
                      {filterColumns.map((column) => (
                        <SelectItem
                          key={column.name.toString()}
                          value={column.name}
                        >
                          {translateHeader(column.headerName)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </LabeledField>

                  <LabeledField
                    type="nativeSelect"
                    name="operation"
                    multiple={false}
                    onChange={createFilterOperationChangeHandler(i)}
                    value={filter.operation || ""}
                  >
                    {filterOps.map((op) => (
                      <NativeSelectOption key={op} value={op}>
                        {t(filterOperations[op])}
                      </NativeSelectOption>
                    ))}
                  </LabeledField>

                  {needsValue ? (
                    <LabeledField
                      name="value"
                      onChange={createFilterOperationChangeHandler(i)}
                      value={filters[i].value}
                      {...{
                        placeholder: `${translateHeader(
                          column?.headerName ?? "",
                        )}`,
                      }}
                      {...filterProps}
                    />
                  ) : (
                    <div className="flex h-8 items-center rounded-lg border border-dashed border-input px-2.5 text-sm text-muted-foreground select-none">
                      —
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddFilter}
          className="w-full border-dashed"
        >
          <Plus />
          {t("table.addFilter")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
