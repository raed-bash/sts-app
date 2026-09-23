import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useLanguageContext } from "./LanguageContext";
import LanguageProvider from "./LanguageProvider";

function Consumer() {
  const { language, changeLanguage } = useLanguageContext();

  return (
    <button onClick={() => changeLanguage("ar")} data-testid="lang">
      {language}
    </button>
  );
}

function renderProvider() {
  return render(
    <LanguageProvider>
      <Consumer />
    </LanguageProvider>,
  );
}

describe("LanguageProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "";
    document.documentElement.dir = "";
  });

  it("defaults to english and left-to-right", () => {
    renderProvider();

    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(document.documentElement.lang).toBe("en");
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("switches to arabic and rtl on change", () => {
    renderProvider();

    fireEvent.click(screen.getByTestId("lang"));

    expect(screen.getByTestId("lang")).toHaveTextContent("ar");
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(localStorage.getItem("language")).toBe("ar");
  });

  it("resumes a stored arabic language", () => {
    localStorage.setItem("language", "ar");

    renderProvider();

    expect(screen.getByTestId("lang")).toHaveTextContent("ar");
  });
});
