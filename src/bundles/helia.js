/* globals globalThis */
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { delegatedContentRouting } from '@libp2p/delegated-content-routing'
import { delegatedPeerRouting } from '@libp2p/delegated-peer-routing'
import { ipniContentRouting } from '@libp2p/ipni-content-routing'
import { mplex } from '@libp2p/mplex'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { createHelia } from 'helia'
import { create as kuboClient } from 'kubo-rpc-client'
import { createLibp2p } from 'libp2p'
import { autoNATService } from 'libp2p/autonat'
import { circuitRelayTransport, circuitRelayServer } from 'libp2p/circuit-relay'
import { identifyService } from 'libp2p/identify'

import { addDagNodeToHelia } from '../lib/helpers'

const defaultState = {
  apiOpts: {
    host: '127.0.0.1',
    port: '5001',
    protocol: 'http'
  },
  provider: null, // 'ipfs-http-client' | 'js-ipfs'
  ipfsReady: false
}

function getUserOpts (key) {
  let userOpts = {}
  if (globalThis.localStorage) {
    try {
      const optsStr = globalThis.localStorage.getItem(key) || '{}'
      userOpts = JSON.parse(optsStr)
    } catch (error) {
      console.error(`Error reading '${key}' value from localStorage`, error)
    }
  }
  return userOpts
}

const bundle = {
  name: 'ipfs',

  reducer (state, { type, payload, error }) {
    state = state || defaultState
    if (type === 'IPFS_INIT_FINISHED') {
      return Object.assign({}, state, {
        ipfsReady: true,
        identity: payload.identity,
        provider: payload.provider,
        apiOts: payload.apiOpts || state.apiOpts
      })
    }

    if (type === 'IPFS_INIT_FAILED') {
      return Object.assign({}, state, { ipfsReady: false, error })
    }

    return state
  },

  getExtraArgs () {
    return { getIpfs: () => globalThis._ipfs }
  },

  selectIpfsReady: state => state.ipfs.ipfsReady,

  selectIpfsIdentity: state => state.ipfs.identity,

  doInitIpfs: () => async ({ dispatch, getState }) => {
    console.time('IPFS_INIT')
    dispatch({ type: 'IPFS_INIT_STARTED' })

    let ipfs = null
    let identity = null

    // TODO: use delegatedContent&Peer routing via helia instead of kubo-rpc-client directly.
    // TRY kubo-rpc-client (kubo-rpc-client)
    const apiOpts = Object.assign(
      {},
      getState().ipfs.apiOpts,
      getUserOpts('ipfsApi')
    )
    // TRY helia!
    try {
      console.time('HELIA_INIT')
      console.info(
        "🎛️ Customise your kubo-rpc-client opts by setting an `ipfsApi` value in localStorage. e.g. localStorage.setItem('ipfsApi', JSON.stringify({port: '1337'}))"
      )
      ipfs = await initHelia(apiOpts)
      // identity = await ipfs.libp2p.identify()
      identity = 'helia-TBD'
      globalThis._ipfs = ipfs
      console.timeEnd('HELIA_INIT')
      console.timeEnd('IPFS_INIT')
      return dispatch({
        type: 'IPFS_INIT_FINISHED',
        payload: {
          identity,
          provider: 'helia'
        }
      })
    } catch (error) {
      return dispatch({ type: 'IPFS_INIT_FAILED', error })
    }
  }
}
export default bundle

async function initHelia (ipfsApi) {
  const delegatedKuboClient = kuboClient(ipfsApi)

  const blockstore = new MemoryBlockstore()
  const datastore = new MemoryDatastore()

  /**
   * based on https://github.com/ipfs/helia/blob/ed4985677b62021f76541354ad06b70bd53e929a/packages/helia/src/utils/libp2p.browser.ts#L20
   */
  const libp2p = await createLibp2p({
    start: true, // TODO: libp2p bug with stop/start - https://github.com/libp2p/js-libp2p/issues/1787
    addresses: {
      listen: [
        '/webrtc'
      ]
    },
    peerRouters: [
      delegatedPeerRouting(delegatedKuboClient)
    ],
    contentRouters: [
      delegatedContentRouting(delegatedKuboClient)
    ],
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
      autoNAT: autoNATService(),
      relay: circuitRelayServer({
        advertise: true
      })
    }
  })

  const helia = await createHelia({
    datastore,
    blockstore,
    libp2p
  })

  // add helia-only examples
  await addDagNodeToHelia(helia, await import('@ipld/dag-json'), { hello: 'world' }) // baguqeerasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea

  return helia
}
