import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import {EsmExternalsPlugin} from '@esbuild-plugins/esm-externals'
// console.log(`EsmExternals: `, EsmExternals);

import pkgJson from './package.json' assert { type: 'json' }
const { dependencies, peerDependencies } = pkgJson

/** @type {import('aegir').PartialOptions} */
export default {
  tsRepo: true,
  release: {
    build: false
  },
  dependencyCheck: {
    input: [
      'dist/**/*.js',
    ],
    productionInput: [
      'dist/**/*.js',
    ],
  },
  build: {
    config: {
      platform: 'browser',
      format: 'esm',
      // external: Object.keys(dependencies).concat(Object.keys(peerDependencies)),
      outbase: 'src',
      outdir: 'dist',
      outfile: '',
      loader: {
        '.svg': 'text',
        '.ts': 'ts',
        '.js': 'js',
        '.jsx': 'jsx',
      },
      entryPoints: [
        'src/index.js',
        'src/components/object-info/LinksTable.css',
        'src/components/loader/Loader.css'
      ],
      bundle: false,
      plugins: [
        EsmExternalsPlugin({ externals: ['react', 'react-dom'] }),
        NodeModulesPolyfillPlugin(),
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
          stream: true,
          crypto: true,
        }),
        // NodeResolve({
        //     extensions: ['.ts', '.js'],
        //     onResolved: (resolved) => {
        //         if (resolved.includes('node_modules')) {
        //             return {
        //               external: true,
        //             }
        //         }
        //         return resolved
        //     },
        // }),
      ],
    }
  },
  test: {
    build: false,
    target: 'browser',
    files: [
      'src/**/*.test.js',
    ]
  }
}
