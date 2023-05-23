import { join, resolve } from 'node:path'
import {readFileSync, writeFileSync} from 'node:fs'

import { defineConfig, DepOptimizationOptions, ESBuildOptions, PluginOption, UserConfig, UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import nodePolyfills from 'rollup-plugin-node-polyfills';


import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import { createRequire } from 'node:module'

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
  ]
  let viteResolve: UserConfig['resolve'] = {
    alias: [{ find: '@', replacement: resolve(__dirname, '/src') }]
  }

  let viteDefine: UserConfig['define'] =  {
    global: 'globalThis'
  }
  const viteOptimizeDeps: UserConfig['optimizeDeps'] = {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
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
        resolve(__dirname, 'src/index.js'),
        // resolve(__dirname, 'src/bundles/explore.js'),
        // resolve(__dirname, 'src/components/object-info/LinksTable.css'),
      ],
      // name: 'ipld-explorer-components',
      fileName: (format, entryName) => `${format}/${entryName}.js`,
      // formats: ['es', 'cjs']
      formats: ['es'],
    },
    outDir: 'dist',
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        /node_modules/
      ],
      preserveEntrySignatures: 'strict',
      input: {
        index: resolve(__dirname, 'src/index.js'),
        // 'bundles/explore': resolve(__dirname, 'src/bundles/explore.js'),
        // 'components/object-info/LinksTable.css': resolve(__dirname, 'src/components/object-info/LinksTable.css'),
        // 'components/loader/Loader.css': resolve(__dirname, 'src/components/loader/Loader.css'),

      },
      output: {
        // manualChunks: {},
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
      plugins: [
        // nodePolyfills({'buffer': true, 'process': true)
      ]
    },
  }

  // if (isDev) {
    // We only want to provide polyfills if we're in dev mode.
    viteResolve = {
      alias: [
        // { find: '@', replacement: resolve(__dirname, '/src') },
        // stream: "rollup-plugin-node-polyfills/polyfills/stream",
        // events: "rollup-plugin-node-polyfills/polyfills/events",
        // { find: /^buffer$/, replacement: 'rollup-plugin-node-polyfills/polyfills/buffer-es6' },
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
    // viteBuild.rollupOptions = {
    //   // plugins: [nodePolyfills()],
    // };
  // }

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
