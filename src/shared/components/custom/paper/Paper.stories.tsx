import type { Meta, StoryObj } from "@storybook/react-vite";
import Paper from "./Paper";

const meta = {
  title: "Custom/Paper",
  component: Paper,
  parameters: { layout: "padded" },
  argTypes: {
    className: { control: false },
    children: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: (args) => (
    <Paper {...args} className="w-80">
      <h2 className="text-lg font-semibold mb-2">Card</h2>
      <p className="text-sm text-(--text-muted)">
        A simple surface for grouping related content.
      </p>
    </Paper>
  ),
};
