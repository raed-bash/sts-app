import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { twMerge } from "tailwind-merge";

function ParentOption(
  {
    onClick = () => {},
    className = "",
    i,
    onSelectValue,
    disabled,
    selectedFocus = true,
    onKeyDown = () => {},
    selected,
    multipleSelect,
    ...props
  },
  ref
) {
  const handleClick = useCallback(
    (e) => {
      if (disabled) return;
      onSelectValue(props, e);

      onClick(e);
    },
    [disabled, onSelectValue, onClick, props]
  );

  const optionRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      e.preventDefault();
      onKeyDown(e);
      switch (e.code.toLowerCase()) {
        case "enter":
          handleClick(e);
          break;
        default:
      }
    },
    [handleClick, onKeyDown]
  );

  useEffect(() => {
    /**
     * @type {HTMLDivElement}
     */
    const optionEl = optionRef.current;
    if (optionEl) {
      if (selected) {
        if (selectedFocus) {
          optionEl.focus();
        }
      }
    }
  }, [selected, selectedFocus]);

  const classNameMemo = useMemo(
    () =>
      twMerge(
        `px-2 py-1 w-full focus:border-[1px] border-black outline-none ${
          disabled
            ? "text-gray-500 hover:bg-none bg-[#e0e0e0ff]"
            : "hover:bg-primary-main hover:text-white text-black"
        } ${selected ? "bg-blue-500 text-white" : ""}`,
        className
      ),
    [disabled, selected, className]
  );

  return (
    <div
      {...props}
      className={classNameMemo}
      aria-selected={selected}
      tabIndex={disabled ? undefined : selected ? 0 : -1}
      aria-rowindex={i}
      ref={(el) => {
        optionRef.current = el;
        return ref;
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {multipleSelect && props.value && (
        <input
          type="checkbox"
          className="w-5 h-5 max-lg:w-4 max-lg:h-4"
          readOnly
          checked={selected}
        />
      )}
      {"  "}
      {props.children}
    </div>
  );
}

export default memo(forwardRef(ParentOption));
