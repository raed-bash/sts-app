import { useState } from "react";
import type { Meta } from "@storybook/react-vite";
import { ComboboxEmpty, ComboboxItem } from "@/shared/components/ui/combobox";
import ComboboxField from "./ComboboxField";

type Item = { id: number; name: string };

const ComboboxExample = () => {
  const [value, setValue] = useState<Item | undefined>(undefined);

  return (
    <div className="w-72">
      <ComboboxField<Item>
        value={value}
        onValueChange={(nextValue) => setValue(nextValue as Item | undefined)}
        isItemEqualToValue={(item, selected) => item.id === selected?.id}
        itemToStringLabel={(item) => item.name}
        placeholder="Search departments..."
        empty={<ComboboxEmpty>No departments found</ComboboxEmpty>}
        showClear
        showTrigger
      >
        {(item) => (
          <ComboboxItem key={item.id} value={item}>
            {item.name}
          </ComboboxItem>
        )}
      </ComboboxField>
    </div>
  );
};

const meta = {
  title: "Custom/Combobox/ComboboxField",
  component: ComboboxField,
  parameters: { layout: "padded" },
  render: () => <ComboboxExample />,
} satisfies Meta;

export default meta;

export const Basic = {};
