import { type Helia } from '@helia/interface'
import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react'
import packageJson from '../../package.json'
import initHelia from '../lib/init-helia.js'
import type { KuboGatewayOptions } from '../types.js'

interface HeliaBundleState {
  kuboGatewayOptions: KuboGatewayOptions
  error: Error | null
}

interface HeliaContextProps {
  state: HeliaBundleState
  helia: Helia | null
  // selectHelia(): Helia | null
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

export const HeliaProvider = ({ children }: React.ComponentProps<any>): any => {
  const [state, dispatch] = useReducer(heliaReducer, defaultState)
  const [helia, setHelia] = useState<Helia | null>(null)

  const selectHeliaReady = (): boolean => helia !== null

  const selectHeliaIdentity = (): string => {
    const heliaHttpVersion = packageJson.dependencies['@helia/http']
    return `@helia/http@${heliaHttpVersion}`
  }

  const doInitHelia = useCallback(async (): Promise<void> => {
    dispatch({ type: 'HELIA_INIT_STARTED' })
    try {
      const helia = await initHelia(state.kuboGatewayOptions)
      setHelia(helia)
      dispatch({ type: 'HELIA_INIT_FINISHED', payload: { kuboGatewayOptions: state.kuboGatewayOptions } })
    } catch (error: any) {
      console.error('doInitHelia error', error)
      dispatch({ type: 'HELIA_INIT_FAILED', error })
    }
  }, [state.kuboGatewayOptions, setHelia, dispatch])

  useEffect(() => {
    void doInitHelia()
  }, [])

  return (
    <HeliaContext.Provider value={{ state, helia, selectHeliaReady, selectHeliaIdentity, doInitHelia }}>
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
