import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

/**
 * ESLint flat config — ESLint 9 (flat config format)
 *
 * CHANGES FROM ORIGINAL:
 *   1. Removed `--ext ts,tsx` from package.json lint script — that flag was
 *      removed in ESLint 9. File targeting is now done via `files` glob here.
 *   2. `reportUnusedDisableDirectives` is now a linter option, not a CLI flag.
 *   3. strictTypeChecked rules require a valid tsconfig.json with "paths"
 *      correctly set — fixed in this PR.
 *
 * RULE PHILOSOPHY:
 *   - strictTypeChecked: all recommended TS rules + stricter unsafe patterns
 *   - react-hooks/rules-of-hooks: catches misuse of hooks (conditional calls, etc.)
 *   - react-refresh: HMR compatibility (only export components from component files)
 */
export default tseslint.config(
  // ── Ignored paths ──────────────────────────────────────────────────────────
  { ignores: ["dist", "node_modules", "*.config.js"] },

  // ── TypeScript source files ────────────────────────────────────────────────
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    linterOptions: {
      // Replaces the removed --report-unused-disable-directives CLI flag
      reportUnusedDisableDirectives: "warn",
    },
    rules: {
      // ── React Hooks ─────────────────────────────────────────────────────
      ...reactHooks.configs.recommended.rules,

      // ── React Refresh (HMR) ──────────────────────────────────────────────
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // ── TypeScript fine-tuning ───────────────────────────────────────────
      // Allow void operator on floating promise (common pattern in event handlers)
      "@typescript-eslint/no-confusing-void-expression": "off",
      // Allow explicit `any` in a handful of escape-hatch scenarios
      "@typescript-eslint/no-explicit-any": "warn",
      // Zustand `create` returns are fine without explicit type annotation
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },

  // ── Config files (JS, not TypeScript) ─────────────────────────────────────
  {
    files: ["*.config.{js,mjs,ts}", "vite.config.ts"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
);
