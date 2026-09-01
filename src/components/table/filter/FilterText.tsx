import type { FilterOperationOptions } from "./types";
import InputPlus from "src/components/inputs/InputPlus";
import type { BaseFilterInputProps } from "./FilterInput";
import type { textFilterOperations } from "./utils/filterConstants";

export type TextFilterOperation = (typeof textFilterOperations)[number];
export type TextFilterOperationOptions =
  FilterOperationOptions<TextFilterOperation>;

export type TFilterTextProps = TextFilterOperationOptions &
  BaseFilterInputProps & {
    type: "text";

    value?: string;

    onChange?: React.ChangeEventHandler<HTMLInputElement>;
  };

export default function FilterText(props: TFilterTextProps) {
  return (
    <InputPlus
      type="text"
      onChange={props.onChange}
      value={props.value}
      placeholder={`Filter ${props.name} column`}
    />
  );
}
