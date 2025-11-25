import { useEffect, useRef } from "react";
import { cn } from "src/utils/cn";

export type OptionProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  disabled?: boolean;

  selectedFocus?: boolean;

  selected?: boolean;

  multiple?: boolean;

  value?: any;

  onSelectValue?: (
    props: OptionProps,
    e?: React.MouseEvent<HTMLDivElement>
  ) => void;
};

function Option(props: OptionProps) {
  const {
    onClick = () => {},
    className,
    onSelectValue = () => {},
    disabled,
    selectedFocus = true,
    onKeyDown = () => {},
    selected,
    multiple,
    ...otherProps
  } = props;

  const handleClick = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    onSelectValue(props, e);

    onClick(e!);
  };

  const optionRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    onKeyDown(e);

    switch (e.code.toLowerCase()) {
      case "enter":
        handleClick();
        break;
      default:
    }
  };

  const handleOptionRef = (ref: HTMLDivElement | null) => {
    optionRef.current = ref;
  };

  useEffect(() => {
    const optionEl = optionRef.current;

    if (optionEl) {
      if (selected) {
        if (selectedFocus) {
          optionEl.focus();
        }
      }
    }
  }, [selected, selectedFocus]);

  return (
    <div
      {...otherProps}
      className={cn(
        `px-2 py-1 w-full focus:border border-black outline-none`,
        disabled
          ? "text-gray-500 hover:bg-none bg-[#e0e0e0ff]"
          : "hover:bg-(--primary) hover:text-white text-black",
        selected ? "bg-blue-500 text-white" : "",
        className
      )}
      aria-selected={selected}
      tabIndex={disabled ? undefined : selected ? 0 : -1}
      ref={handleOptionRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {multiple && otherProps.value && (
        <input
          type="checkbox"
          className="w-5 h-5 max-lg:w-4 max-lg:h-4"
          readOnly
          checked={selected}
        />
      )}
      {"  "}
      {otherProps.children}
    </div>
  );
}

export default Option;
