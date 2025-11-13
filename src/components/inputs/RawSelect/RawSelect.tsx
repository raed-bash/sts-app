import React, {
  Children,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { ReactComponent as ArrowDown } from "../../../assets/icons/arrow-down.svg";
import { EventTarget } from "../../../utils/EventTarget";
import ParentOption from "./ParentOption";
import Tooltip from "src/components/Tooltip";
import useFocusout from "src/hooks/useFocusout";

const openSelectStatus = ["enter", "space", "arrowdown", "arrowup"];

/**
 * @typedef utils
 * @property {any} value
 * @property {React.HTMLAttributes<HTMLDivElement>} optionsContainer
 * @property {React.SVGProps<SVGSVGElement> & {title?: string;}} arrowDownProps
 */

/**
 * @typedef rawSelectProps
 * @type {React.SelectHTMLAttributes<HTMLSelectElement> & utils}
 */

/**
 * @param {rawSelectProps} props
 */
function RawSelect({
  children,
  className = "",
  onBlur = () => {},
  onClick = () => {},
  onChange = () => {},
  name,
  value: externalValue,
  optionsContainer = { className: "" },
  disabled,
  inputProps = { className: "" },
  arrowDownProps = {},
  multipleSelect,
  helperText,
  error,
  helperTextProps = { className: "" },
  enableTooltip = true,
  ...props
}) {
  const [openDrop, setOpenDrop] = useState(false);
  const [options, setOptions] = useState({});
  const [value, setValue] = useState(() => (multipleSelect ? new Set() : 0));
  const selectRef = useRef(null);

  const handleOpenDrop = useCallback(() => {
    setOpenDrop(true);
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

  const handleCloseDrop = useCallback(() => {
    setOpenDrop(false);
  }, []);

  const handleValue = useCallback(
    /**
     *
     * @param {ValueOptionDto} value
     */
    (value) => {
      if (multipleSelect) {
        setValue((values) => {
          const newValues = new Set(values);

          newValues.add(value.value);

          return newValues;
        });
      } else {
        setValue(value.value);
      }
    },
    [multipleSelect]
  );

  const handleSelectValue = useCallback(
    /**
     *
     * @param {ValueOptionDto} valueOption
     */
    (valueOption) => {
      if (multipleSelect) {
        const newValue = new Set(value);

        if (newValue.has(valueOption.value)) {
          newValue.delete(valueOption.value);
        } else {
          newValue.add(valueOption.value);
        }

        const valueToOnChange = [];

        for (const valueOf of newValue.values()) {
          valueToOnChange.push(valueOf);
        }

        onChange(new EventTarget(name, valueToOnChange));
      } else {
        onChange(new EventTarget(name, valueOption.value));
        handleCloseDrop();
        selectRef.current.focus();
      }
    },
    [handleCloseDrop, name, onChange, multipleSelect, value]
  );

  const handleSelectKeyDown = useCallback(
    (e) => {
      const code = e.code.toLowerCase();
      if (openSelectStatus.includes(code)) {
        e.preventDefault();
        handleClick();
      }
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
          selectRef.current.focus();
          handleCloseDrop();

          break;
        default:
      }
    },
    [handleCloseDrop]
  );

  // Load selected value

  const refreshOptions = useCallback(
    (children) => {
      setOptions(
        Object.fromEntries(
          children.map(({ props }) => [props.value, props.children])
        )
      );
    },
    [setOptions]
  );

  // Select value on externalValue change
  useEffect(() => {
    if (multipleSelect) {
      if (!Array.isArray(externalValue)) {
        throw new Error("value of Select input is not array");
      }

      let diff = false;

      for (const valueOf of value.values()) {
        if (!externalValue.includes(valueOf)) {
          diff = true;
          break;
        }
      }

      for (const valueOf of externalValue) {
        if (!value.has(valueOf)) {
          diff = true;
          break;
        }
      }

      if (diff) {
        setValue(new Set(externalValue));
      }
    } else {
      if (externalValue !== value) {
        const selectedOption = options[externalValue];

        // if (selectedOption) {
        handleValue(
          new ValueOptionDto({
            children: selectedOption,
            value: externalValue,
          })
        );
        // }
      }
    }
  }, [externalValue, handleValue, value, options, multipleSelect]);

  // Load children options
  useEffect(() => {
    if (children) {
      refreshOptions(Array.isArray(children) ? children : [children]);
    }
  }, [children, refreshOptions]);

  // Select first option
  // useEffect(() => {
  //   if (!multipleSelect) {
  //     if (children && value === "") {
  //       const firstChildrenProps = Children.toArray(children)[0].props;

  //       handleValue(new ValueOptionDto(firstChildrenProps));
  //     }
  //   }
  // }, [children, value, handleValue, multipleSelect]);

  useFocusout(selectRef, handleCloseDrop);

  const containerClassNameMemo = useMemo(
    () =>
      twMerge(
        `border-[1px] border-black ${
          disabled ? `opacity-60` : `focus:border-[2px]`
        } h-7 rounded-md relative w-max select-none w-full`,
        className
      ),
    [disabled, className]
  );

  const inputClassNameMemo = useMemo(
    () => twMerge("ps-1 pe-2 inline-block truncate", inputProps.className),
    [inputProps.className]
  );

  const optionsContainerClassNameMemo = useMemo(
    () =>
      twMerge(
        "max-h-64 absolute z-[1000] w-full overflow-y-auto overflow-x-hidden bg-white border-[1px] border-black",
        optionsContainer.className
      ),
    [optionsContainer.className]
  );

  const helperTextClassNameMemo = useMemo(
    () =>
      twMerge(
        (error && "text-danger-main ") + " text-sm",
        helperTextProps.className
      ),
    [error, helperTextProps.className]
  );

  const inputView = useMemo(() => {
    if (multipleSelect) {
      const children = [];
      let i = 0;
      const size = value.size;
      for (const valueOf of value.values()) {
        ++i;
        children.push(options[valueOf], size === i ? "" : ", ");
      }

      return children;
    } else {
      return [options[value]];
    }
  }, [multipleSelect, value, options]);

  return (
    <Tooltip
      className={containerClassNameMemo}
      ref={selectRef}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleSelectKeyDown}
      title={enableTooltip && inputView}
      placement={openDrop ? "top" : "bottom"}
      {...props}
    >
      <div className="flex justify-between items-center px-1 h-full ">
        <div className={inputClassNameMemo}>{inputView}</div>
        <ArrowDown {...arrowDownProps} />
      </div>
      {openDrop && (
        <div
          onKeyDown={handleOptionsKeyDown}
          {...optionsContainer}
          className={optionsContainerClassNameMemo}
        >
          {Children.map(children, (child, i) => {
            let selected = null;
            if (multipleSelect) {
              selected = value.has(child.props?.value);
            } else {
              selected = value === child.props?.value;
            }
            return (
              <ParentOption
                {...child.props}
                i={i}
                selected={selected}
                onSelectValue={handleSelectValue}
                multipleSelect={multipleSelect}
              />
            );
          })}
        </div>
      )}
      <p {...helperTextProps} className={helperTextClassNameMemo}>
        {helperText}
      </p>
    </Tooltip>
  );
}

export default memo(RawSelect);

export class ValueOptionDto {
  constructor({ value = null, children = null }) {
    this.value = value;
    this.children = children;
  }
}
