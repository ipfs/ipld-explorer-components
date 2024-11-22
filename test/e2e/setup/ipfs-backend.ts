import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url'
import { createFactory, type KuboNode } from 'ipfsd-ctl'
import { path as kuboPath } from 'kubo'
import { create, multiaddr, type KuboRPCClient } from 'kubo-rpc-client'

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename)
const { console } = globalThis

let ipfsd: KuboNode
let ipfs: KuboRPCClient
async function run (rpcPort?: string): Promise<void> {
  if (ipfsd != null && ipfs != null) {
    throw new Error('IPFS backend already running')
  }
  const endpoint = process.env.E2E_API_URL
  if (endpoint != null && endpoint !== '') {
    // create http rpc client for endpoint passed via E2E_API_URL=
    ipfs = create(endpoint)
  } else {
    // use ipfds-ctl to spawn daemon to expose http api used for e2e tests
    const factory = createFactory({
      rpc: create,
      type: 'kubo',
      bin: process.env.IPFS_GO_EXEC ?? kuboPath(),
      init: {
        config: {
          Addresses: {
            API: `/ip4/127.0.0.1/tcp/${rpcPort}`,
            Gateway: '/ip4/127.0.0.1/tcp/0'
          },
          Gateway: {
            NoFetch: true,
            ExposeRoutingAPI: true
          },
          Routing: {
            Type: 'none'
          }
        }
      },
      // sets up all CORS headers required for accessing HTTP API port of ipfsd node
      test: true
    })

    ipfsd = await factory.spawn({ type: 'kubo' })
    ipfs = ipfsd.api
  }
  const { id, agentVersion } = await ipfs.id()
  const { gateway, api: rpcAddr } = await ipfsd.info()
  const rpcApiMaddr = multiaddr(rpcAddr)
  const { address: apiHost, port: apiPort } = rpcApiMaddr.nodeAddress()
  const { hostname: gatewayHost, port: gatewayPort } = new URL(gateway)


  if (String(apiPort) !== rpcPort) {
    console.error(`Invalid RPC port returned by IPFS backend: ${apiPort} != ${rpcPort}`)
    await ipfsd.stop()
    process.exit(1)
  }


  // persist details for e2e tests
  fs.writeFileSync(path.join(__dirname, 'ipfs-backend.json'), JSON.stringify({
    rpcAddr,
    id,
    agentVersion,
    /**
     * Used by ipfs-webui to connect to Kubo via the kubo-rpc-client
     */
    apiOpts: {
      host: apiHost,
      port: apiPort,
      protocol: 'http'
    },
    /**
     * Used by ipld-explorer-components to connect to the kubo gateway
     */
    kuboGateway: {
      host: gatewayHost,
      port: gatewayPort,
      protocol: 'http'
    }
  }))

  console.log(`\nE2E using ${agentVersion} (${endpoint ?? rpcAddr})
  Peer ID: ${id}
  rpcAddr: ${rpcAddr}
  gatewayAddr: ${gateway}`)

  const teardown = (): void => {
    console.log(`Stopping IPFS backend ${id}`)
    ipfsd.stop().catch(console.error).finally(() => process.exit(0))
  }
  process.stdin.resume()
  process.on('SIGINT', teardown)
}

run(process.argv[2] ?? '5001').catch(console.error)
