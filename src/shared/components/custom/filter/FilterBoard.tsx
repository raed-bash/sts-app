import { FunnelIcon, FunnelXIcon, Plus, XIcon } from "lucide-react";
import { getAvailableFilterOps, resolveFieldLabel } from "./utils";
import type { FilterField } from "./types";
import type {
  FilterCondition,
  FilterLogicalOperator,
  UseFilterLogicalOperatorChangeHandler,
  UseFilterDeleteHandler,
  UseFilterAddHandler,
  UseFilterUpdateHandler,
  UseFilterClearHandler,
} from "./useFilter";
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
import { Badge } from "@/shared/components/ui/badge";
import { SelectItem } from "@/shared/components/ui/select";
import LabeledField from "../inputs/LabeledField";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/shared/components/ui/native-select";
import { filterOperations } from "./constants";
import { useTranslation } from "react-i18next";

export type FilterBoardProps = {
  /**
   * The filterable fields; only these can be selected as filter targets.
   */
  fields: FilterField[];

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

export default function FilterBoard({
  fields,
  filtering,
  popup = {},
}: FilterBoardProps) {
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

    if (fields.length > 0) {
      addFilter();
    }

    onOpen?.();
  };

  const addFilter = () => {
    const filterField = fields[0];

    const filterProps = filterField?.filterProps;

    const filterOps = getAvailableFilterOps(filterProps?.type || "text", {
      omittedOps: filterProps?.omitOps,
      selectedOps: filterProps?.selectOps,
    });

    onAddFilter({
      name: filterField ? String(filterField.name) : "",
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

  const createFilterFieldChangeHandler =
    (i: number) => (e: SyntheticEvent<any>) => {
      const value = e.target.value;

      const field = fields.find((field) => field.name === value);

      const op = getAvailableFilterOps(field?.filterProps?.type || "text");

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
                  aria-label={t("filter.filters")}
                  className="relative"
                >
                  {filters.length > 0 ? <FunnelXIcon /> : <FunnelIcon />}
                  {filters.length > 0 && (
                    <Badge className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none">
                      {filters.length}
                    </Badge>
                  )}
                </Button>
              }
            />
          }
        />
        <TooltipContent>{t("filter.filters")}</TooltipContent>
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
            {t("filter.filters")}
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
              {t("filter.clearAll")}
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 pt-2.5">
          {filters.map((filter, i) => {
            const name = filter.name;

            const field = fields.find((field) => field.name === name);

            const filterProps = field?.filterProps;

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
                    aria-label={t("filter.removeFilter")}
                  >
                    <XIcon />
                  </Button>

                  {i > 0 && (
                    <NativeSelect
                      size="sm"
                      aria-label={t("filter.logicalOperator")}
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
                    onChange={createFilterFieldChangeHandler(i)}
                    value={name}
                    placeholder={t("filter.selectField")}
                    getInputLabel={resolveFieldLabel(field.label ?? "")}
                  >
                    {fields.map((field) => (
                      <SelectItem
                        key={String(field.name)}
                        value={String(field.name)}
                      >
                        {resolveFieldLabel(field.label ?? "")}
                      </SelectItem>
                    ))}
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
                        placeholder: resolveFieldLabel(field?.label ?? ""),
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
          disabled={fields.length === 0}
          className="w-full border-dashed"
        >
          <Plus />
          {t("filter.addFilter")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
