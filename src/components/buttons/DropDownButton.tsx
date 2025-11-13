import { useMemo, useRef, useState, type ReactNode } from "react";
import useFocusout from "src/hooks/useFocusout";
import { EventTarget } from "src/utils/EventTarget";
import DropDownOption, { type DropDownOptionProps } from "./DropDownOption";
import { ReactComponent as ArrowDownLine } from "src/assets/icons/arrow-line-down.svg";
import { cn } from "src/utils/cn";

export type DropDownButtonOption = DropDownOptionProps & {
  selectedClassName?: string;
  label?: ReactNode;
  arrowDownClassName?: string;
};

export type DropDownButtonProps = {
  name?: string;
  onChange: (e: EventTarget<any>) => void;
  options: DropDownButtonOption[];
  value: any;
  placeholder?: string;
};

/**
 * @typedef dropDownOption
 * @type {import('./DropDownOption').dropDownOptionProps & {selectedClassName:string, label: any}}
 */

/**
 * @typedef utils
 * @property {dropDownOption[]} options
 * @property {string} name
 * @property {(e:EventTarget)=>void} onChange
 * @property {any} value
 * @property {string} placeholder
 */

/**
 * @typedef dropDownButtonProps
 * @type {utils}
 */

/**
 * @param {dropDownButtonProps} props
 */
function DropDownButton({
  name,
  onChange,
  value,
  options,
  placeholder = "أختر",
}: DropDownButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  useFocusout(dropdownRef, handleClose);

  const handleClick = (value: DropDownButtonProps["name"]) => () => {
    onChange(new EventTarget(name, value));
    handleClose();
  };

  const handleClickDropDown = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  const selectedOption = useMemo(
    () =>
      options.find((option) => option.name === value) || {
        value: "",
        label: placeholder,
        selectedClassName: "text-black",
        arrowDownClassName: "stroke-black",
      },
    [options, value, placeholder]
  );

  return (
    <div className="relative block text-right" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleClickDropDown}
        className={cn(
          `flex items-center justify-between px-6 py-2 text-white rounded-full shadow-md  gap-2`,
          selectedOption.selectedClassName || ""
        )}
      >
        <span>{selectedOption.label}</span>
        <span>
          <ArrowDownLine
            className={cn(
              `duration-150 stroke-white`,
              isOpen ? "rotate-180" : "",
              selectedOption.arrowDownClassName || ""
            )}
          />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-1000">
          {options.map(({ selectedClassName, label, ...option }) => (
            <DropDownOption
              key={option.name}
              {...option}
              onClick={handleClick(option.name)}
              className={`${option.className} ${
                value === option.name
                  ? `${selectedClassName} text-white hover:text-black`
                  : ""
              }`}
            >
              {label}
            </DropDownOption>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropDownButton;
