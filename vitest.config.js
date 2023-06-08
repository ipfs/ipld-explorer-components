import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/unit/setup.js',
    include: [
      'src\/**\/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    deps: {
      inline: [
        'ipld-explorer-components'
      ]
    }
  }
}))
