import type { TFilterTextProps } from "./FilterText";
import FilterText from "./FilterText";

export type BaseFilterInputProps = {
  name: string;
};

export type FilterInputProps = TFilterTextProps &
  // | FilterNumberProps
  // | FilterSelectProps
  // | FilterSelectApiProps
  // | FilterSelectApiProps
  // | FilterDateProps
  BaseFilterInputProps;

export default function FilterInput(props: FilterInputProps) {
  switch (props.type) {
    case "text":
      return <FilterText {...props} />;
    default:
      return <div>Filter type not supported</div>;
  }
}
