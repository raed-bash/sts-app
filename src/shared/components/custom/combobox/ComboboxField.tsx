import {
  Combobox as ComboboxPrimitive,
  type ComboboxListProps,
} from "@base-ui/react/combobox";
import * as React from "react";
import { cn } from "cn";
import { SyntheticEvent, type SyntheticEventHandler } from "@/shared/utils";
import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxList,
  ComboboxValue,
} from "../../ui/combobox";
import * as _ from "lodash";
import type { BaseUIEvent } from "@base-ui/react";
import { useComboboxAnchor } from "./useComboboxAnchor";

export type ComboboxFieldProps<
  Value,
  Multiple extends boolean | undefined = false,
> = Omit<ComboboxPrimitive.Root.Props<Value, Multiple>, "children"> & {
  className?: string;
  "aria-invalid"?: boolean;
  onChange?: SyntheticEventHandler<Value | Value[]>;
  placeholder?: string;
  children?: ComboboxListProps["children"];
  empty?: React.ReactNode;
  onScroll?:
    | ((event: BaseUIEvent<React.UIEvent<HTMLDivElement, UIEvent>>) => void)
    | undefined;
  contentRef?: React.Ref<HTMLDivElement> | undefined;
  listProps?: Omit<React.ComponentProps<typeof ComboboxList>, "children">;
  getInputLabel?: ComboboxFieldChipsProps<Value, Multiple>["getInputLabel"];
};

/**
 * @example
 * ```tsx
 *
 *  <InputPlus<ItemDto>
 *    type="combobox"
 *    isItemEqualToValue={(item, value) => item.id === value.id}
 *    itemToStringLabel={(item) => item.name}
 *    empty={<ComboboxEmpty>No items</ComboboxEmpty>}
 *    placeholder="Combobox Field"
 *    title="Combobox Field"
 *    onChange={handleChange}
 *    value={item}
 *    items={items}
 *    >
 *      {(item) => (
 *        <ComboboxItem key={item.id} value={item}>
 *          {item.name}
 *        </ComboboxItem>
 *      )}
 *    </InputPlus>
 *
 * // multiple selection
 *  <InputPlus
 *    type="combobox"
 *    title="Multiple Combobox Field"
 *    placeholder="Multiple Combobox Field"
 *    multiple
 *    value={items}
 *    onChange={handleUsersChange}
 *    items={items}
 *    autoHighlight
 *    getInputLabel={(items) =>
 *      items.map((item) => (
 *        <ComboboxChip key={item.id}>{item.name}</ComboboxChip>
 *      ))
 *    }
 *>
 *    {(item) => (
 *      <ComboboxItem key={item.id} value={item}>
 *        {item.name}
 *      </ComboboxItem>
 *    )}
 *  </InputPlus>
 *
 * ```
 */
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
  getInputLabel,
  ...props
}: ComboboxFieldProps<Value, Multiple>) {
  const anchor = useComboboxAnchor();

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
      {multiple ? (
        <ComboboxFieldChips<Value, Multiple>
          getInputLabel={getInputLabel}
          aria-invalid={ariaInvalid}
          className={className}
          ref={anchor}
          placeholder={placeholder}
        />
      ) : (
        <ComboboxInput
          aria-invalid={ariaInvalid}
          placeholder={placeholder}
          className={cn(className)}
        />
      )}

      <ComboboxContent anchor={anchor}>
        {isChildrenCallback ? empty : null}
        <ComboboxList ref={contentRef} onScroll={onScroll} {...listProps}>
          {renderListChildren}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

type ValueType<Value, Multiple> = Multiple extends true
  ? Value[]
  : Value | undefined;

export type ComboboxFieldChipsProps<
  Value,
  Multiple extends boolean | undefined = false,
> = Parameters<typeof ComboboxChips>[0] & {
  getInputLabel:
    | React.ReactNode
    | ((selectedValue: ValueType<Value, Multiple>) => React.ReactNode);

  placeholder?: string;
};

export function ComboboxFieldChips<
  Value,
  Multiple extends boolean | undefined = false,
>({
  getInputLabel,
  "aria-invalid": ariaInvalid,
  placeholder,
  ...props
}: ComboboxFieldChipsProps<Value, Multiple>) {
  return (
    <ComboboxChips {...props}>
      <ComboboxValue>
        {(values: ValueType<Value, Multiple>) => (
          <>
            {_.isFunction(getInputLabel)
              ? getInputLabel(values)
              : getInputLabel}
            <ComboboxChipsInput
              aria-invalid={ariaInvalid}
              placeholder={placeholder}
            />
          </>
        )}
      </ComboboxValue>
    </ComboboxChips>
  );
}
