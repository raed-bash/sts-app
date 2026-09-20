import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";
import LabeledField from "./LabeledField";

const meta = {
  title: "Custom/Inputs/LabeledField",
  component: LabeledField,
  parameters: { layout: "padded" },
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "password",
        "textarea",
        "checkbox",
        "select",
        "combobox",
      ],
    },
    title: { control: "text" },
    oneline: { control: "boolean" },
    loading: { control: "boolean" },
    error: { control: "boolean" },
    helperText: { control: "text" },
    disabled: { control: "boolean" },
    titleIcon: { control: false },
    fieldProps: { control: false },
    skeletonProps: { control: false },
    titleProps: { control: false },
    helperTextProps: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Text: Story = {
  args: {
    type: "text",
    title: "Full name",
    placeholder: "John Doe",
  },
};

export const WithHelperText: Story = {
  args: {
    type: "text",
    title: "Username",
    placeholder: "johndoe",
    helperText: "This will be your public username.",
    error: false,
  },
};

export const WithError: Story = {
  args: {
    type: "password",
    title: "Password",
    placeholder: "••••••••",
    helperText: "Password must be at least 8 characters.",
    error: true,
  },
};

export const Oneline: Story = {
  args: {
    type: "text",
    title: "Email",
    placeholder: "you@example.com",
    oneline: true,
    className: "max-w-64",
  },
};

export const Loading: Story = {
  args: {
    type: "text",
    title: "Full name",
    loading: true,
  },
};

export const WithIconTitle: Story = {
  args: {
    type: "text",
    title: "Search",
    titleIcon: <Search className="h-4 w-4" />,
    placeholder: "Search...",
  },
};

export const OnelineCheckbox: Story = {
  args: {
    type: "checkbox",
    title: "View name publicly",
    oneline: true,
    checked: true,
    fieldProps: { className: "max-w-80" },
  },
};
