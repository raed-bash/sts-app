import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil } from "lucide-react";
import IconButton from "./IconButton";

const meta = {
  title: "Custom/Buttons/IconButton",
  component: IconButton,
  argTypes: {
    as: {
      control: false,
      description: "HTML element to render as (defaults to `button`)",
    },
    children: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  args: {
    children: <Pencil className="h-5 w-5" />,
    "aria-label": "Edit",
  },
};

export const Disabled: Story = {
  args: {
    children: <Pencil className="h-5 w-5" />,
    disabled: true,
    "aria-label": "Edit",
  },
};

export const AsAnchor: Story = {
  args: {
    as: "a",
    href: "#",
    children: <Pencil className="h-5 w-5" />,
    "aria-label": "Edit",
  },
};
