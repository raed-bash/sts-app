import { useState } from "react";
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
