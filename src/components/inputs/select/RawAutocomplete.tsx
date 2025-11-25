import { useRef, useState, type ReactNode } from "react";
import ArrowDown from "../../../assets/icons/arrow-down.svg?react";
import { EventTarget } from "../../../utils/EventTarget";
import Option, { type OptionProps } from "./Option";
import useRawSelectUtils, {
  type OptionType,
  type RawSelectMap,
  type UseRawSelectUtilsOptions,
} from "./hooks/useRawSelectUtils";
import { cn } from "src/utils/cn";
import Tooltip, { type TooltipProps } from "src/components/Tooltip";
import useFocusout from "src/hooks/useFocusout";

export type RawAutocomplete<TOption extends OptionType> = Omit<
  TooltipProps,
  "title" | "onChange" | "onClick"
> &
  Partial<Pick<TooltipProps, "title">> &
  UseRawSelectUtilsOptions<TOption> & {
    options: (TOption & { helperElement?: true; content?: () => ReactNode })[];

    optionsContainer?: React.HTMLAttributes<HTMLDivElement>;

    arrowDownProps?: React.SVGProps<SVGSVGElement>;

    inputProps?: React.HTMLAttributes<HTMLDivElement>;

    enableTooltip?: boolean;

    getOptionLabel?: (option: TOption) => string;

    getOptionProps?: (option: TOption, i: number) => Partial<OptionProps>;

    onInputChange?: (e: EventTarget) => string;

    placeholder?: string;
    /**
     * @default false
     */
    freeSolo?: boolean;
    /**
     * @default true
     */
    localFilter?: boolean;
  };

function RawAutocomplete<TOption extends OptionType>({
  className = "",
  onClick = () => {},
  onChange,
  onInputChange = () => "",
  name,
  value: externalValue,
  optionsContainer = { className: "" },
  options: externalOptions = [],
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
  ...props
}: RawAutocomplete<TOption>) {
  const {
    handleOptionsKeyDown,
    handleSelectKeyDown,
    handleSelectValue,
    inputLabel,
    tooltipRef,
    handleClick,
    openDrop,
    handleOpenDrop,
  } = useRawSelectUtils<TOption>({
    name,
    disabled,
    getUniqueValue,
    onClick,
    getInputLabel,
    onChange,
    value: externalValue,
    multiple,
  } as any);

  const [valueSearch, setValueSearch] = useState("");
  const inputRef = useRef(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  const handleValueSearch = (value: string) => {
    setValueSearch(value);
    onInputChange(new EventTarget(name, value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = e.target.value;

    if (!openDrop) {
      handleOpenDrop();
    }

    if (!value) {
      if (multiple) {
        onChange(new EventTarget(name, new Map()));
      } else {
        onChange(new EventTarget(name));
      }
    }

    handleValueSearch(value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (handleSelectKeyDown(e)) {
      if (e.code.toLowerCase() !== "space") {
        if (optionsContainerRef.current) {
          (optionsContainerRef.current.firstChild as HTMLElement)?.focus();
        }
      }
    }
  };

  const handleOptionsContainerKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (handleOptionsKeyDown(e) === false) {
      if (inputRef.current) {
        (inputRef.current as HTMLElement).focus();
      }
    }
  };

  useFocusout(tooltipRef, () => {
    if (!freeSolo) {
      handleValueSearch("");
    }
  });

  const filteredOptions = localFilter
    ? externalOptions.filter(
        (option) =>
          option?.helperElement ||
          getOptionLabel(option)
            .toLowerCase()
            .includes(valueSearch.toLowerCase())
      )
    : externalOptions;

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
            filteredOptions.map((option, i) => {
              if (option.helperElement)
                return option.content ? option.content() : "";

              let selected: boolean = false;

              const optionUniqueValue = getUniqueValue(option);

              if (externalValue) {
                if (multiple) {
                  selected = (externalValue as RawSelectMap<TOption>).has(
                    optionUniqueValue
                  );
                } else {
                  selected =
                    optionUniqueValue ===
                    getUniqueValue(externalValue as TOption);
                }
              }

              return (
                <Option
                  key={getUniqueValue(option)}
                  className={cn(selected ? "text-white" : "text-black")}
                  onSelectValue={handleSelectValue}
                  value={option}
                  selected={selected}
                  data-index={i}
                  multiple={multiple}
                  {...getOptionProps(option, i)}
                >
                  {getOptionLabel(option)}
                </Option>
              );
            })
          ) : (
            <Option disabled>No options</Option>
          )}
        </div>
      )}
    </Tooltip>
  );
}

export default RawAutocomplete;
