import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import tailwindcss from "@tailwindcss/vite";
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
  ],
});
