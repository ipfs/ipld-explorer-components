/** @type {import('aegir').PartialOptions} */
module.exports = {
  lint: {
    files: [
      // '!node_modules/**',
      'src/**/*.{js,jsx,ts,tsx}',
      'test/**/*.{js,jsx,ts,tsx}',
      // 'src/**/*.tsx',
      // 'src/**/*.js',
      // 'src/**/*.jsx',
      'dev/**/*.{js,jsx,ts,tsx}',
    ]
  },
  dependencyCheck: {
    ignore: [
      // .jsx files aren't checked properly.
      'cytoscape',
      'cytoscape-dagre',
      'filesize',
      'react-inspector',
      'react-joyride',

      // storybook deps
      '@storybook/addon-actions',
      '@storybook/addon-coverage',
      '@storybook/addon-essentials',
      '@storybook/addon-interactions',
      '@storybook/addon-links',
      '@storybook/channels',
      '@storybook/core-common',
      '@storybook/core-events',
      '@storybook/csf-plugin',
      '@storybook/csf-tools',
      '@storybook/docs-tools',
      '@storybook/node-logger',
      '@storybook/react-dom-shim',
      '@storybook/types',

      // problem with deps
      '@typescript-eslint/eslint-plugin',

      // scripts
      'wait-on',
    ],
    productionIgnorePatterns: [
      '.aegir.js',
      '.eslintrc.js',
      'vite.config.ts',
      'vitest.config.js',
      '/test',
      '.storybook',
      'dist-vite'
    ]
  }
}
