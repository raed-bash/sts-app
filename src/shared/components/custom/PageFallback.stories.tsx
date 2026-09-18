import type { Meta, StoryObj } from "@storybook/react-vite";
import PageFallback from "./PageFallback";

const meta = {
  title: "Custom/PageFallback",
  component: PageFallback,
  parameters: { layout: "padded" },
  argTypes: {
    height: { control: "text" },
    children: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  args: {
    height: "300px",
    children: <div className="p-4">Page content</div>,
  },
};
