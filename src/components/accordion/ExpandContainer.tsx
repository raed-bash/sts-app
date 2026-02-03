import Animation from "../Animation";

export type ExpandContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  expand: boolean;
  expanedClassName?: string;
  notExpanedClassName?: string;
};

function ExpandContainer({
  children,
  expand = false,
  expanedClassName = "",
  notExpanedClassName = "",
  ...props
}: ExpandContainerProps) {
  return (
    <Animation
      openClassName={`max-h-[10000px] ${expanedClassName}`}
      notOpenClassName={`max-h-0 ${notExpanedClassName}`}
      isOpen={expand}
      {...props}
    >
      {children}
    </Animation>
  );
}

export default ExpandContainer;
