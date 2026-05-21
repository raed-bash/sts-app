import React, { useRef, useState } from "react";
import type { OptionType, UseRawSelectUtilsOptions } from "./useRawSelectUtils";
import useRawSelectUtils from "./useRawSelectUtils";
import { EventTarget } from "src/utils/EventTarget";
import useFocusout from "src/hooks/useFocusout";

export type UseRawAutocompleteUtilsOptions<TOption> =
  UseRawSelectUtilsOptions<TOption> & {
    options: TOption[];

    onInputChange?: (e: EventTarget) => void;

    /**
     * @default false
     */
    freeSolo?: boolean;

    /**
     * @default true
     */
    localFilter?: boolean;

    getOptionLabel: (option: TOption) => string;
  };

export default function useRawAutocompleteUtils<TOption extends OptionType>({
  disabled,
  name,
  getUniqueValue,
  onClick,
  getInputLabel,
  multiple,
  onChange,
  value,
  onInputChange = () => "",
  freeSolo,
  localFilter,
  options,
  getOptionLabel,
}: UseRawAutocompleteUtilsOptions<TOption>) {
  const {
    handleOptionsKeyDown,
    handleSelectKeyDown,
    handleSelectValue,
    inputLabel,
    tooltipRef,
    handleClick,
    openDrop,
    handleOpenDrop,
    isSelectedOption,
  } = useRawSelectUtils<TOption>({
    name,
    disabled,
    getUniqueValue,
    onClick,
    getInputLabel,
    onChange,
    value,
    multiple,
  } as any);

  const [valueSearch, setValueSearch] = useState("");
  const inputRef = useRef(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  const handleValueSearch = (value: string) => {
    setValueSearch(value);
    onInputChange(new EventTarget(name, value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = e.target.value;

    if (!openDrop) {
      handleOpenDrop();
    }

    if (!value) {
      if (multiple) {
        onChange(new EventTarget(name, new Map()));
      } else {
        onChange(new EventTarget(name));
      }
    }

    handleValueSearch(value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (handleSelectKeyDown(e)) {
      if (e.code.toLowerCase() !== "space") {
        if (optionsContainerRef.current) {
          (optionsContainerRef.current.firstChild as HTMLElement)?.focus();
        }
      }
    }
  };

  const handleOptionsContainerKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (handleOptionsKeyDown(e) === false) {
      if (inputRef.current) {
        (inputRef.current as HTMLElement).focus();
      }
    }
  };

  useFocusout(tooltipRef, () => {
    if (!freeSolo) {
      handleValueSearch("");
    }
  });

  const filteredOptions = localFilter
    ? options.filter((option) =>
        getOptionLabel(option).toLowerCase().includes(valueSearch.toLowerCase())
      )
    : options;

  return {
    handleSelectValue,
    inputLabel,
    handleInputChange,
    handleClick,
    isSelectedOption,
    filteredOptions,
    handleInputKeyDown,
    handleOptionsContainerKeyDown,
    openDrop,
    tooltipRef,
    handleSelectKeyDown,
    optionsContainerRef,
    inputRef,
    valueSearch,
  };
}
