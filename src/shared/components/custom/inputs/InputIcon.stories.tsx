import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Search } from "lucide-react";
import InputIcon from "./InputIcon";

const meta = {
  title: "Custom/Inputs/InputIcon",
  component: InputIcon,
  parameters: { layout: "padded" },
  argTypes: {
    StartIcon: { control: false },
    EndIcon: { control: false },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    iconClassName: { control: "text" },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const WithStartIcon: Story = {
  args: {
    type: "email",
    placeholder: "you@example.com",
    StartIcon: <Mail />,
  },
};

export const WithEndIcon: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
    EndIcon: <Search />,
  },
};

export const WithError: Story = {
  args: {
    type: "email",
    placeholder: "you@example.com",
    StartIcon: <Mail />,
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    type: "text",
    placeholder: "Disabled",
    StartIcon: <Mail />,
    disabled: true,
  },
};
