import js from "@eslint/js";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "sonarjs/cognitive-complexity": ["error", 15],
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
);
