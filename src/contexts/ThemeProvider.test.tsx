import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useThemeContext } from "./ThemeContext";
import ThemeProvider from "./ThemeProvider";

function Consumer() {
  const { darkMode, toggleDarkMode } = useThemeContext();

  return (
    <button onClick={toggleDarkMode} data-testid="theme">
      {String(darkMode)}
    </button>
  );
}

function renderProvider() {
  return render(
    <ThemeProvider>
      <Consumer />
    </ThemeProvider>,
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("starts in light mode and marks the document", () => {
    renderProvider();

    expect(screen.getByTestId("theme")).toHaveTextContent("false");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("darkMode")).toBe("0");
  });

  it("toggles dark mode and updates the document class", () => {
    renderProvider();

    fireEvent.click(screen.getByTestId("theme"));

    expect(screen.getByTestId("theme")).toHaveTextContent("true");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("darkMode")).toBe("1");

    fireEvent.click(screen.getByTestId("theme"));

    expect(screen.getByTestId("theme")).toHaveTextContent("false");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("darkMode")).toBe("0");
  });

  it("resumes a stored dark mode setting", () => {
    localStorage.darkMode = "1";

    renderProvider();

    expect(screen.getByTestId("theme")).toHaveTextContent("true");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
