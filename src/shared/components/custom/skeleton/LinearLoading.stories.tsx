import type { Meta, StoryObj } from "@storybook/react-vite";
import LinearLoading from "./LinearLoading";

const meta = {
  title: "Custom/Skeleton/LinearLoading",
  component: LinearLoading,
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {};

export const FullWidth: Story = {
  render: (args) => (
    <div className="w-96">
      <LinearLoading {...args} />
    </div>
  ),
};
