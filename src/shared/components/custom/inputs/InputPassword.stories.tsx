import type { Meta, StoryObj } from "@storybook/react-vite";
import InputPassword from "./InputPassword";

const meta = {
  title: "Custom/Inputs/InputPassword",
  component: InputPassword,
  parameters: { layout: "padded" },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
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
    placeholder: "Enter your password",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Enter your password",
    disabled: true,
  },
};
