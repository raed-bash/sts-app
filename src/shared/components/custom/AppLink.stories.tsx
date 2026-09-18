import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import AppLink from "./AppLink";

const meta = {
  title: "Custom/AppLink",
  component: AppLink,
  args: {
    to: "/some/path",
    children: "View details",
  },
  argTypes: {
    disabled: { control: "boolean" },
    to: { control: "text" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
