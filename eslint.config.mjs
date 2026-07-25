import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist/**",
    "docs/**",
    "node_modules/**",
  ]),
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    rules: {
      "no-unused-vars": "off",
    },
  },
]);
