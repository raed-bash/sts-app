import ArrowDown from "../../../assets/icons/arrow-down.svg?react";
import Option, { type OptionProps } from "./Option";
import Tooltip, { type TooltipProps } from "src/components/tooltip/Tooltip";
import { cn } from "src/utils/cn";
import useRawSelectUtils, {
  type OptionType,
  type UseRawSelectUtilsOptions,
} from "./hooks/useRawSelectUtils";

export type RawSelectProps<TOption extends OptionType> = Omit<
  TooltipProps,
  "title" | "onChange" | "onClick"
> &
  Partial<Pick<TooltipProps, "title">> &
  UseRawSelectUtilsOptions<TOption> & {
    options: TOption[];

    optionsContainer?: React.HTMLAttributes<HTMLDivElement>;

    arrowDownProps?: React.SVGProps<SVGSVGElement>;

    inputProps?: React.HTMLAttributes<HTMLDivElement>;

    enableTooltip?: boolean;

    getOptionLabel: (option: TOption) => string;

    getOptionProps?: (option: TOption, i: number) => Partial<OptionProps>;

    startHelperOptions?: OptionProps[];

    endHelperOptions?: OptionProps[];
  };

function RawSelect<TOption extends OptionType>({
  className,
  onClick = () => {},
  onChange,
  options = [],
  name,
  optionsContainer = {},
  disabled,
  inputProps = {},
  arrowDownProps = {},
  multiple,
  value,
  enableTooltip = true,
  getUniqueValue = () => "",
  getInputLabel = () => "",
  getOptionLabel = () => "",
  getOptionProps = () => ({}),
  startHelperOptions = [],
  endHelperOptions = [],
  ...props
}: RawSelectProps<TOption>) {
  const {
    handleOptionsKeyDown,
    handleSelectKeyDown,
    handleSelectValue,
    inputLabel,
    tooltipRef,
    handleClick,
    openDrop,
    isSelectedOption,
    optionsContainerRef,
  } = useRawSelectUtils({
    name,
    disabled,
    getUniqueValue,
    onClick,
    getInputLabel,
    onChange,
    value,
    multiple,
  } as any);

  const optionsLength = options.length;

  const startHelperOptionsLength = startHelperOptions.length;

  return (
    <Tooltip
      className={cn(
        "w-full h-[33px] rounded-sm indent-1 p-1 border border-[lab(90.952%_0_-.0000119209)] duration-75 bg-transparent shadow-xs",
        "focus-visible:border-(-- primary) outline-none focus-visible:ring-[3px] focus-visible:ring-(--primary)/30 ",
        "aria-invalid:border-(--danger-main) aria-invalid:ring-(--danger-main)/30",
        className,
      )}
      ref={tooltipRef}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleSelectKeyDown}
      title={multiple && enableTooltip ? inputLabel : ""}
      placement={openDrop ? "top" : "bottom"}
      id={name}
      role="combobox"
      {...props}
    >
      <div className="flex justify-between items-center px-1 h-full ">
        <div
          className={cn(
            "ps-1 pe-2 inline-block truncate",
            inputProps.className,
          )}
        >
          {inputLabel}
        </div>
        <ArrowDown {...arrowDownProps} />
      </div>
      {openDrop && (
        <div
          onKeyDown={handleOptionsKeyDown}
          {...optionsContainer}
          ref={optionsContainerRef}
          className={cn(
            "max-h-64 absolute z-1000 -ms-[3px] mt-1 w-full overflow-y-auto overflow-x-hidden bg-white border border-black rounded-sm",
            optionsContainer.className,
          )}
        >
          {startHelperOptions.map((helperOptionProps, i) => (
            <Option
              key={i}
              selected={value === ""}
              onSelectValue={handleSelectValue}
              data-index={i}
              {...helperOptionProps}
            />
          ))}
          {options.map((option, i) => (
            <Option
              key={getUniqueValue(option)}
              selected={isSelectedOption(option)}
              onSelectValue={handleSelectValue}
              multiple={multiple}
              value={option}
              data-index={i + startHelperOptionsLength}
              tabIndex={0}
              {...getOptionProps(option, i)}
            >
              {getOptionLabel(option)}
            </Option>
          ))}
          {endHelperOptions.map((helperOptionProps, i) => (
            <Option
              key={i + optionsLength + startHelperOptionsLength}
              {...helperOptionProps}
            />
          ))}
        </div>
      )}
    </Tooltip>
  );
}

export default RawSelect;
