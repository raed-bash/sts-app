import { useState } from "react";
import type { Meta } from "@storybook/react-vite";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/shared/components/ui/select";
import SelectField from "./SelectField";

type Item = { id: number; name: string };

const items: Item[] = [
  { id: 1, name: "Asia/Riyadh" },
  { id: 2, name: "Europe/London" },
  { id: 3, name: "America/New_York" },
  { id: 4, name: "Asia/Dubai" },
  { id: 5, name: "Australia/Sydney" },
];

const Selective = () => {
  const [value, setValue] = useState<Item>(items[0]);

  return (
    <div className="w-72">
      <SelectField<Item>
        value={value}
        onValueChange={(nextValue) => nextValue && setValue(nextValue)}
        getInputLabel={(item) => item?.name || "Select a timezone"}
        isItemEqualToValue={(item, current) => item.id === current?.id}
        placeholder="Select a timezone"
        name="timezone"
      >
        <SelectGroup>
          <SelectLabel>Timezones</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.id} value={item}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectField>
    </div>
  );
};

const meta = {
  title: "Custom/Select/SelectField",
  component: SelectField,
  parameters: { layout: "padded" },
  render: () => <Selective />,
} satisfies Meta;

export default meta;

export const Basic = {};
