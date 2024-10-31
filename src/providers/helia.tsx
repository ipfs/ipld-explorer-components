import { type Helia } from '@helia/interface'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import packageJson from '../../package.json'
import initHelia from '../lib/init-helia.js'
import type { KuboGatewayOptions } from '../types.js'

interface HeliaContextProps {
  kuboGatewayOptions: KuboGatewayOptions
  error: Error | null
  helia: Helia | null
  selectHeliaReady(): boolean
  selectHeliaIdentity(): string
  doInitHelia(): Promise<void>
  setKuboGatewayOptions(kuboGatewayOptions: Partial<KuboGatewayOptions>): void
}

const defaultKuboGatewayOptions: KuboGatewayOptions = {
  host: '127.0.0.1',
  port: '8080',
  protocol: 'http',
  trustlessBlockBrokerConfig: {
    init: {
      allowLocal: true
    }
  }
}

const getDefaultKuboGatewayOptions = (): KuboGatewayOptions => {
  const localStorageKuboGatewayOptions = localStorage.getItem('kuboGateway')
  if (localStorageKuboGatewayOptions != null) {
    try {
      const kuboGatewaySettings = JSON.parse(localStorageKuboGatewayOptions) as KuboGatewayOptions
      return { ...defaultKuboGatewayOptions, ...kuboGatewaySettings }
    } catch (e) {
      console.error('getDefaultKuboGatewayOptions error', e)
    }
  }
  return defaultKuboGatewayOptions
}

const HeliaContext = createContext<HeliaContextProps | undefined>(undefined)

export const HeliaProvider = ({ children }: React.ComponentProps<any>): any => {
  const [helia, setHelia] = useState<Helia | null>(null)
  const [kuboGatewayOptions, setKuboGatewayOptions] = useState<KuboGatewayOptions>(getDefaultKuboGatewayOptions())
  const [error, setError] = useState<Error | null>(null)

  const selectHeliaReady = (): boolean => helia !== null

  const selectHeliaIdentity = (): string => {
    const heliaHttpVersion = packageJson.dependencies['@helia/http']
    return `@helia/http@${heliaHttpVersion}`
  }

  const setKuboGatewayOptionsPublic = (kuboGatewayOptions: Partial<KuboGatewayOptions>): void => {
    setKuboGatewayOptions((current) => ({ ...current, ...kuboGatewayOptions }))
  }

  const doInitHelia = useCallback(async (): Promise<void> => {
    try {
      const helia = await initHelia(kuboGatewayOptions)
      setError(null)
      setHelia(helia)
    } catch (error: any) {
      console.error('doInitHelia error', error)
      setError(error)
      setHelia(null)
    }
  }, [kuboGatewayOptions, setHelia])

  useEffect(() => {
    void doInitHelia()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <HeliaContext.Provider value={{ helia, error, kuboGatewayOptions, selectHeliaReady, selectHeliaIdentity, doInitHelia, setKuboGatewayOptions: setKuboGatewayOptionsPublic }}>
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
