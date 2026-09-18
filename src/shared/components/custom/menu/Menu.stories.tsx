import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil, Trash2 } from "lucide-react";
import Menu from "./Menu";

const meta = {
  title: "Custom/Menu",
  component: Menu,
  parameters: { layout: "padded" },
  args: {
    tooltipTitle: "Actions",
  },
  argTypes: {
    tooltipTitle: { control: "text" },
    iconButtonProps: { control: false },
    children: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: (args) => (
    <Menu {...args}>
      <button className="flex items-center gap-2 text-sm hover:text-(--primary)">
        <Pencil className="h-4 w-4" /> Edit
      </button>
      <button className="flex items-center gap-2 text-sm hover:text-(--danger)">
        <Trash2 className="h-4 w-4" /> Delete
      </button>
    </Menu>
  ),
};
