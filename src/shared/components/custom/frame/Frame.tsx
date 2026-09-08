import { cn } from "cn";
import type React from "react";

export type FrameProps = React.ComponentProps<"fieldset"> & {
  titleProps?: React.ComponentProps<"legend">;
};

function Frame({
  children,
  className,
  title,
  titleProps = {},
  ...props
}: FrameProps) {
  return (
    <fieldset
      className={cn(
        `border-2 border-solid border-primary-main flex p-8 px-4 gap-x-2 rounded-(--radius)`,
        className,
      )}
      {...props}
    >
      <legend
        {...titleProps}
        className={cn(
          `text-primary-main text-xl font-semibold`,
          titleProps.className,
        )}
      >
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export default Frame;
