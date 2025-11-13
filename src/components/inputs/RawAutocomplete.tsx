import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { ReactComponent as ArrowDown } from "../../assets/icons/arrow-down.svg";
import { EventTarget } from "../../utils/EventTarget";
import ParentOption from "./RawSelect/ParentOption";

const openSelectStatus = ["enter", "space", "arrowdown", "arrowup"];

/**
 * @typedef utils
 * @property {object} value
 * @property {React.HTMLAttributes<HTMLDivElement>} optionsContainer
 */

/**
 * @typedef rawSelectProps
 * @type {React.SelectHTMLAttributes<HTMLSelectElement> & utils}
 */

/**
 * @param {rawSelectProps} props
 */
function RawAutocomplete({
  className = "",
  onBlur = () => {},
  onClick = () => {},
  onChange = () => {},
  onInputChange = () => {},
  name,
  value: externalValue,
  optionsContainer = { className: "" },
  options: externalOptions = [],
  disabled,
  getOptionLabel = (option) => option,
  getValue = (value) => value,
  getInputLabel = (label) => label,
  getOptionProps = () => ({}),
  getUniqueValue = (option) => option,
  freeSolo,
  localFilter = true,
  placeholder,
  arrowDownProps = {},
  ...props
}) {
  const [openDrop, setOpenDrop] = useState(false);
  const [options, setOptions] = useState({});
  const [value, setValue] = useState({});
  const [valueSearch, setValueSearch] = useState("");
  const inputRef = useRef(null);
  const selectRef = useRef(null);
  const optionsContainerRef = useRef(null);

  const handleOpenDrop = useCallback(() => {
    setOpenDrop(true);
  }, []);

  const handleCloseDrop = useCallback(() => {
    setOpenDrop(false);
  }, []);

  const handleClick = useCallback(
    (e) => {
      if (disabled) return;

      if (!openDrop) {
        handleOpenDrop();
      }

      onClick(e);
    },
    [onClick, openDrop, handleOpenDrop, disabled]
  );

  const handleValue = useCallback((value) => {
    setValue(value);
  }, []);

  const handleChange = useCallback(
    (option) => {
      onChange(new EventTarget(name, option));
    },
    [name, onChange]
  );

  const handleSelectValue = useCallback(
    ({ option }) => {
      handleChange(option);

      handleCloseDrop();

      inputRef.current.focus();

      setValueSearch("");
    },
    [handleCloseDrop, handleChange]
  );

  const handleSelectKeyDown = useCallback(
    (e) => {
      const code = e.code.toLowerCase();
      if (openSelectStatus.includes(code)) {
        if (code !== "space") {
          e.preventDefault();
        }

        handleClick();

        return true;
      }

      return false;
    },
    [handleClick]
  );

  const handleOptionsKeyDown = useCallback(
    (e) => {
      const currentTarget = e.currentTarget;
      const currentOption = e.target;
      switch (e.code.toLowerCase()) {
        case "arrowdown":
          const nextOptionIndex = currentTarget.childNodes.item(
            +currentOption.ariaRowIndex + 1
          );

          if (nextOptionIndex) {
            nextOptionIndex.focus();
          } else {
            currentTarget.firstChild.focus();
          }
          break;
        case "arrowup":
          const previousOptionIndex = currentTarget.childNodes.item(
            +currentOption.ariaRowIndex - 1
          );

          if (previousOptionIndex) {
            previousOptionIndex.focus();
          } else {
            currentTarget.lastChild.focus();
          }
          break;
        case "escape":
          inputRef.current.focus();
          handleCloseDrop();

          break;
        default:
          return false;
      }
    },
    [handleCloseDrop]
  );

  // Load selected value

  const refreshOptions = useCallback(
    (externalOptions) => {
      setOptions(
        Object.fromEntries(
          externalOptions.map((option) => [getUniqueValue(option), option])
        )
      );
    },
    [setOptions, getUniqueValue]
  );

  const handleValueSearch = useCallback(
    (value) => {
      setValueSearch(value);
      onInputChange(new EventTarget(name, value));
    },
    [name, onInputChange]
  );

  const handleInputChange = useCallback(
    (e) => {
      if (disabled) return;
      const value = e.target.value;

      if (!openDrop) {
        handleOpenDrop();
      }

      if (!value) {
        handleChange({});
        handleValue({});
      }

      handleValueSearch(value);
    },
    [
      openDrop,
      handleChange,
      handleOpenDrop,
      handleValue,
      handleValueSearch,
      disabled,
    ]
  );

  const handleInputKeyDown = useCallback(
    (e) => {
      if (handleSelectKeyDown(e)) {
        if (e.code.toLowerCase() !== "space") {
          if (optionsContainerRef.current) {
            optionsContainerRef.current?.firstChild?.focus();
          }
        }
      }
    },
    [handleSelectKeyDown]
  );

  const handleOptionsContainerKeyDown = useCallback(
    (e) => {
      if (handleOptionsKeyDown(e) === false) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [handleOptionsKeyDown]
  );

  useEffect(() => {
    if (getUniqueValue(externalValue) !== getUniqueValue(value)) {
      const selectedOption = options[getUniqueValue(externalValue)];

      // if (selectedOption) {
      handleValue(selectedOption || externalValue);
      // }
    }
  }, [externalValue, getUniqueValue, handleValue, value, options]);

  // Load children options
  useEffect(() => {
    if (externalOptions) {
      refreshOptions(externalOptions);
    }
  }, [externalOptions, refreshOptions]);

  useEffect(() => {
    /**
     * @param {MouseEvent} e
     */
    const handleMouseClickOutside = (e) => {
      if (selectRef.current) {
        if (!selectRef.current.contains(e.target)) {
          handleCloseDrop();

          if (!freeSolo) {
            handleValueSearch("");
          }
        }
      }
    };

    document.addEventListener("mousedown", handleMouseClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleMouseClickOutside);
    };
  }, [handleCloseDrop, freeSolo, handleValueSearch]);

  const filteredOptions = useMemo(
    () =>
      localFilter
        ? externalOptions.filter(
            (option) =>
              option?.helperElement ||
              getOptionLabel(option)
                .toLowerCase()
                .includes(valueSearch.toLowerCase())
          )
        : externalOptions,
    [externalOptions, valueSearch, getOptionLabel, localFilter]
  );

  const containerClassNameMemo = useMemo(
    () =>
      twMerge(
        `border-[1px] border-black ${
          disabled ? `opacity-60` : `focus:border-[2px]`
        } h-[35px] rounded-md relative w-max select-none `,
        className
      ),
    [className, disabled]
  );

  const optionsContainerClassNameMemo = useMemo(
    () =>
      twMerge(
        "max-h-64 absolute z-50 w-full overflow-y-auto overflow-x-hidden bg-white border-[1px] border-black",
        optionsContainer.className
      ),
    [optionsContainer.className]
  );

  return (
    <div
      className={containerClassNameMemo}
      ref={selectRef}
      onClick={handleClick}
      {...props}
    >
      <div className="flex justify-between items-center h-full pe-1">
        <input
          className="ps-2 w-full bg-transparent border-none focus:border-none outline-none"
          type="text"
          ref={inputRef}
          onChange={handleInputChange}
          value={valueSearch || getInputLabel(value) || ""}
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
          className={optionsContainerClassNameMemo}
        >
          {filteredOptions.length ? (
            filteredOptions.map((option, i) => {
              if (option.helperElement) return option.content();

              const selected = getUniqueValue(option) === getUniqueValue(value);

              return (
                <ParentOption
                  className={`${selected ? "text-white" : "text-black"}`}
                  key={getUniqueValue(option)}
                  {...getOptionProps(option, i)}
                  i={i}
                  onSelectValue={handleSelectValue}
                  option={option}
                  selected={selected}
                >
                  {getOptionLabel(option)}
                </ParentOption>
              );
            })
          ) : (
            <ParentOption disabled>No options</ParentOption>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(RawAutocomplete);
