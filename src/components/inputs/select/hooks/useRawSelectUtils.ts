import { useRef, useState, type ReactNode } from "react";
import useFocusout from "src/hooks/useFocusout";
import { EventTarget } from "src/utils/EventTarget";
import type { OptionProps } from "../Option";

const OpenSelectStatus = ["enter", "space", "arrowdown", "arrowup"];

export type UniqueValue = string | number;

export type RawSelectMap<TOption> = Map<UniqueValue, TOption>;

export type MultiSelectProps<TOption> = {
  multiple?: true;

  onChange?: (e: EventTarget<RawSelectMap<TOption>>) => void;

  value?: RawSelectMap<TOption>;
};

export type SignleSelectProps<TOption> = {
  multiple?: false;

  onChange?: (e: EventTarget<TOption>) => void;

  value?: TOption;
};

export type UseRawSelectUtilsOptions<TOption> = (
  | MultiSelectProps<TOption>
  | SignleSelectProps<TOption>
) & {
  name?: string;

  disabled?: boolean;

  getUniqueValue?: (option: TOption) => UniqueValue;

  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * for multiple
   */
  getInputLabels?: (option: Map<UniqueValue, TOption>) => string | number;
  /**
   * for single select
   */
  getInputLabel?: (option: TOption) => string | number;
};

export default function useRawSelectUtils<
  TOption extends string | number | Record<string | number, any>
>({
  onChange = () => {},
  getInputLabel = () => "",
  getInputLabels = () => "",
  getUniqueValue = () => "",
  onClick = () => {},
  value: externalValue,
  multiple,
  name,
  disabled,
}: UseRawSelectUtilsOptions<TOption>) {
  const inputLabel: ReactNode = externalValue
    ? multiple
      ? getInputLabels(externalValue as Map<UniqueValue, TOption>)
      : getInputLabel(externalValue as TOption)
    : "";

  const [openDrop, setOpenDrop] = useState<boolean>(false);

  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleOpenDrop = () => {
    setOpenDrop(true);
  };

  const handleCloseDrop = () => {
    setOpenDrop(false);
  };

  const handleClick = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) return;

    if (!openDrop) {
      handleOpenDrop();
    }

    onClick(e);
  };

  const handleSelectValue = (option: OptionProps) => {
    const value = option.value;

    if (multiple) {
      const externalValueMap = new Map(externalValue as RawSelectMap<TOption>);

      const uniqueValue = getUniqueValue(value);

      const selectedValue = externalValueMap.get(uniqueValue);

      if (selectedValue) {
        externalValueMap.delete(uniqueValue);
      } else {
        externalValueMap.set(uniqueValue, value);
      }

      onChange(new EventTarget(name, multiple ? externalValueMap : value));
    } else {
      onChange(new EventTarget(name, value));

      handleCloseDrop();

      if (tooltipRef.current) {
        tooltipRef.current.focus();
      }
    }
  };

  const handleSelectKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const code = e.code.toLowerCase();

    if (OpenSelectStatus.includes(code)) {
      e.preventDefault();
      handleClick();
    }
  };

  const handleOptionsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const container = e.currentTarget;

    const option = (e.target as HTMLElement).closest(
      "[data-index]"
    ) as HTMLElement | null;

    if (!option) return;

    const index = Number(option.dataset.index);

    switch (e.code.toLowerCase()) {
      case "arrowdown": {
        const next =
          container.children[index + 1] ??
          (container.children[0] as HTMLElement);

        (next as HTMLElement).focus();
        break;
      }

      case "arrowup": {
        const prev =
          container.children[index - 1] ??
          container.children[container.children.length - 1];

        (prev as HTMLElement).focus();
        break;
      }

      case "escape":
        tooltipRef.current?.focus();

        handleCloseDrop();
        break;

      default:
    }
  };

  useFocusout(tooltipRef, handleCloseDrop);

  return {
    handleSelectValue,
    handleOptionsKeyDown,
    handleSelectKeyDown,
    handleClick,
    inputLabel,
    tooltipRef,
    openDrop,
  };
}
