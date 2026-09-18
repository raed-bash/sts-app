import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/shared/components/ui/button";
import Animation from "./Animation";

const meta = {
  title: "Custom/Animation",
  component: Animation,
  argTypes: {
    isOpen: { control: "boolean" },
    duration: { control: { type: "number", min: 0, max: 2000 } },
    openClassName: { control: "text" },
    notOpenClassName: { control: "text" },
    children: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);

    return (
      <div className="flex w-72 flex-col items-start gap-4">
        <Button variant="outline" onClick={() => setOpen((prev) => !prev)}>
          Toggle
        </Button>
        <Animation {...args} isOpen={open} className="w-full">
          <div className="rounded-lg bg-(--primary) p-4 text-(--primary-foreground)">
            Slide-in content
          </div>
        </Animation>
      </div>
    );
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    children: (
      <div className="rounded-lg bg-(--primary) p-4 text-(--primary-foreground)">
        Visible content
      </div>
    ),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    children: (
      <div className="rounded-lg bg-(--primary) p-4 text-(--primary-foreground)">
        Hidden content
      </div>
    ),
  },
};
