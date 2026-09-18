import type { Meta, StoryObj } from "@storybook/react-vite";
import Checkbox from "./Checkbox";

const meta = {
  title: "Custom/Inputs/Checkbox",
  component: Checkbox,
  argTypes: {
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    secondaryStatus: { control: "boolean" },
    onChange: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Unchecked: Story = {
  args: {
    "aria-label": "Accept terms",
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    "aria-label": "Accept terms",
  },
};

export const Indeterminate: Story = {
  args: {
    secondaryStatus: true,
    "aria-label": "Select all",
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
    "aria-label": "Accept terms",
  },
};
