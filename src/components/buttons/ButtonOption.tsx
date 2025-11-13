import Button, {
  type ButtonColor,
  type ButtonProps,
  type ButtonVariant,
} from "./Button";
import { cn } from "src/utils/cn";

export type ButtonOptionProps = ButtonProps & {
  index: number;
  buttonColor?: ButtonColor;
  buttonVariant?: ButtonVariant;
  activeValue?: any;
  buttonClassName?: string;
  activeButtonClassName?: string;
  iconClassName?: string;
  activeIconClassName?: string;
  overlapSpacing?: number;
  Icon?: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  active?: boolean;
  buttonSecondaryColor?: ButtonColor;
};

function ButtonOption({
  className = "",
  Icon,
  children,
  iconClassName,
  active,
  activeIconClassName,
  activeButtonClassName,
  style,
  index,
  overlapSpacing,
  buttonClassName,
  buttonVariant,
  color,
  buttonColor,
  buttonSecondaryColor,
  variant,
  ...props
}: ButtonOptionProps) {
  return (
    <Button
      className={cn(
        `w-full flex gap-x-2 px-14 justify-center items-center transition-all `,
        buttonClassName,
        className,
        active ? `z-100 ${activeButtonClassName}` : `z-[${20 + index * 10}]`
      )}
      color={active ? color || buttonColor : buttonSecondaryColor}
      variant={variant || buttonVariant}
      style={{
        borderRadius: "2rem",
        [document.body.dir === "rtl" ? "marginRight" : "marginLeft"]: `-${
          index !== 0 ? overlapSpacing : 0
        }px`,
        ...style,
      }}
      {...props}
    >
      {Icon && (
        <Icon className={`${active ? activeIconClassName : iconClassName}`} />
      )}
      {active && children}
    </Button>
  );
}

export default ButtonOption;
