import type { Meta, StoryObj } from "@storybook/react-vite";
import TextArea from "./TextArea";

const meta = {
  title: "Custom/Inputs/TextArea",
  component: TextArea,
  parameters: { layout: "padded" },
  argTypes: {
    placeholder: { control: "text" },
    rows: { control: { type: "number", min: 1, max: 20 } },
    disabled: { control: "boolean" },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  args: {
    placeholder: "Write your message here...",
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled textarea",
    rows: 4,
    disabled: true,
  },
};
