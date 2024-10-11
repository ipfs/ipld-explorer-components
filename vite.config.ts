import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path, { resolve as pathResolve } from 'node:path'
import url from 'node:url'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import resolve from '@rollup/plugin-node-resolve'
import react from '@vitejs/plugin-react'
import { defineConfig, type PluginOption, type UserConfig, type UserConfigExport } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'

// https://github.com/bvaughn/react-virtualized/issues/1632#issuecomment-1483966063
const WRONG_CODE = 'import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";'
function reactVirtualized (): PluginOption {
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
          path.join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js')
        )
      const code = await fs.readFile(file, 'utf-8')
      const modified = code.replace(WRONG_CODE, '')
      await fs.writeFile(file, modified)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const vitePlugins: UserConfig['plugins'] = [
    react(),
    svgrPlugin(),
    reactVirtualized(),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    })
  ]
  let viteResolve: UserConfig['resolve'] = {
    alias: [{ find: '@', replacement: pathResolve(__dirname, '/src') }]
  }

  const viteDefine: UserConfig['define'] = {}
  if (mode === 'development' && command === 'serve') {
    viteDefine.global = 'globalThis'
  }

  const viteOptimizeDeps: UserConfig['optimizeDeps'] = {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
        '.jsx': 'jsx',
        '.tsx': 'tsx'
      }
    }
  }
  const viteEsBuild: UserConfig['esbuild'] = {
    loader: 'tsx', // OR "tsx"
    include: /\.(tsx?|jsx?)$/
  }
  const viteBuild: UserConfig['build'] = {
    lib: {
      entry: [
        pathResolve(__dirname, 'src/index.ts')
      ],
      fileName: (format, entryName) => `${format}/${entryName}.js`,
      formats: ['es']
    },
    outDir: 'dist-vite',
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        /node_modules/,
        /\.stories\..+$/
      ],
      preserveEntrySignatures: 'strict',
      input: {
        index: pathResolve(__dirname, 'src/index.ts')
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js'
      },
      plugins: [
      ]
    }
  }

  viteResolve = {
    alias: [
      { find: /^process$/, replacement: 'rollup-plugin-node-polyfills/polyfills/process-es6' },
      { find: /^stream$/, replacement: 'rollup-plugin-node-polyfills/polyfills/stream' },
      { find: /^_stream_duplex$/, replacement: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex' },
      { find: /^_stream_transform$/, replacement: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform' },
      { find: /^buffer$/, replacement: 'rollup-plugin-node-polyfills/polyfills/buffer-es6' },
    ]
  }
  viteOptimizeDeps.include = []
  viteOptimizeDeps.esbuildOptions = {
    ...viteOptimizeDeps.esbuildOptions,
    plugins: [
      NodeGlobalsPolyfillPlugin({ buffer: true, process: true })
    ]
  }

  const finalConfig: UserConfigExport = {
    plugins: vitePlugins,
    resolve: viteResolve,
    define: viteDefine,
    optimizeDeps: viteOptimizeDeps,
    esbuild: viteEsBuild,
    build: viteBuild,
    server: {
      open: true
    }
  }

  return finalConfig
})
