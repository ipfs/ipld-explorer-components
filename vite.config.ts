import { join, resolve as pathResolve } from 'node:path'
import {readFileSync, writeFileSync} from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import { createRequire } from 'node:module'

import { defineConfig, DepOptimizationOptions, ESBuildOptions, PluginOption, UserConfig, UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import nodePolyfills from 'rollup-plugin-node-polyfills';
import resolve from '@rollup/plugin-node-resolve'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy'


// https://github.com/bvaughn/react-virtualized/issues/1632#issuecomment-1483966063
const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`
function reactVirtualized(): PluginOption {
  return {
    name: 'flat:react-virtualized',
    // Note: we cannot use the `transform` hook here
    //       because libraries are pre-bundled in vite directly,
    //       plugins aren't able to hack that step currently.
    //       so instead we manually edit the file in node_modules.
    //       all we need is to find the timing before pre-bundling.
    configResolved: async () => {
      const require = createRequire(import.meta.url)
      const reactVirtualizedPath = require.resolve('react-virtualized')
      const { pathname: reactVirtualizedFilePath } = new url.URL(reactVirtualizedPath, import.meta.url)
      const file = reactVirtualizedFilePath
        .replace(
          path.join('dist', 'commonjs', 'index.js'),
          path.join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js'),
        )
      const code = await fs.readFile(file, 'utf-8')
      const modified = code.replace(WRONG_CODE, '')
      await fs.writeFile(file, modified)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  console.log(`mode: `, mode);
  const isDev = mode === 'development'

  const vitePlugins: UserConfig['plugins'] = [
      react(),
      svgrPlugin(),
      reactVirtualized(),
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      })
  ]
  let viteResolve: UserConfig['resolve'] = {
    alias: [{ find: '@', replacement: pathResolve(__dirname, '/src') }]
  }

  let viteDefine: UserConfig['define'] =  {
    global: 'globalThis'
  }
  const viteOptimizeDeps: UserConfig['optimizeDeps'] = {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.jsx': 'jsx',
        '.tsx': 'tsx',
      },
    },
  };
  const viteEsBuild: UserConfig['esbuild'] = {
    loader: "tsx", // OR "tsx"
    include: /\.(tsx?|jsx?)$/,
  }
  const viteBuild: UserConfig['build'] = {
    lib: {
      entry: [
        pathResolve(__dirname, 'src/index.js'),
        // resolve(__dirname, 'src/bundles/explore.js'),
        // resolve(__dirname, 'src/components/object-info/LinksTable.css'),
      ],
      // name: 'ipld-explorer-components',
      fileName: (format, entryName) => `${format}/${entryName}.js`,
      // formats: ['es', 'cjs']
      formats: ['es'],
    },
    outDir: 'dist-vite',
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        /node_modules/
      ],
      preserveEntrySignatures: 'strict',
      input: {
        index: pathResolve(__dirname, 'src/index.js'),
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
      plugins: [
      ]
    },
  }

    viteResolve = {
      alias: [
        { find: /^process$/, replacement: 'rollup-plugin-node-polyfills/polyfills/process-es6' },
        { find: /^stream$/, replacement: 'rollup-plugin-node-polyfills/polyfills/stream' },
        { find: /^_stream_duplex$/, replacement: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex' },
        { find: /^_stream_transform$/, replacement: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform' },
      ],
    }
    viteOptimizeDeps.include = [
      'ipld-ethereum'
    ]
    viteOptimizeDeps.esbuildOptions = {
      ...viteOptimizeDeps.esbuildOptions,
      plugins: [
        NodeGlobalsPolyfillPlugin({ buffer: true, process: true }),
      ],
    }

  const finalConfig: UserConfigExport = {
    plugins: vitePlugins,
    resolve: viteResolve,
    define: viteDefine,
    optimizeDeps: viteOptimizeDeps,
    esbuild: viteEsBuild,
    build: viteBuild,
    server: {
      open: true,
    },
  }

  return finalConfig;
})
