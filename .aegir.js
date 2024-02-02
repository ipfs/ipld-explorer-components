/** @type {import('aegir').PartialOptions} */
module.exports = {
  dependencyCheck: {
    // .jsx files aren't checked properly.
    ignore: [
      'cytoscape',
      'cytoscape-dagre',
      'filesize',
      'react-inspector',
      'react-joyride'
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
