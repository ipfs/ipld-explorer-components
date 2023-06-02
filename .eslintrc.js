module.exports = {
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['node_modules'],
  parserOptions: {
    project: './tsconfig.eslint.json'
  },
  plugins: ['import'],
  extends: [
    'react-app',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'ipfs',
    'plugin:storybook/recommended'
  ],
  rules: {
    'import/order': ['error', {
      groups: [
        'builtin', // Built-in types are first
        ['external', 'unknown'],
        ['parent', 'sibling', 'internal', 'index']
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      },
      warnOnUnassignedImports: true
    }],
    'import/extensions': ['error', 'never'], // Errors using extensions because ts + vite + babel + storybook needs.
    'no-console': ['error', {
      allow: ['error', 'info', 'time', 'timeEnd', 'warn']
    }],
    'no-warning-comments': ['off'],
    strict: ['error', 'never'],
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }]
  }
}
