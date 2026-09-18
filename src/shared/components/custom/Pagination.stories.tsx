import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Pagination, { type PaginationProps } from "./Pagination";

const meta = {
  title: "Custom/Pagination",
  component: Pagination,
  parameters: { layout: "padded" },
  argTypes: {
    currentPage: { control: { type: "number", min: 1 } },
    count: { control: { type: "number", min: 0 } },
    perPage: { control: { type: "number", min: 1 } },
    maxVisibleNeighbors: { control: { type: "number", min: 0, max: 5 } },
    disabled: { control: "boolean" },
    onChange: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Interactive: Story = {
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(3);

    return (
      <Pagination
        {...(args as PaginationProps)}
        currentPage={currentPage}
        onChange={setCurrentPage}
      />
    );
  },
  args: {
    count: 120,
    perPage: 10,
    maxVisibleNeighbors: 2,
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    count: 120,
    perPage: 10,
  },
};

export const LongRange: Story = {
  args: {
    currentPage: 7,
    count: 1000,
    perPage: 20,
    maxVisibleNeighbors: 1,
  },
};

export const Disabled: Story = {
  args: {
    currentPage: 3,
    count: 120,
    perPage: 10,
    disabled: true,
  },
};
