import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium, type PlaywrightTestConfig } from '@playwright/test'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename)

interface ApiOpts {
  protocol: string
  host: string
  port: number
}
// make sure that ipfs-backend is fully running
const ensureKuboDaemon = async (apiOpts: ApiOpts): Promise<void> => {
  const backendEndpoint = `${apiOpts.protocol}://${apiOpts.host}:${apiOpts.port}`
  const body = new FormData()
  body.append('file', new Blob([new Uint8Array([1, 2, 3])]), 'test.txt')

  const fakeFileResult = await fetch(`${backendEndpoint}/api/v0/block/put`, {
    body,
    method: 'POST'
  })
  if (!fakeFileResult.ok) {
    console.error('fakeFileResult not okay', await fakeFileResult.text())
    throw new Error(`IPFS backend not running at ${backendEndpoint}`)
  }

  const { Key: cidString } = await fakeFileResult.json()
  const getContentResult = await fetch(`${backendEndpoint}/api/v0/block/get?arg=${cidString}`, {
    method: 'POST'
  })
  if (!getContentResult.ok) {
    console.error('Could not get fake file', await getContentResult.text())
    throw new Error(`IPFS backend not running at ${backendEndpoint}`)
  }
}

const globalSetup = async (config: PlaywrightTestConfig): Promise<void> => {
  // Read and expose backend info in env availables inside of test() blocks
  const { rpcAddr, id, agentVersion, apiOpts, kuboGateway } = JSON.parse(fs.readFileSync(path.join(__dirname, 'ipfs-backend.json'), 'utf8'))
  process.env.IPFS_RPC_ADDR = rpcAddr
  process.env.IPFS_RPC_ID = id
  process.env.IPFS_RPC_VERSION = agentVersion

  await ensureKuboDaemon(apiOpts)

  // @ts-expect-error - broken types for projects from playwright config
  const { baseURL, storageState } = config.projects[0].use
  const browser = await chromium.launch()
  const page = await browser.newPage({
    storageState: {
      cookies: [],
      origins: [
        {
          origin: baseURL,
          localStorage: [
            {
              name: 'kuboGateway',
              value: JSON.stringify(kuboGateway)
            },
            {
              name: 'explore.ipld.gatewayEnabled',
              value: 'false'
            }
          ]
        }
      ]
    }
  })
  await page.goto(baseURL)
  await page.context().storageState({ path: storageState })
  await browser.close()
}

export default globalSetup
