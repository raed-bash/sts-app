import ArrowDown from "../../../assets/icons/arrow-down.svg?react";
import Option, { type OptionProps } from "./Option";
import { type OptionType } from "./hooks/useRawSelectUtils";
import { cn } from "src/utils/cn";
import Tooltip, { type TooltipProps } from "src/components/tooltip/Tooltip";
import type { UseRawAutocompleteUtilsOptions } from "./hooks/useRawAutocompleteUtils";
import useRawAutocompleteUtils from "./hooks/useRawAutocompleteUtils";

export type RawAutocompleteProps<TOption extends OptionType> = Omit<
  TooltipProps,
  "title" | "onChange" | "onClick"
> &
  Partial<Pick<TooltipProps, "title">> &
  UseRawAutocompleteUtilsOptions<TOption> & {
    optionsContainer?: React.HTMLAttributes<HTMLDivElement>;

    arrowDownProps?: React.SVGProps<SVGSVGElement>;

    inputProps?: React.HTMLAttributes<HTMLDivElement>;

    enableTooltip?: boolean;

    getOptionProps?: (option: TOption, i: number) => Partial<OptionProps>;

    placeholder?: string;

    startHelperOptions?: OptionProps[];

    endHelperOptions?: OptionProps[];
  };

function RawAutocomplete<TOption extends OptionType>({
  className = "",
  onClick = () => {},
  onChange,
  onInputChange = () => "",
  name,
  value,
  optionsContainer = { className: "" },
  options = [],
  disabled,
  getOptionLabel = () => "",
  getInputLabel = () => "",
  getOptionProps = () => ({}),
  getUniqueValue = () => "",
  freeSolo = false,
  localFilter = true,
  placeholder,
  arrowDownProps = {},
  multiple,
  enableTooltip = true,
  startHelperOptions = [],
  endHelperOptions = [],
  ...props
}: RawAutocompleteProps<TOption>) {
  const {
    handleSelectKeyDown,
    handleSelectValue,
    inputLabel,
    tooltipRef,
    handleClick,
    openDrop,
    isSelectedOption,
    filteredOptions,
    handleInputChange,
    handleInputKeyDown,
    handleOptionsContainerKeyDown,
    optionsContainerRef,
    inputRef,
    valueSearch,
  } = useRawAutocompleteUtils<TOption>({
    name,
    disabled,
    getUniqueValue,
    onClick,
    getInputLabel,
    onChange,
    value,
    getOptionLabel,
    onInputChange,
    localFilter,
    freeSolo,
    options,
    multiple,
  } as any);

  return (
    <Tooltip
      className={cn(
        `border border-black h-12 relative select-none w-full`,
        disabled ? `opacity-60` : `focus:border-2`,
        className
      )}
      ref={tooltipRef}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleSelectKeyDown}
      title={enableTooltip ? inputLabel : ""}
      placement={openDrop ? "top" : "bottom"}
      {...props}
    >
      <div className="flex justify-between items-center h-full pe-1">
        <input
          className="ps-2 w-full bg-transparent border-none focus:border-none outline-none"
          type="text"
          ref={inputRef}
          onChange={handleInputChange}
          value={valueSearch || inputLabel || ""}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
        <ArrowDown {...arrowDownProps} />
      </div>
      {openDrop && (
        <div
          onKeyDown={handleOptionsContainerKeyDown}
          ref={optionsContainerRef}
          {...optionsContainer}
          className={cn(
            "max-h-64 absolute z-50 w-full overflow-y-auto overflow-x-hidden bg-white border border-black",
            optionsContainer.className
          )}
        >
          {filteredOptions.length ? (
            <>
              {startHelperOptions.map((helperOptionProps, i) => (
                <Option
                  key={i}
                  selected={value === ""}
                  onSelectValue={handleSelectValue}
                  data-index={-1}
                  {...helperOptionProps}
                />
              ))}
              {filteredOptions.map((option, i) => (
                <Option
                  key={getUniqueValue(option)}
                  selected={isSelectedOption(option)}
                  onSelectValue={handleSelectValue}
                  multiple={multiple}
                  value={option}
                  data-index={i}
                  {...getOptionProps(option, i)}
                >
                  {getOptionLabel(option)}
                </Option>
              ))}
              {endHelperOptions.map((helperOptionProps, i) => (
                <Option key={i} {...helperOptionProps} />
              ))}
            </>
          ) : (
            <Option disabled>No options</Option>
          )}
        </div>
      )}
    </Tooltip>
  );
}

export default RawAutocomplete;
