import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";
import InputPlus from "./InputPlus";

const meta = {
  title: "Custom/Inputs/InputPlus",
  component: InputPlus,
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
    inputPlusContainerProps: { control: false },
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
