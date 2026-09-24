import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import SortButton from "./SortButton";

const meta = {
  title: "Custom/Buttons/SortButton",
  component: SortButton,
  argTypes: {
    sortStatus: {
      control: "select",
      options: [null, "asc", "desc"],
    },
    onClick: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Interactive: Story = {
  render: (args) => {
    const [status, setStatus] = useState<"asc" | "desc" | null>("asc");

    return (
      <SortButton
        {...args}
        sortStatus={status}
        onClick={(nextStatus) => setStatus(nextStatus)}
      >
        Name
      </SortButton>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /Name/i });

    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);

    await expect(button).toBeVisible();
  },
};

export const Mobile: Story = {
  args: {
    sortStatus: "asc",
    children: "Name",
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};

export const Asc: Story = {
  args: {
    sortStatus: "asc",
    children: "Name",
  },
};

export const Desc: Story = {
  args: {
    sortStatus: "desc",
    children: "Name",
  },
};

export const Unsorted: Story = {
  args: {
    sortStatus: null,
    children: "Name",
  },
};
