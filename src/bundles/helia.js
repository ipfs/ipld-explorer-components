
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
// import { unixfs } from '@helia/unixfs'
import { bootstrap } from '@libp2p/bootstrap'
import { webSockets } from '@libp2p/websockets'
import { MemoryBlockstore } from 'blockstore-core'
import { MemoryDatastore } from 'datastore-core'
import { createHelia } from 'helia'
import { createLibp2p } from 'libp2p'
import { identifyService } from 'libp2p/identify'
import { create } from 'kubo-rpc-client'


const defaultState = {
  apiOpts: {
    host: '127.0.0.1',
    port: '5001',
    protocol: 'http'
  },
  provider: null, // 'ipfs-http-client' | 'js-ipfs'
  ipfsReady: false
}

function getUserOpts(key) {
  let userOpts = {}
  if (globalThis.localStorage) {
    try {
      const optsStr = globalThis.localStorage.getItem(key) || '{}'
      userOpts = JSON.parse(optsStr)
    } catch (error) {
      console.log(`Error reading '${key}' value from localStorage`, error)
    }
  }
  return userOpts
}

const bundle = {
  name: 'ipfs',

  reducer(state, { type, payload, error }) {
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
      return Object.assign({}, state, { ipfsReady: false, error: error })
    }

    return state
  },

  getExtraArgs() {
    return { getIpfs: () => globalThis._ipfs }
  },

  selectIpfsReady: state => state.ipfs.ipfsReady,

  selectIpfsIdentity: state => state.ipfs.identity,

  doInitIpfs: () => async ({ dispatch, getState }) => {
    console.log('Looking for IPFS')
    console.time('IPFS_INIT')
    dispatch({ type: 'IPFS_INIT_STARTED' })

    let ipfs = null
    let identity = null

    // TODO: refactor to use https://github.com/ipfs-shipyard/ipfs-provider

    // TRY kubo-rpc-client (kubo-rpc-client)
    const apiOpts = Object.assign(
      {},
      getState().ipfs.apiOpts,
      getUserOpts('ipfsApi')
    )
    try {
      console.time('IPFS_INIT_API')
      console.log('Trying kubo-rpc-client', apiOpts)
      console.info(
        "🎛️ Customise your kubo-rpc-client opts by setting an `ipfsApi` value in localStorage. e.g. localStorage.setItem('ipfsApi', JSON.stringify({port: '1337'}))"
      )
      ipfs = create()
      identity = await ipfs.id()
      console.log('kubo-rpc-client ready!', identity)
      globalThis._ipfs = ipfs
      console.timeEnd('IPFS_INIT_API')
      console.timeEnd('IPFS_INIT')
      return dispatch({
        type: 'IPFS_INIT_FINISHED',
        payload: {
          identity,
          provider: 'kubo-rpc-client',
          apiOpts
        }
      })
    } catch (error) {
      console.log('No ipfs-api found', error)
    }

    const ipfsOpts = getUserOpts('ipfsOpts')
    // TRY js-ipfs!
    try {
      console.time('HELIA_INIT')
      console.log('Trying to start in-page helia', ipfsOpts)
      console.info(
        "🎛️ Customise your helia opts by setting an `ipfsOpts` value in localStorage. e.g. localStorage.setItem('ipfsOpts', JSON.stringify({relay: {enabled: true}}))"
      )
      const ipfs = await initHelia()
      console.log('got ipfs')
      // identity = await ipfs.libp2p.identify()
      identity = 'helia-TBD'
      console.log('in-page helia instance ready!', identity)
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
      if (error.message && error.message.includes('subtle is undefined')) {
        console.warn('IPLD Explorer requires access to window.crypto, redirecting to canonical URL that is known to provide it in all browsers')
        // This error means js-ipfs was loaded in a context that is not marked
        // as Secure Context by the browser vendor.  (example: *.localhost in
        // Firefox until https://bugzilla.mozilla.org/show_bug.cgi?id=1220810
        // is addresssed)
        // This is difficult to debug for regular user, as Explorer simply fails to load anything from IPFS.
        // For now, we detect this failure and redirect to canonical version with TLS, so it always works.
        const url = new URL('https://explore.ipld.io/?x-ipfs-companion-no-redirect')
        // url.hash = window.location.hash
        // window.location.replace(url.toString())
        return
      }
      console.log('Failed to initialise helia', error)
      console.timeEnd('IPFS_INIT')
      return dispatch({ type: 'IPFS_INIT_FAILED', error })
    }
  }
}
export default bundle

async function initHelia() {
        const blockstore = new MemoryBlockstore()

        // application-specific data lives in the datastore
        const datastore = new MemoryDatastore()

        // libp2p is the networking layer that underpins Helia
        // Make sure to stick libp2p here when running react in strict mode
        const libp2p = await createLibp2p({
          datastore,
          transports: [
            webSockets()
          ],
          connectionEncryption: [
            noise()
          ],
          streamMuxers: [
            yamux()
          ],
          peerDiscovery: [
            bootstrap({
              list: [
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
              ]
            })
          ],
          services: {
            identify: identifyService()
          }
        })
        console.info('Starting Helia')
        const helia = await createHelia({
          datastore,
          blockstore,
          libp2p
        })

        console.log('helia', helia)

        return helia
}
