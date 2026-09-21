import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const supportsColor =
  !process.env.NO_COLOR && (process.stderr.isTTY || process.stdout.isTTY);

const color = {
  red: (s) => (supportsColor ? `\x1b[31m${s}\x1b[39m` : s),
  green: (s) => (supportsColor ? `\x1b[32m${s}\x1b[39m` : s),
  yellow: (s) => (supportsColor ? `\x1b[33m${s}\x1b[39m` : s),
  magenta: (s) => (supportsColor ? `\x1b[35m${s}\x1b[39m` : s),
  cyan: (s) => (supportsColor ? `\x1b[36m${s}\x1b[39m` : s),
  dim: (s) => (supportsColor ? `\x1b[2m${s}\x1b[22m` : s),
  bold: (s) => (supportsColor ? `\x1b[1m${s}\x1b[22m` : s),
};

const LANGUAGES = ["en", "ar"];
const NAMESPACES = [
  "common",
  "nav",
  "auth",
  "home",
  "subjects",
  "tests",
  "questions",
  "answers",
  "users",
  "testSessions",
  "settings",
];

function flatten(ns) {
  const flat = new Set();
  const walk = (node, prefix) => {
    for (const [key, value] of Object.entries(node)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object") walk(value, path);
      else flat.add(path);
    }
  };
  walk(ns, "");
  return flat;
}

let errors = 0;
for (const namespace of NAMESPACES) {
  const bundles = {};
  for (const language of LANGUAGES) {
    const file = require(`../src/i18n/locales/${language}/${namespace}.json`);
    bundles[language] = flatten(file);
  }

  const [en, ar] = LANGUAGES.map((language) => bundles[language]);
  const missingInAr = [...en].filter((key) => !ar.has(key));
  const missingInEn = [...ar].filter((key) => !en.has(key));

  if (missingInAr.length || missingInEn.length) {
    errors++;
    console.error(`\n${color.bold(color.yellow(`✗ ${namespace}`))}`);
    if (missingInAr.length)
      console.error(
        `  ${color.dim(color.magenta("missing in ar:"))} ${missingInAr
          .map((key) => color.red(key))
          .join(color.dim(", "))}`,
      );
    if (missingInEn.length)
      console.error(
        `  ${color.dim(color.cyan("missing in en:"))} ${missingInEn
          .map((key) => color.red(key))
          .join(color.dim(", "))}`,
      );
  }
}

if (errors) {
  console.error(
    `\n${color.bold(color.red(`✗ ${errors} namespace(s) have keys missing in a language.`))} ` +
      color.dim(
        "Fix the locale files or run `npm run build` — every key must exist in both en and ar.",
      ),
  );
  process.exit(1);
}

console.log(
  color.green(
    `✓ ${NAMESPACES.length} namespaces are in sync (en ↔ ar, identical key sets).`,
  ),
);
