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
    helperText: { control: "text" },
    disabled: { control: "boolean" },
    iconClassName: { control: "text" },
    containerProps: { control: false },
    inputFrameProps: { control: false },
    helperTextProps: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const WithStartIcon: Story = {
  args: {
    type: "email",
    placeholder: "you@example.com",
    StartIcon: Mail,
  },
};

export const WithEndIcon: Story = {
  args: {
    type: "search",
    placeholder: "Search...",
    EndIcon: Search,
  },
};

export const WithHelperText: Story = {
  args: {
    type: "text",
    placeholder: "Username",
    StartIcon: Mail,
    helperText: "Use only letters and numbers.",
  },
};

export const WithError: Story = {
  args: {
    type: "email",
    placeholder: "you@example.com",
    StartIcon: Mail,
    helperText: "Invalid email address.",
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    type: "text",
    placeholder: "Disabled",
    StartIcon: Mail,
    disabled: true,
  },
};
