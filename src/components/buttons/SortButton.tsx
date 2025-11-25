import TriangleDownIcon from "src/assets/icons/triangle-down.svg?react";
import { cn } from "src/utils/cn";

export type SortButtonStatus = "ASC" | "DESC" | null;

export type SortButtonEventHandler = (
  sortStatus: SortButtonStatus,
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => void;

export type SortButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> & {
  sortStatus: SortButtonStatus;
  onClick?: SortButtonEventHandler;
};

function SortButton({
  sortStatus,
  className,
  onClick,
  ...props
}: SortButtonProps) {
  const handleSortStatusStyle =
    /**
     * @param {sortStatus} sortStatus
     */
    (sortStatus: SortButtonProps["sortStatus"]) => {
      switch (sortStatus) {
        case "DESC":
          return "rotate-0";
        case "ASC":
          return "rotate-180";
        default:
          return "rotate-90";
      }
    };

  const handleSortStatus = () => {
    switch (sortStatus) {
      case "ASC":
        return "DESC";
      case "DESC":
        return null;
      default:
        return "ASC";
    }
  };

  const handleSortClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (onClick) {
      onClick(handleSortStatus(), e);
    }
  };

  return (
    <button
      onClick={handleSortClick}
      className={cn(`mt-1`, className)}
      {...props}
    >
      <TriangleDownIcon
        className={cn(
          `w-4 h-4 duration-150`,
          handleSortStatusStyle(sortStatus)
        )}
      />
    </button>
  );
}

export default SortButton;
