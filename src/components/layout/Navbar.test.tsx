import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeContext, type ThemeContextType } from "@/contexts/ThemeContext";
import {
  LanguageContext,
  type LanguageContextType,
} from "@/contexts/LanguageContext";
import { SidebarProvider } from "@/shared/components/ui/sidebar";
import Navbar from "./Navbar";

vi.mock("../search/GlobalSearch", () => ({
  default: () => <div data-testid="search" />,
}));

vi.mock("../profile/ProfileButton", () => ({
  default: () => <div data-testid="profile" />,
}));

function renderNavbar({
  darkMode = false,
  language = "en",
}: {
  darkMode?: boolean;
  language?: "en" | "ar";
} = {}) {
  const themeValue: ThemeContextType = {
    darkMode,
    toggleDarkMode: vi.fn(),
  };

  const languageValue: LanguageContextType = {
    language,
    changeLanguage: vi.fn(),
  };

  return {
    toggleDarkMode: themeValue.toggleDarkMode,
    changeLanguage: languageValue.changeLanguage,
    ...render(
      <ThemeContext.Provider value={themeValue}>
        <LanguageContext.Provider value={languageValue}>
          <SidebarProvider>
            <Navbar />
          </SidebarProvider>
        </LanguageContext.Provider>
      </ThemeContext.Provider>,
    ),
  };
}

describe("Navbar", () => {
  it("renders search, sidebar trigger and profile button", () => {
    renderNavbar();

    expect(screen.getByTestId("search")).toBeInTheDocument();
    expect(screen.getByTestId("profile")).toBeInTheDocument();
  });

  it("toggles the language on the language button", () => {
    const { changeLanguage } = renderNavbar();

    fireEvent.click(screen.getByRole("button", { name: "Switch to Arabic" }));

    expect(changeLanguage).toHaveBeenCalledWith("ar");
  });

  it("offers english when the language is already arabic", () => {
    renderNavbar({ language: "ar" });

    expect(
      screen.getByRole("button", { name: "التبديل إلى الإنجليزية" }),
    ).toBeInTheDocument();
  });

  it("toggles dark mode", () => {
    const { toggleDarkMode, container } = renderNavbar();

    const themeButton = container
      .querySelector("svg.lucide-moon")
      ?.closest("button");

    expect(themeButton).not.toBeNull();

    fireEvent.click(themeButton!);

    expect(toggleDarkMode).toHaveBeenCalledTimes(1);
  });
});
