/** @type {import('aegir').PartialOptions} */
module.exports = {
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
      '@typescript-eslint/eslint-plugin'
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
