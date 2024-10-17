// import copy from 'esbuild-plugin-copy'
import fs from 'node:fs'
import path from 'node:path'

const copyPlugin = ({ext}) => {
  return {
    name: `copy-${ext}`,
    setup(build) {
      const srcDir = 'src'
      const destDir = 'dist/src'
      build.onEnd(() => {
        const copyFile = (src, dest) => {
          fs.mkdirSync(path.dirname(dest), { recursive: true })
          fs.copyFileSync(src, dest)
        }

        const walkDir = (dir, callback) => {
          fs.readdirSync(dir).forEach(f => {
            const dirPath = path.join(dir, f)
            const isDirectory = fs.statSync(dirPath).isDirectory()
            isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f))
          })
        }

        walkDir(srcDir, (filePath) => {
          if (filePath.endsWith(`.${ext}`)) {
            const relativePath = path.relative(srcDir, filePath)
            const destPath = path.join(destDir, relativePath)
            copyFile(filePath, destPath)
          }
        })
      })
    }
  }
}
/** @type {import('aegir').PartialOptions} */
export default {
  // TODO: fix build and test with aegir
  // test: {
  //   build: false,
  //   files: [
  //     'dist/test/**/*.spec.{js,ts, jsx, tsx}',
  //   ],
  // },
  build: {
    config: {
      inject: [
        './src/lib/browser-shims.js'
      ],
      bundle: true,
      loader: {
        '.js': 'jsx',
        '.ts': 'ts',
        '.tsx': 'tsx',
        '.jsx': 'jsx',
        '.svg': 'text',
        // '.css': 'css'
        '.woff': 'file',
        '.woff2': 'file',
        '.eot': 'file',
        '.otf': 'file',
      },
      platform: 'browser',
      target: 'es2022',
      format: 'esm',
      metafile: true,
      plugins: [
        copyPlugin({ext: 'css'}),
        copyPlugin({ext: 'svg'}),
      ],
    }
  },
  lint: {
    files: [
      'src/**/*.{js,jsx,ts,tsx}',
      'test/**/*.{js,jsx,ts,tsx}',
      'dev/**/*.{js,jsx,ts,tsx}',
      // TODO: re-enable linting of stories.
      '!src/**/*.stories.*',
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
      'react-helmet',

      // storybook deps
      '@chromatic-com/storybook',
      '@storybook/addon-actions',
      '@storybook/addon-coverage',
      '@storybook/addon-interactions',
      '@storybook/addon-links',
      '@storybook/types',

      // problem with deps
      '@typescript-eslint/eslint-plugin',

      // scripts
      'wait-on',

      // vite stuff
      'rollup-plugin-node-polyfills',

      // typescript plugins
      'typescript-plugin-css-modules'
    ],
    productionIgnorePatterns: [
      '.aegir.js',
      '.eslintrc.js',
      'vite.config.ts',
      'vitest.config.js',
      '/test',
      '.storybook',
      '**/*.stories.*',
    ]
  }
}
