import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/shared/components/ui/button";
import Popup from "./Popup";

const meta = {
  title: "Custom/Popup",
  component: Popup,
  parameters: { layout: "padded" },
  argTypes: {
    isOpen: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    onClose: { control: false },
    className: { control: false },
    children: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Interactive: Story = {
  render: (args) => (
    <Popup {...args}>
      {({ handleOpen, handleClose, inPopup }) =>
        inPopup ? (
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              This content is rendered inside the dialog.
            </p>
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={handleOpen}>Open popup</Button>
        )
      }
    </Popup>
  ),
  args: {
    title: "Edit user",
    description: "Make changes to the user profile below.",
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-start gap-4">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open popup
        </Button>
        <Popup {...args} isOpen={open} onClose={() => setOpen(false)}>
          <p className="text-muted-foreground">
            Static children shown in the dialog.
          </p>
        </Popup>
      </div>
    );
  },
  args: {
    title: "Confirm",
  },
};
