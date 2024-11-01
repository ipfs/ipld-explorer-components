import { resolve as pathResolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type UserConfig, type UserConfigExport } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const vitePlugins: UserConfig['plugins'] = [
    react(),
    svgrPlugin(),
    dts()
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
    loader: 'tsx',
    include: /\.(tsx?|jsx?)$/
  }
  const viteBuild: UserConfig['build'] = {
    lib: {
      entry: {
        index: pathResolve(__dirname, 'src/index.ts'),
        'providers/index': pathResolve(__dirname, 'src/providers/index.ts'),
        pages: pathResolve(__dirname, 'src/pages.ts'),
        forms: pathResolve(__dirname, 'src/forms.ts'),
      },
      name: 'ipld-explorer-components',
      fileName: (format, entryName) => `${format}/${entryName}.js`,
      formats: ['es']
    },
    outDir: 'dist',
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-i18next',
        'i18next',
        'i18next-browser-languagedetector',
        'i18next-http-backend',
        'i18next-icu',
        'ipfs-css',
        'tachyons',
        /\.stories\..+$/,
        // all test files (i.e. *.spec.{js,jsx,ts,tsx} or *.test.{js,jsx,ts,tsx})
        /\.test\..+$/,
        /\.spec\..+$/,
      ],
      preserveEntrySignatures: 'strict',
      input: {
        index: pathResolve(__dirname, 'src/index.ts'),
        'providers/index': pathResolve(__dirname, 'src/providers/index.ts'),
        pages: pathResolve(__dirname, 'src/pages.ts'),
        forms: pathResolve(__dirname, 'src/forms.ts'),
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  }

  viteResolve = {
    alias: [
      { find: /^process$/, replacement: 'rollup-plugin-node-polyfills/polyfills/process-es6' },
      { find: /^stream$/, replacement: 'rollup-plugin-node-polyfills/polyfills/stream' },
      { find: /^_stream_duplex$/, replacement: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex' },
      { find: /^_stream_transform$/, replacement: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform' },
    ]
  }
  viteOptimizeDeps.include = []
  viteOptimizeDeps.esbuildOptions = {
    ...viteOptimizeDeps.esbuildOptions,
    plugins: []
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
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly'
      }
    }
  }

  return finalConfig
})
