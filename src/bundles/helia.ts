/* globals globalThis */
import { type Helia } from '@helia/interface'
import initHelia from '../lib/init-helia.js'
import type { KuboGatewayOptions } from '../types.d.js'

interface HeliaBundleState {
  kuboGatewayOptions: KuboGatewayOptions
  error: Error | null
}

const defaultState: HeliaBundleState = {
  kuboGatewayOptions: {
    host: '127.0.0.1',
    port: '8080',
    protocol: 'http'
  },
  error: null
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

let helia: Helia | null = null
const bundle = {
  name: 'helia',
  reducer (state: HeliaBundleState, { type, payload, error }: { type: string, payload: Partial<HeliaBundleState>, error?: Error }) {
    state = state ?? defaultState
    if (type === 'HELIA_INIT_FINISHED') {
      return Object.assign({}, state, {
        kuboGatewayOptions: payload.kuboGatewayOptions ?? state.kuboGatewayOptions,
        error: null
      })
    }

    if (type === 'HELIA_INIT_FAILED') {
      return Object.assign({}, state, { error })
    }

    return state
  },

  selectHelia: () => helia,

  selectHeliaReady: () => helia !== null,

  selectHeliaIdentity: () => {
    return '@helia/http@^1.0.1'
  },

  doInitHelia: () => async ({ dispatch, getState }: any) => {
    dispatch({ type: 'HELIA_INIT_STARTED' })

    const kuboGatewayOptions = Object.assign(
      {},
      getState().helia.kuboGatewayOptions,
      getUserOpts('kuboGateway')
    )

    try {
      console.info(
        "🎛️ Customise your Kubo gateway opts by setting an `kuboGateway` value in localStorage. e.g. localStorage.setItem('kuboGateway', JSON.stringify({port: '1337'}))"
      )
      console.time('HELIA_INIT')
      helia = await initHelia(kuboGatewayOptions)
      console.timeEnd('HELIA_INIT')
      return dispatch({
        type: 'HELIA_INIT_FINISHED',
        payload: {
          kuboGatewayOptions,
          provider: 'helia'
        }
      })
    } catch (error) {
      return dispatch({ type: 'HELIA_INIT_FAILED', error })
    }
  }
}
export default bundle
