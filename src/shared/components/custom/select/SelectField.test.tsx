import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectGroup, SelectItem } from "@/shared/components/ui/select";
import SelectField from "./SelectField";

describe("SelectField", () => {
  it("shows the placeholder when nothing is selected", () => {
    render(<SelectField name="city" placeholder="Select a city" />);

    expect(screen.getByText("Select a city")).toBeInTheDocument();
  });

  it("renders the label for the current value", () => {
    render(
      <SelectField
        name="city"
        value="paris"
        getInputLabel={(value) => (value ? "Paris" : "")}
      />,
    );

    expect(screen.getByText("Paris")).toBeInTheDocument();
  });

  it("selects an item from the listbox", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onChange = vi.fn();

    render(
      <SelectField
        name="city"
        onChange={onChange}
        onValueChange={onValueChange}
        getInputLabel={(value) => (value ? String(value) : "")}
      >
        <SelectGroup>
          <SelectItem value="paris">Paris</SelectItem>
          <SelectItem value="rome">Rome</SelectItem>
        </SelectGroup>
      </SelectField>,
    );

    await user.click(screen.getByRole("combobox"));

    await user.click(await screen.findByRole("option", { name: "Rome" }));

    expect(onValueChange).toHaveBeenCalledWith("rome", expect.anything());
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ name: "city", value: "rome" }),
      }),
    );
  });

  it("forwards the invalid state to the trigger", () => {
    render(<SelectField name="city" aria-invalid />);

    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
