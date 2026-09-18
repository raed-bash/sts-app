import type { Meta, StoryObj } from "@storybook/react-vite";
import Loading from "./Loading";

const meta = {
  title: "Custom/Skeleton/Loading",
  component: Loading,
  argTypes: {
    className: { control: "text" },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {};

export const Large: Story = {
  args: {
    className: "w-12 h-12",
  },
};
