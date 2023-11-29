import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { createDelegatedRoutingV1HttpApiClient } from '@helia/delegated-routing-v1-http-api-client'
import { type Helia } from '@helia/interface'
import { autoNAT } from '@libp2p/autonat'
import { circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { identify } from '@libp2p/identify'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { createHelia } from 'helia'
import { trustlessGateway } from 'helia/block-brokers'
import { createLibp2p } from 'libp2p'

import { getHashersForCodes } from './hash-importer.js'
import { addDagNodeToHelia } from '../lib/helpers.js'
import type { KuboGatewayOptions } from '../types.d.js'

export default async function initHelia (kuboGatewayOptions: KuboGatewayOptions): Promise<Helia> {
  const blockstore = new MemoryBlockstore()
  const datastore = new MemoryDatastore()

  /**
   * based on https://github.com/ipfs/helia/blob/ed4985677b62021f76541354ad06b70bd53e929a/packages/helia/src/utils/libp2p.browser.ts#L20
   */
  const libp2p = await createLibp2p({
    connectionManager: {
      // do not auto-dial peers. We will manually dial peers when we need them.
      minConnections: 0
    },
    datastore,
    transports: [
      webRTC(),
      webRTCDirect(),
      webTransport(),
      webSockets(),
      circuitRelayTransport({
        discoverRelays: 1
      })
    ],
    connectionEncryption: [
      noise()
    ],
    streamMuxers: [
      yamux()
    ],
    services: {
      identify: identify(),
      autoNAT: autoNAT(),
      delegatedRouting: () => createDelegatedRoutingV1HttpApiClient('https://delegated-ipfs.dev')
    }
  })

  const helia = await createHelia({
    blockBrokers: [
      // no bitswap
      trustlessGateway(),
      trustlessGateway({ gateways: [`${kuboGatewayOptions.protocol ?? 'http'}://${kuboGatewayOptions.host}:${kuboGatewayOptions.port}`] })
    ],
    hashers: await getHashersForCodes(17, 18, 19, 27),
    datastore,
    blockstore,
    // @ts-expect-error - libp2p types are borked right now
    libp2p
  })

  // add helia-only examples
  // consumers may not have the peer-deps installed for these examples, and we don't want to break them if they're not supported.
  await Promise.allSettled([
    import('@ipld/dag-json').then(async (dagJsonModule) => addDagNodeToHelia(helia, dagJsonModule, { hello: 'world' })) // baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea
  ])

  return helia
}
