import type { Meta, StoryObj } from "@storybook/react-vite";
import Frame from "./Frame";

const meta = {
  title: "Custom/Frame",
  component: Frame,
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    titleProps: { control: false },
    children: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  args: {
    title: "Personal Information",
    children: (
      <p className="max-w-md text-sm text-(--text-muted)">
        Wrap a group of inputs or content in a titled fieldset.
      </p>
    ),
  },
};
