import type { Meta, StoryObj } from "@storybook/react-vite";
import Accordion from "./Accordion";

const meta = {
  title: "Custom/Accordion",
  component: Accordion,
  parameters: { layout: "padded" },
  argTypes: {
    title: { control: "text" },
    name: { control: "text" },
    defaultExpaned: { control: "boolean" },
    expand: { control: "boolean" },
    onChange: { control: false },
    children: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  args: {
    title: "How do I get started?",
    children: (
      <div className="max-w-lg text-(--text-muted)">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </div>
    ),
  },
};

export const ExpandedByDefault: Story = {
  args: {
    ...Basic.args,
    defaultExpaned: true,
  },
};

export const ControlledExpanded: Story = {
  args: {
    ...Basic.args,
    expand: true,
  },
};
