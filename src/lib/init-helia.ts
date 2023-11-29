import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { type Helia } from '@helia/interface'
import { delegatedContentRouting } from '@libp2p/delegated-content-routing'
import { delegatedPeerRouting } from '@libp2p/delegated-peer-routing'
import { mplex } from '@libp2p/mplex'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { type BlockRetriever, createHelia, type BlockRetrievalOptions } from 'helia'
import { trustlessGateway } from 'helia/block-brokers'
import { type create as createKuboClient } from 'kubo-rpc-client'
import { createLibp2p } from 'libp2p'
import { autoNATService } from 'libp2p/autonat'
import { circuitRelayTransport } from 'libp2p/circuit-relay'
import { identifyService } from 'libp2p/identify'

import getHasherForCode from './hash-importer.js'
import { addDagNodeToHelia } from '../lib/helpers.js'

export default async function initHelia (kuboClient: ReturnType<typeof createKuboClient>): Promise<Helia> {
  const blockstore = new MemoryBlockstore()
  const datastore = new MemoryDatastore()

  /**
   * based on https://github.com/ipfs/helia/blob/ed4985677b62021f76541354ad06b70bd53e929a/packages/helia/src/utils/libp2p.browser.ts#L20
   */
  const libp2p = await createLibp2p({
    start: true, // TODO: libp2p bug with stop/start - https://github.com/libp2p/js-libp2p/issues/1787
    peerRouters: [
      delegatedPeerRouting(kuboClient)
    ],
    contentRouters: [
      delegatedContentRouting(kuboClient)
    ],
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
      yamux(),
      mplex()
    ],
    services: {
      identify: identifyService(),
      autoNAT: autoNATService()
    }
  })
  const kuboRpcClientBlockRetriever: BlockRetriever = {
    retrieve: async (cid, { signal }: BlockRetrievalOptions) => {
      return kuboClient.block.get(cid, { signal })
    }
  }

  const helia = await createHelia({
    blockBrokers: [
      // no bitswap
      trustlessGateway(),
      () => kuboRpcClientBlockRetriever
    ],
    hashers: [
      await getHasherForCode(17),
      await getHasherForCode(18),
      await getHasherForCode(19),
      await getHasherForCode(27)
    ],
    datastore,
    blockstore,
    libp2p
  })

  // add helia-only examples
  await addDagNodeToHelia(helia, await import('@ipld/dag-json'), { hello: 'world' }) // baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea

  return helia
}
