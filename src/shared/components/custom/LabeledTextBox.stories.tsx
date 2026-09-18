import type { Meta, StoryObj } from "@storybook/react-vite";
import LabeledTextBox from "./LabeledTextBox";

const meta = {
  title: "Custom/LabeledTextBox",
  component: LabeledTextBox,
  parameters: { layout: "padded" },
  argTypes: {
    label: { control: "text" },
    labelProps: { control: false },
    valueProps: { control: false },
    children: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  args: {
    label: "Status",
    children: "Active",
  },
};
