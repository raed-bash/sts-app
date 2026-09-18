import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import TableDensityButton from "./TableDensityButton";
import type { TableDensity } from "../constants/table-density";

const meta = {
  title: "Custom/Table/TableDensityButton",
  component: TableDensityButton,
  parameters: { layout: "centered" },
  argTypes: {
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "roomy"],
    },
    onDensityChange: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Interactive: Story = {
  render: () => {
    const [density, setDensity] = useState<TableDensity>("comfortable");

    return (
      <div className="p-8">
        <TableDensityButton density={density} onDensityChange={setDensity} />
      </div>
    );
  },
  args: { density: "comfortable" },
};

export const Compact: Story = {
  render: () => (
    <div className="p-8">
      <TableDensityButton density="compact" onDensityChange={() => undefined} />
    </div>
  ),
};

export const Roomy: Story = {
  render: () => (
    <div className="p-8">
      <TableDensityButton density="roomy" onDensityChange={() => undefined} />
    </div>
  ),
};
