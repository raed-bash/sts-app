import { useRef, useState } from "react";
import useFocusout from "src/hooks/useFocusout";
import { EventTarget } from "src/utils/EventTarget";
import type { OptionProps } from "../Option";

const OpenSelectStatus = ["enter", "space", "arrowdown", "arrowup"];

export type OptionType = string | number | Record<string | number, any>;

export type UniqueValue = string | number;

export type RawSelectMap<TOption> = Map<UniqueValue, TOption>;

export type MultiSelectProps<TOption> = {
  multiple: true;

  onChange: (e: EventTarget<RawSelectMap<TOption>>) => void;

  value?: RawSelectMap<TOption>;

  getInputLabel: (option: Map<UniqueValue, TOption>) => string | number;
};

export type SignleSelectProps<TOption> = {
  multiple: false;

  onChange: (e: EventTarget<TOption>) => void;

  getInputLabel: (option: TOption) => string | number;

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
};

export default function useRawSelectUtils<TOption extends OptionType>({
  onChange,
  getInputLabel,
  getUniqueValue = () => "",
  onClick = () => {},
  value,
  multiple,
  name,
  disabled,
}: UseRawSelectUtilsOptions<TOption>) {
  const inputLabel: string | number = value
    ? (() => {
        if (multiple) {
          return getInputLabel(value);
        } else {
          return getInputLabel(value);
        }
      })()
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
    if (multiple) {
      const valueMap = new Map(value as RawSelectMap<TOption>);

      const uniqueValue = getUniqueValue(option.value);

      const selectedValue = valueMap.get(uniqueValue);

      if (selectedValue) {
        valueMap.delete(uniqueValue);
      } else {
        valueMap.set(uniqueValue, option.value);
      }

      onChange(new EventTarget(name, valueMap));
    } else {
      onChange(new EventTarget(name, option.value as TOption));

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
      return true;
    }
    return false;
  };

  const handleOptionsKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const container = e.currentTarget;

    const option = (e.target as HTMLElement).closest(
      "[data-index]"
    ) as HTMLElement | null;

    if (!option) return false;

    const index = Number(option.dataset.index);

    switch (e.code.toLowerCase()) {
      case "arrowdown": {
        const nextEl = container.children[index + 1];

        const next =
          nextEl?.ariaDisabled !== "true"
            ? nextEl
            : (container.children[0] as HTMLElement);

        (next as HTMLElement).focus();

        break;
      }

      case "arrowup": {
        const prevEl = container.children[index - 1];

        const prev =
          prevEl ?? container.children[container.children.length - 2];

        (prev as HTMLElement).focus();
        break;
      }

      case "escape":
        tooltipRef.current?.focus();

        handleCloseDrop();
        break;

      default:
        return false;
    }
  };

  const isSelectedOption = (option: TOption) => {
    let isSelected: boolean = false;

    const optionUniqueValue = getUniqueValue(option);

    if (value) {
      if (multiple) {
        isSelected = value.has(optionUniqueValue);
      } else {
        isSelected = optionUniqueValue === getUniqueValue(value);
      }
    }

    return isSelected;
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
    handleOpenDrop,
    isSelectedOption,
  };
}
