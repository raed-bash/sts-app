import type { Meta, StoryObj } from "@storybook/react-vite";
import Input from "./Input";

const meta = {
  title: "Custom/Inputs/Input",
  component: Input,
  parameters: { layout: "padded" },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "number", "password"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  args: {
    type: "text",
    placeholder: "Enter your name",
  },
};

export const Disabled: Story = {
  args: {
    type: "text",
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    type: "email",
    placeholder: "you@example.com",
    defaultValue: "invalid",
    "aria-invalid": true,
  },
};
