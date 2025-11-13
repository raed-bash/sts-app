import { ReactComponent as TriangleDownIcon } from "src/assets/icons/triangle-down.svg";
import { cn } from "src/utils/cn";

export type SortButtonStatus = "ASC" | "DESC" | null;

export type SortButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  sortStatus: SortButtonStatus;
  onClick: (
    sortStatus: SortButtonStatus | undefined,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
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
        return;
      default:
        return "ASC";
    }
  };

  const handleSortClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    onClick(handleSortStatus(), e);
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
