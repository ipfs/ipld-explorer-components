import { type Helia } from '@helia/interface'
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import packageJson from '../../package.json'
import initHelia from '../lib/init-helia.js'
import type { KuboGatewayOptions } from '../types.js'

interface HeliaBundleState {
  kuboGatewayOptions: KuboGatewayOptions
  error: Error | null
}

interface HeliaContextProps {
  state: HeliaBundleState
  selectHelia(): Helia | null
  selectHeliaReady(): boolean
  selectHeliaIdentity(): string
  doInitHelia(): Promise<void>
}

const defaultState: HeliaBundleState = {
  kuboGatewayOptions: {
    host: '127.0.0.1',
    port: '8080',
    protocol: 'http',
    trustlessBlockBrokerConfig: {
      init: {
        allowLocal: true
      }
    }
  },
  error: null
}

const HeliaContext = createContext<HeliaContextProps | undefined>(undefined)

const heliaReducer = (state: HeliaBundleState, action: { type: string, payload?: Partial<HeliaBundleState>, error?: Error }): HeliaBundleState => {
  switch (action.type) {
    case 'HELIA_INIT_FINISHED':
      return {
        ...state,
        kuboGatewayOptions: action.payload?.kuboGatewayOptions ?? state.kuboGatewayOptions,
        error: null
      }
    case 'HELIA_INIT_FAILED':
      return {
        ...state,
        error: action.error ?? null
      }
    default:
      return state
  }
}

export const HeliaProvider = ({ children }: { children: ReactNode }): any => {
  const [state, dispatch] = useReducer(heliaReducer, defaultState)
  let helia: Helia | null = null

  const selectHelia = (): Helia | null => helia

  const selectHeliaReady = (): boolean => helia !== null

  const selectHeliaIdentity = (): string => {
    const heliaHttpVersion = packageJson.dependencies['@helia/http']
    return `@helia/http@${heliaHttpVersion}`
  }

  const doInitHelia = async (): Promise<void> => {
    dispatch({ type: 'HELIA_INIT_STARTED' })
    try {
      helia = await initHelia(state.kuboGatewayOptions)
      dispatch({ type: 'HELIA_INIT_FINISHED', payload: { kuboGatewayOptions: state.kuboGatewayOptions } })
    } catch (error: any) {
      dispatch({ type: 'HELIA_INIT_FAILED', error })
    }
  }

  useEffect(() => {
    void doInitHelia()
  }, [])

  return (
    <HeliaContext.Provider value={{ state, selectHelia, selectHeliaReady, selectHeliaIdentity, doInitHelia }}>
      {children}
    </HeliaContext.Provider>
  )
}

export const useHelia = (): HeliaContextProps => {
  const context = useContext(HeliaContext)
  if (context === undefined) {
    throw new Error('useHelia must be used within a HeliaProvider')
  }
  return context
}
