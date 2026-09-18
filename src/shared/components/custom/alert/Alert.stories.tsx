import type { Meta, StoryObj } from "@storybook/react-vite";
import Alert from "./Alert";

const meta = {
  title: "Custom/Alert",
  component: Alert,
  parameters: { layout: "padded" },
  argTypes: {
    color: {
      control: "select",
      options: ["danger", "warning", "info", "success"],
    },
    children: { control: "text" },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Info: Story = {
  args: {
    color: "info",
    children: "This is an informational message.",
  },
};

export const Success: Story = {
  args: {
    color: "success",
    children: "Saved successfully!",
  },
};

export const Warning: Story = {
  args: {
    color: "warning",
    children: "Please review the highlighted fields.",
  },
};

export const Danger: Story = {
  args: {
    color: "danger",
    children: "Something went wrong while saving.",
  },
};
