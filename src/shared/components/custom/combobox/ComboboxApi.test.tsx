import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComboboxItem } from "@/shared/components/ui/combobox";
import type { QueryFn } from "@/shared/hooks/useSelectApi";
import ComboboxApi from "./ComboboxApi";

type Item = { id: number; name: string };

function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function renderCombobox(
  overrides: Partial<React.ComponentProps<typeof ComboboxApi<Item>>> = {},
  seed: { items?: Item[]; total?: number } = {},
) {
  const items: Item[] = seed.items ?? [
    { id: 1, name: "One" },
    { id: 2, name: "Two" },
  ];

  const total = seed.total ?? items.length;

  const queryFn = vi.fn<QueryFn<Item>>(async (query) => ({
    data: items,
    meta: {
      total,
      currentPage: query.page,
      lastPage: Math.max(1, total),
      perPage: 10,
    },
  }));

  const onChange = vi.fn();

  const utils = render(
    <QueryClientProvider client={makeClient()}>
      <ComboboxApi<Item>
        name="itemId"
        placeholder="Pick an item"
        value={undefined}
        itemToStringLabel={(item) => item?.name ?? ""}
        queryProps={{ queryFn, queryKey: ["items"] }}
        searchKey="name"
        onChange={onChange}
        {...overrides}
      >
        {(data) =>
          data?.pages
            .flatMap((page) => page.data)
            .map((item) => (
              <ComboboxItem key={item.id} value={item}>
                {item.name}
              </ComboboxItem>
            ))
        }
      </ComboboxApi>
    </QueryClientProvider>,
  );

  return { ...utils, onChange, queryFn };
}

describe("ComboboxApi", () => {
  it("renders the placeholder input", () => {
    renderCombobox();

    expect(screen.getByPlaceholderText("Pick an item")).toBeInTheDocument();
  });

  it("loads the options and reports the selection", async () => {
    const user = userEvent.setup();

    const { onChange } = renderCombobox();

    await user.click(screen.getByPlaceholderText("Pick an item"));

    const two = await screen.findByRole("option", { name: "Two" });

    expect(screen.getByRole("option", { name: "One" })).toBeInTheDocument();

    await user.click(two);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name: "itemId",
          value: expect.objectContaining({ id: 2, name: "Two" }),
        }),
      }),
    );
  });

  it("shows the no-items message when the query is empty", async () => {
    const user = userEvent.setup();

    renderCombobox({}, { items: [], total: 0 });

    await user.click(screen.getByPlaceholderText("Pick an item"));

    expect(await screen.findByText("No items found")).toBeInTheDocument();
  });

  it("filters the results through the search key", async () => {
    const user = userEvent.setup();

    const { queryFn } = renderCombobox();

    await user.click(screen.getByPlaceholderText("Pick an item"));
    await screen.findByRole("option", { name: "Two" });

    await user.type(screen.getByPlaceholderText("Pick an item"), "Tw");

    await waitFor(
      () =>
        expect(queryFn.mock.calls.at(-1)?.[0]).toEqual(
          expect.objectContaining({ name: "Tw" }),
        ),
      { timeout: 3000 },
    );
  });
});
