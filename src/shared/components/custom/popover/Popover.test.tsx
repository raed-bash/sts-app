import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

describe("Popover", () => {
  it("opens the content from the trigger", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger render={<Button>Open</Button>} />
        <PopoverContent>Hello popover</PopoverContent>
      </Popover>,
    );

    expect(screen.queryByText("Hello popover")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(await screen.findByText("Hello popover")).toBeInTheDocument();
  });

  it("renders the grip handle in the moveable variant", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger render={<Button>Open</Button>} />
        <PopoverContent>Hello popover</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    await screen.findByText("Hello popover");

    expect(document.querySelector('[data-slot="grip-button"]')).toBeTruthy();
  });

  it("renders without a grip in the static variant", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger render={<Button>Open</Button>} />
        <PopoverContent moveable={false}>Static popover</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    await screen.findByText("Static popover");

    expect(document.querySelector('[data-slot="grip-button"]')).toBeNull();
  });

  it("closes when dismissed with Escape", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger render={<Button>Open</Button>} />
        <PopoverContent>Hello popover</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByText("Hello popover");

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByText("Hello popover")).toBeNull());
  });
});
