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
console.log(`babel: `, babel);

import packageJson from './package.json' assert { type: 'json' }

import { basename, dirname, isAbsolute } from 'path';
import * as fs from 'fs';

function isFile ( file ) {
    try {
        return fs.statSync( file ).isFile();
    } catch ( err ) {
        return false;
    }
}

function addExtensionIfNecessary ( file, extensions ) {
    try {
        const name = basename( file );
        const files = fs.readdirSync( dirname( file ) );

        if ( ~files.indexOf( name ) && isFile( file ) ) return file;
        for ( const ext of extensions ) {
            if ( ~files.indexOf( `${name}${ext}` ) && isFile( `${file}${ext}` ) ) {
                return `${file}${ext}`;
            }
        }
    } catch ( err ) {
        // noop
    }

    return null;
}

function extensions ({extensions}) {
    if (!extensions || !extensions.length) {
        throw new Error( `Must specify { extensions: [..] } as non-empty array!` );
    }

    return {
        name: 'extensions',

        resolveId ( importee, importer ) {
            // absolute paths are left untouched
            if ( isAbsolute( importee ) ) {
                return addExtensionIfNecessary( resolve( importee ), extensions );
            }

            // if this is the entry point, resolve against cwd
            if ( importer === undefined ) {
                return addExtensionIfNecessary( resolve( process.cwd(), importee ), extensions );
            }

            // external modules are skipped at this stage
            if ( importee[0] !== '.' ) return null;

            return addExtensionIfNecessary( resolve( dirname( importer ), importee ), extensions );
        }
    };
}

export default [
  {
    input: 'dist/index.js',
    // dir: 'dist',
    output: [
      {
        // file: packageJson.module,
        dir: 'dist/cjs',
        format: 'cjs',
        sourcemap: true
      }
    ],
    // acornInjectPlugins: [jsx()],

    plugins: [
      postcss({
        include: "dist/components/object-info/LinksTable.css",
        extract: resolve('dist/cjs/components/object-info/LinksTable.css')
      }),
      postcss({
        include: "dist/components/loader/Loader.css",
        extract: resolve('dist/cjs/components/loader/Loader.css')
      }),
      resolve({extensions: ['.js', '.jsx', '.ts', '.tsx']}),
      babel({ babelHelpers: 'bundled', extensions: [".js", ".jsx"] }),
      // extensions({
      //   extensions: [ '.jsx', '.js'],
      // }),

        // 'src/components/object-info/LinksTable.css',
        // 'src/components/loader/Loader.css'

      peerDepsExternal(),
      json(),
      svg(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.rollup.json' }),
      // terser(),
    ],
    external: ['react', 'react-dom', 'styled-components']
  },
  // {
  //   input: 'src/index.ts',
  //   output: [{ file: 'dist/cjs/types.d.ts', format: 'es' }],
  //   plugins: [dts.default()]
  // }
]
