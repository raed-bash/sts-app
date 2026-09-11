import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import tailwindcss from "@tailwindcss/vite";
import svgrPlugin from "vite-plugin-svgr";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    checker({
      typescript: true,
      eslint: { useFlatConfig: true, lintCommand: "eslint ." },
    }),
    tailwindcss(),
    svgrPlugin(),
    visualizer({
      open: true,
      filename: "stats.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: { alias: { src: "/src", "@": path.resolve(__dirname, "./src") } },
});
