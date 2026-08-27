/**
 * Flat config, consumed directly from `eslint-config-next`.
 *
 * The previous version bridged the legacy `.eslintrc` presets through
 * `FlatCompat` from `@eslint/eslintrc`. `eslint-config-next` v16 ships native
 * flat configs (`@next/eslint-plugin-next` defaults to flat config), and ESLint
 * v10 drops eslintrc support entirely, so the compat layer — and the
 * `@eslint/eslintrc` dependency — are gone.
 */
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
