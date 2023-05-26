module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: [
      'import',
    ],
    extends: [
      'react-app',
      'plugin:jsx-a11y/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'plugin:import/typescript',
      'ipfs',
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
      'no-console': ['error', { allow: ['error', 'time', 'timeEnd', 'warn'] }],
      'no-warning-comments': ['off'],
      'strict': ['error', 'never'],
  },
}
