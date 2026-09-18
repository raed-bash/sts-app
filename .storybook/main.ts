import type { StorybookConfig } from "@storybook/react-vite";
import type { Plugin as VitePlugin } from "vite";

const config: StorybookConfig = {
  stories: ["../src/shared/components/custom/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {},
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = (viteConfig.plugins as VitePlugin[]).filter(
      (plugin) => {
        if (plugin && typeof plugin === "object" && "name" in plugin) {
          return plugin.name !== "checker" && plugin.name !== "visualizer";
        }
        return true;
      },
    );

    return viteConfig;
  },
};

export default config;
