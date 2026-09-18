import type { Meta, StoryObj } from "@storybook/react-vite";
import Skeleton from "./Skeleton";

const meta = {
  title: "Custom/Skeleton/Skeleton",
  component: Skeleton,
  parameters: { layout: "padded" },
  argTypes: {
    className: { control: "text" },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  args: {
    className: "w-48 h-10",
  },
};

export const Circular: Story = {
  args: {
    className: "w-12 h-12 rounded-full",
  },
};

export const Text: Story = {
  render: (args) => (
    <div className="flex w-56 flex-col gap-2">
      <Skeleton {...args} className="h-3 w-full" />
      <Skeleton {...args} className="h-3 w-4/5" />
      <Skeleton {...args} className="h-3 w-3/5" />
    </div>
  ),
};
