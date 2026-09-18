import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import DropDownButton, {
  type DropDownButtonOption,
  type DropDownButtonProps,
} from "./DropDownButton";

const options: DropDownButtonOption[] = [
  { name: "admin", value: "admin", label: "Admin" },
  { name: "editor", value: "editor", label: "Editor" },
  { name: "viewer", value: "viewer", label: "Viewer" },
];

const meta = {
  title: "Custom/Buttons/DropDownButton",
  component: DropDownButton,
  parameters: { layout: "padded" },
  argTypes: {
    name: { control: "text" },
    placeholder: { control: "text" },
    value: { control: false },
    options: { control: false },
    onChange: { control: false },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState("editor");

    return (
      <DropDownButton
        {...(args as DropDownButtonProps)}
        value={value}
        onChange={(e) => setValue(e.target.name)}
      />
    );
  },
  args: {
    name: "role",
    options,
    placeholder: "Select a role",
  },
};

export const WithSelectedOption: Story = {
  args: {
    name: "role",
    options,
    value: "admin",
  },
};
