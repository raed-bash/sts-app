import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PageFallback from "./PageFallback";

const never = new Promise<never>(() => {});

function Suspended(): React.ReactNode {
  throw never;
}

describe("PageFallback", () => {
  it("renders the loading indicator while the tree suspends", () => {
    render(
      <PageFallback>
        <Suspended />
      </PageFallback>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
  });

  it("uses the given height for the fallback wrapper", () => {
    render(
      <PageFallback height="50vh">
        <Suspended />
      </PageFallback>,
    );

    const wrapper = screen.getByRole("status").parentElement as HTMLDivElement;

    expect(wrapper.style.height).toBe("50vh");
  });

  it("renders the children once they resolve", async () => {
    render(
      <PageFallback>
        <div>resolved content</div>
      </PageFallback>,
    );

    expect(screen.getByText("resolved content")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
