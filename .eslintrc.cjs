module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: {
    browser: true,
    es2022: true,
    worker: true,
  },
  ignorePatterns: ['node_modules', 'dist', '.astro'],
  rules: {
    semi: ['error', 'always'],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
