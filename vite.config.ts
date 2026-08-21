import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import tailwindcss from "@tailwindcss/vite";
import svgrPlugin from "vite-plugin-svgr";
import path from "path";

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
  ],
  resolve: { alias: { src: "/src", "@": path.resolve(__dirname, "./src") } },
});
