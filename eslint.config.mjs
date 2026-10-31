import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next already registers the jsx-a11y plugin; add its full recommended rule set.
  { rules: jsxA11y.flatConfigs.recommended.rules },
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    ".yarn/**",
    "next-env.d.ts",
  ]),
]);
