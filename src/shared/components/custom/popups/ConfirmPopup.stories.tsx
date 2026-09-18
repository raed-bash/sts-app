import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/shared/components/ui/button";
import ConfirmPopup, { type ConfirmPopupProps } from "./ConfirmPopup";

const meta = {
  title: "Custom/Popup/ConfirmPopup",
  component: ConfirmPopup,
  parameters: { layout: "padded" },
  argTypes: {
    isOpen: { control: "boolean" },
    title: { control: "text" },
    message: { control: "text" },
    confirmLabel: { control: "text" },
    cancelLabel: { control: "text" },
    destructive: { control: "boolean" },
    loading: { control: "boolean" },
    onConfirm: { control: false },
    onCancel: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Interactive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-start gap-4">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Delete user
        </Button>
        <ConfirmPopup
          {...(args as ConfirmPopupProps)}
          isOpen={open}
          onCancel={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </div>
    );
  },
  args: {
    title: "Delete user",
    message: "This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
  },
};

export const Destructive: Story = {
  args: {
    isOpen: true,
    title: "Delete user",
    message: "This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    destructive: true,
  },
};

export const Loading: Story = {
  args: {
    isOpen: true,
    title: "Delete user",
    confirmLabel: "Deleting...",
    loading: true,
    onConfirm: () => {},
    onCancel: () => {},
  },
};
