import { defineConfig, type PlaywrightTestConfig } from '@playwright/test'
import getPort from 'aegir/get-port'

const webHostPort = '5173'
const rpcPort = await getPort(5001, '0.0.0.0')

const config: PlaywrightTestConfig = {
  testDir: './',
  timeout: process.env.CI != null ? 90 * 1000 : 30 * 1000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI != null ? 2 : 0,
  workers: (process.env.DEBUG != null || process.env.CI != null) ? 1 : undefined,
  reporter: 'list',
  use: {
    headless: process.env.DEBUG == null,
    viewport: { width: 1366, height: 768 },
    baseURL: `http://localhost:${webHostPort}/`,
    storageState: 'test/e2e/state.json',
    trace: 'on-first-retry'
  },
  globalSetup: './setup/global-setup.ts',
  globalTeardown: './setup/global-teardown.ts',
  webServer: [
    {
      command: `npx tsx ipfs-backend.ts ${rpcPort}`,
      timeout: 5 * 1000,
      port: rpcPort,
      cwd: './setup',
      reuseExistingServer: process.env.CI == null
    },
    {
      command: 'npm run start',
      timeout: 5 * 1000,
      url: `http://localhost:${webHostPort}/`,
      cwd: '../../',
      reuseExistingServer: process.env.CI == null,
      env: {
        REACT_APP_ENV: 'test',
        NODE_ENV: 'test',
        PORT: webHostPort
      }
    }
  ]
}

export default defineConfig(config)
