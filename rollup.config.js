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


import packageJson from './package.json' assert { type: 'json' }

export default [
  {
    input: 'src/index.js',
    // dir: 'dist',
    output: [
      // {
      //   // file: packageJson.main,
      //   // dir: 'dist/cjs',
      //   format: 'cjs',
      //   sourcemap: true
      // },
      {
        // file: packageJson.module,
        dir: 'dist',
        format: 'esm',
        sourcemap: true
      }
    ],
    acornInjectPlugins: [jsx()],

    plugins: [

        // 'src/components/object-info/LinksTable.css',
        // 'src/components/loader/Loader.css'
      postcss({
        include: "src/components/object-info/LinksTable.css",
        extract: resolve('dist/components/object-info/LinksTable.css')
      }),
      postcss({
        include: "src/components/loader/Loader.css",
        extract: resolve('dist/components/loader/Loader.css')
      }),
      peerDepsExternal(),
      json(),
      svg(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
    external: ['react', 'react-dom', 'styled-components']
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/types.d.ts', format: 'es' }],
    plugins: [dts.default()]
  }
]
