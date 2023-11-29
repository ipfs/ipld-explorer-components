/* globals globalThis */
import { type Helia } from '@helia/interface'
import { create as createKuboClient, type IPFSHTTPClient } from 'kubo-rpc-client'

import initHelia from '../lib/init-helia'

interface HeliaBundleState {
  apiOpts: Record<string, string>
  instance: Helia | null
  error: Error | null
  kuboClient: IPFSHTTPClient | null
}

const defaultState: HeliaBundleState = {
  apiOpts: {
    host: '127.0.0.1',
    port: '5001',
    protocol: 'http'
  },
  instance: null,
  error: null,
  kuboClient: null
}

function getUserOpts (key: string): Record<string, unknown> {
  let userOpts = {}
  if (globalThis.localStorage != null) {
    try {
      const optsStr = globalThis.localStorage.getItem(key) ?? '{}'
      userOpts = JSON.parse(optsStr)
    } catch (error) {
      console.error(`Error reading '${key}' value from localStorage`, error)
    }
  }
  return userOpts
}

const bundle = {
  name: 'helia',
  reducer (state: HeliaBundleState, { type, payload, error }: { type: string, payload: Partial<HeliaBundleState>, error?: Error }) {
    state = state ?? defaultState
    if (type === 'HELIA_INIT_FINISHED') {
      return Object.assign({}, state, {
        instance: payload.instance ?? state.instance,
        kuboClient: payload.kuboClient ?? state.kuboClient,
        apiOpts: payload.apiOpts ?? state.apiOpts,
        error: null
      })
    }

    if (type === 'HELIA_INIT_FAILED') {
      return Object.assign({}, state, { error })
    }

    return state
  },

  selectKuboClient: ({ helia }: { helia: HeliaBundleState }): IPFSHTTPClient | null => helia.kuboClient,
  selectHelia: ({ helia }: { helia: HeliaBundleState }) => helia.instance,

  selectHeliaReady: ({ helia }: { helia: HeliaBundleState }) => helia.instance !== null,

  selectHeliaIdentity: ({ helia }: { helia: HeliaBundleState }) => {
    const identifyService = helia.instance?.libp2p.services?.identify as { host: Record<'agentVersion', string> }

    return identifyService?.host?.agentVersion.split(' ')[0] ?? 'null'
  },

  doInitHelia: () => async ({ dispatch, getState }: any) => {
    dispatch({ type: 'HELIA_INIT_STARTED' })

    const apiOpts = Object.assign(
      {},
      getState().helia.apiOpts,
      getUserOpts('ipfsApi')
    )

    try {
      console.info(
        "🎛️ Customise your kubo-rpc-client opts by setting an `ipfsApi` value in localStorage. e.g. localStorage.setItem('ipfsApi', JSON.stringify({port: '1337'}))"
      )
      const kuboClient = createKuboClient(apiOpts)
      console.time('HELIA_INIT')
      const helia = await initHelia(kuboClient)
      console.timeEnd('HELIA_INIT')
      return dispatch({
        type: 'HELIA_INIT_FINISHED',
        payload: {
          apiOpts,
          kuboClient,
          instance: helia,
          provider: 'helia'
        }
      })
    } catch (error) {
      return dispatch({ type: 'HELIA_INIT_FAILED', error })
    }
  }
}
export default bundle
