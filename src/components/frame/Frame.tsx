import { cn } from "src/utils/cn";

export type FrameProps = React.FieldsetHTMLAttributes<HTMLFieldSetElement> & {
  titleProps?: React.HTMLAttributes<HTMLLegendElement>;
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
        `border-2 border-solid border-primary-main flex pb-8 px-4 gap-x-2 `,
        className
      )}
      {...props}
    >
      <legend
        {...titleProps}
        className={cn(
          `text-primary-main text-xl font-semibold`,
          titleProps.className
        )}
      >
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export default Frame;
