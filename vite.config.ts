/// <reference types="vitest/config" />
import path from "path";
import {
  defineConfig,
  loadEnv,
  type HtmlTagDescriptor,
  type Plugin,
} from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import tailwindcss from "@tailwindcss/vite";
import svgrPlugin from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_APP_");
  const apiUrl = env.VITE_APP_API_URL ?? "http://localhost:3000";
  const sourceMapEnabled = env.VITE_APP_SOURCE_MAP === "true";

  const htmlEnvPlugin = (): Plugin => ({
    name: "html-env-injection",
    apply: "build",
    transformIndexHtml() {
      const csp = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        `connect-src 'self' ${apiUrl} wss://*`,
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
      ].join("; ");

      const tags: HtmlTagDescriptor[] = [
        {
          tag: "meta",
          attrs: { "http-equiv": "Content-Security-Policy", content: csp },
          injectTo: "head-prepend",
        },
        {
          tag: "link",
          attrs: { rel: "preconnect", href: new URL(apiUrl).origin },
          injectTo: "head",
        },
      ];

      return tags;
    },
  });

  return {
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
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: false,
        includeAssets: ["favicon.svg"],
        manifest: {
          name: "STS App",
          short_name: "STS",
          description: "Manage users, subjects, questions, and test sessions.",
          theme_color: "#0f172a",
          background_color: "#ffffff",
          display: "standalone",
          lang: "en",
          icons: [
            {
              src: "favicon.svg",
              sizes: "any",
              type: "image/svg+xml",
              purpose: "any",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,woff2,woff}"],
          navigateFallbackDenylist: [/^\/api/],
        },
      }),
      viteCompression({ verbose: false, algorithm: "gzip", ext: ".gz" }),
      viteCompression({
        verbose: false,
        algorithm: "brotliCompress",
        ext: ".br",
      }),
      htmlEnvPlugin(),
    ],
    resolve: { alias: { src: "/src", "@": path.resolve(__dirname, "./src") } },
    build: { sourcemap: sourceMapEnabled },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
      css: true,
      pool: "vmThreads",
    },
  };
});
