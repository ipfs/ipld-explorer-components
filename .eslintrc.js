module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'react-app',
      'standard',
      'ipfs',
    ],
    plugins: [
      'import',
      '@typescript-eslint',
      'jsx-a11y',
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
  },
}
