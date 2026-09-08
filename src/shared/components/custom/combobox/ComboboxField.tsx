import {
  Combobox as ComboboxPrimitive,
  type ComboboxListProps,
} from "@base-ui/react/combobox";
import type { ReactNode } from "react";
import { cn } from "cn";
import { SyntheticEvent, type SyntheticEventHandler } from "@/shared/utils";
import {
  Combobox,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxList,
} from "../../ui/combobox";
import * as _ from "lodash";
import type { BaseUIEvent } from "@base-ui/react";

export type ComboboxFieldProps<
  Value,
  Multiple extends boolean | undefined = false,
> = Omit<ComboboxPrimitive.Root.Props<Value, Multiple>, "children"> & {
  className?: string;
  "aria-invalid"?: boolean;
  onChange?: SyntheticEventHandler<Value | Value[]>;
  placeholder?: string;
  children?: ComboboxListProps["children"];
  empty?: ReactNode;
  onScroll?:
    | ((event: BaseUIEvent<React.UIEvent<HTMLDivElement, UIEvent>>) => void)
    | undefined;
  contentRef?: React.Ref<HTMLDivElement> | undefined;
  listProps?: Omit<React.ComponentProps<typeof ComboboxList>, "children">;
};

export default function ComboboxField<
  Value,
  Multiple extends boolean | undefined = false,
>({
  "aria-invalid": ariaInvalid,
  className,
  placeholder,
  multiple,
  name = "",
  children,
  empty,
  onScroll,
  contentRef,
  listProps,
  ...props
}: ComboboxFieldProps<Value, Multiple>) {
  const renderEmpty = !_.isNil(empty) ? (
    _.overSome(_.isString, _.isNumber)(empty) ? (
      <ComboboxEmpty>{empty}</ComboboxEmpty>
    ) : (
      empty
    )
  ) : null;

  const isChildrenCallback = _.isFunction(children);

  const renderListChildren = isChildrenCallback ? (
    children
  ) : (
    <>
      {children}
      {renderEmpty}
    </>
  );

  return (
    <Combobox<Value, Multiple>
      {...props}
      multiple={multiple}
      name={name}
      onValueChange={(value, ...args) => {
        props.onValueChange?.(value, ...args);

        props?.onChange?.(
          new SyntheticEvent<Value | Value[]>(name, value as Value | Value[]),
        );
      }}
    >
      <ComboboxInput
        aria-invalid={ariaInvalid}
        placeholder={placeholder}
        className={cn(className)}
      />

      <ComboboxContent>
        {isChildrenCallback ? empty : null}
        <ComboboxList ref={contentRef} onScroll={onScroll} {...listProps}>
          {renderListChildren}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export function ComboboxFieldChipsInput(
  props: Parameters<typeof ComboboxChipsInput>[0],
) {
  // const ctx = useComboboxContext();

  return (
    <ComboboxChipsInput
      // aria-invalid={ctx["aria-invalid"]}
      {...props}
      // className={cn(ctx.className, props.className)}
    />
  );
}
