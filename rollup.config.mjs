import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import * as dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import jsx from 'acorn-jsx';
import postcss from 'rollup-plugin-postcss'
import json from '@rollup/plugin-json';
import svg from 'rollup-plugin-svg'
import { babel } from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy'
import autoExternal from 'rollup-plugin-auto-external';
import nodePolyfills from 'rollup-plugin-polyfill-node';

import packageJson from './package.json' assert { type: 'json' }

/** @type {import('rollup').NormalizedInputOptions[]} */
export default [
  {
    input: 'dist-esm/index.js',
    // dir: 'dist',
    output: [
      {
        // file: packageJson.module,
        dir: 'dist-cjs',
        format: 'cjs',
        sourcemap: true,
        // preserveModules: true,
        // exports: 'named',
      }
    ],
    // acornInjectPlugins: [jsx()],

    plugins: [
      autoExternal({
        builtins: true,
        dependencies: false,
        peerDependencies: true,
      }),
      copy({
        targets: [
          // { src: 'dist-esm/**/*.css', dest: 'dist-cjs' },
          {
            src: 'dist-esm/**/*.svg', dest: 'dist-cjs', flatten: false,
            // rename: (name, extension, fullPath) => `${fullPath.replace('dist-esm', '')}`
          }
        ]
      }),
      resolve({
        preferBuiltins: true
      }),
      postcss({
        include: "dist-esm/components/object-info/LinksTable.css",
        extract: resolve('dist-cjs/components/object-info/LinksTable.css')
      }),
      postcss({
        include: "dist-esm/components/loader/Loader.css",
        extract: resolve('dist-cjs/components/loader/Loader.css')
      }),

      // nodePolyfills({
      //   include: [/cluster/]
      // }),
      commonjs(),
      // babel({ babelHelpers: 'runtime', extensions: [".js", ".jsx"] }),

      // babel({ babelHelpers: 'bundled', extensions: [".js", ".jsx"] }),
      // extensions({
      //   extensions: [ '.jsx', '.js'],
      // }),

        // 'src/components/object-info/LinksTable.css',
        // 'src/components/loader/Loader.css'

      // peerDepsExternal(),
      json(),
      svg(),

      // typescript({ tsconfig: './tsconfig.rollup.json' }),
      // terser(),
    ],
    external: ['react', 'react-dom', '@babel/runtime', 'log', 'cluster']
    // external: Object.keys(packageJson.dependencies || {}).concat(Object.keys(packageJson.peerDependencies || {})).concat(Object.keys(packageJson.devDependencies || {}))
  },
  {
    input: 'dist-esm/index.d.ts',
    output: [{ file: 'dist-cjs/index.d.ts', format: 'cjs' }],
    plugins: [dts.default()]
  }
]
