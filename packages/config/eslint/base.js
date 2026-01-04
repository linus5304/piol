/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  ignorePatterns: ["**/*.config.js", "**/*.config.mjs", "**/*.d.ts", "**/*.js"],
  env: {
    es2022: true,
    node: true
  },
  rules: {
    "no-unused-vars": "off",
    "no-undef": "off"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-explicit-any": "warn"
      }
    }
  ]
};

