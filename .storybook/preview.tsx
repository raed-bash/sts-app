import { useEffect } from "react";
import type { Preview, Decorator } from "@storybook/react-vite";
import "../src/index.css";

const ThemeDecorator: Decorator = (Story, context) => {
  const theme = context.globals.theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");

    return () => root.classList.remove("dark");
  }, [theme]);

  return <Story />;
};

const preview: Preview = {
  decorators: [ThemeDecorator],
  globalTypes: {
    theme: {
      description: "Global theme",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
};

export default preview;
