import js from "@eslint/js";
import globals from "globals";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

// Backend ESLint config: recommended rules, code-quality rules,
// JSX-aware parsing, and Prettier integration (formatting issues are
// reported as lint errors; conflicting style rules are turned off).
export default [
  { ignores: ["frontend/**", "node_modules/**", "design/**"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "object-shorthand": ["error", "always"],
      "prefer-template": "error",
      "no-duplicate-imports": "error",
      "no-throw-literal": "error",
      "no-console": "off",
    },
  },
  eslintPluginPrettierRecommended,
];
