import { EventTarget } from "../../utils/EventTarget";
import ButtonOption, { type ButtonOptionProps } from "./ButtonOption";
import type { ButtonColor, ButtonVariant } from "./Button";
import { cn } from "src/utils/cn";

export type ButtonGroupOption = Omit<ButtonOptionProps, "index"> & {
  name: string;
  value?: any;
  label: string;
};

export type ButtonGroupProps = {
  options: ButtonGroupOption[];
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  buttonColor?: ButtonColor;
  buttonVariant?: ButtonVariant;
  buttonSecondaryColor?: ButtonColor;
  buttonClassName?: string;
  activeButtonClassName?: string;
  iconClassName?: string;
  activeIconClassName?: string;
  overlapSpacing: number;
  activeValue: any;
  onChange: (e: EventTarget<any>) => void;
};

function ButtonGroup({
  options = [],
  activeValue,
  onChange,
  buttonColor = "primary",
  buttonSecondaryColor = "secondary",
  buttonVariant = "contained",
  buttonClassName = "",
  activeButtonClassName = "",
  iconClassName = "fill-gray-main",
  activeIconClassName = "fill-white",
  overlapSpacing = 45,
  containerProps = { className: "" },
}: ButtonGroupProps) {
  const handleClick =
    (
      name: string,
      value: any,
      option: Omit<ButtonGroupOption, "value" | "label">
    ) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onChange(new EventTarget(name, value));

      if (option.onClick) {
        option.onClick(e);
      }
    };

  return (
    <div
      {...containerProps}
      className={cn("flex max-sm:w-full", containerProps.className)}
    >
      {options.map(
        (
          { value, label, ...option } = {
            className: "",
            label: "",
            name: "",
          },
          index
        ) => (
          <ButtonOption
            key={value}
            active={activeValue === value}
            index={index}
            {...option}
            onClick={handleClick(option.name, value, option)}
            activeButtonClassName={activeButtonClassName}
            activeIconClassName={activeIconClassName}
            buttonClassName={buttonClassName}
            buttonColor={buttonColor}
            buttonSecondaryColor={buttonSecondaryColor}
            buttonVariant={buttonVariant}
            iconClassName={iconClassName}
            overlapSpacing={overlapSpacing}
          >
            {label}
          </ButtonOption>
        )
      )}
    </div>
  );
}
export default ButtonGroup;
