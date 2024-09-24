import { CID } from 'multiformats/cid'
import React, { createContext, useContext, useState, useEffect, type ReactNode, type Provider } from 'react'
import { ensureLeadingSlash } from '../lib/helpers.js'
import { importCar } from '../lib/import-car.js'
import { parseIpldPath } from '../lib/parse-ipld-path.js'
import { resolveIpldPath } from '../lib/resolve-ipld-path.js'
import { useHelia } from './helia.js'

interface ExploreContextProps {
  exploreState: ExploreState
  doExploreLink(link: any): void
  doExploreUserProvidedPath(path: string): void
  doUploadUserProvidedCar(file: File, uploadImage: string): Promise<void>
}

interface ExploreState {
  path: string | null
  targetNode: any
  canonicalPath: string
  localPath: string
  nodes: any[]
  pathBoundaries: any[]
  error: Error | null
}

export const ExploreContext = createContext<ExploreContextProps | undefined>(undefined)

export const ExploreProvider = ({ children }: { children: ReactNode }): any => {
  const [exploreState, setExploreState] = useState<ExploreState>({
    path: null,
    targetNode: null,
    canonicalPath: '',
    localPath: '',
    nodes: [],
    pathBoundaries: [],
    error: null
  })

  const thing = useHelia()

  const helia = thing.selectHelia()

  const getCidFromCidOrFqdn = (cidOrFqdn: CID | string): CID => {
    if (typeof cidOrFqdn === 'object' && 'multihash' in cidOrFqdn) {
      return cidOrFqdn
    }
    if (cidOrFqdn.toString().startsWith('/ipfs/')) {
      return CID.parse(cidOrFqdn.slice('/ipfs/'.length))
    }
    if (cidOrFqdn.toString().startsWith('/ipns/')) {
      throw new Error('ipns not supported yet')
    }
    if (cidOrFqdn.startsWith('/')) {
      return CID.parse(cidOrFqdn.slice(1))
    }
    throw new Error('Invalid CID or FQDN')
  }

  const fetchExploreData = async (path: string): Promise<void> => {
    const pathParts = parseIpldPath(path)
    if (pathParts == null) return

    const { cidOrFqdn, rest } = pathParts
    try {
      const cid = getCidFromCidOrFqdn(cidOrFqdn)
      const { targetNode, canonicalPath, localPath, nodes, pathBoundaries } = await resolveIpldPath(helia, cid, rest)

      setExploreState({
        path,
        targetNode,
        canonicalPath,
        localPath,
        nodes,
        pathBoundaries,
        error: null
      })
    } catch (error: any) {
      console.warn('Failed to resolve path', path, error)
      setExploreState((prevState) => ({ ...prevState, error }))
    }
  }

  const doExploreLink = (link: any): void => {
    const { nodes, pathBoundaries } = exploreState
    const cid = nodes[0].cid
    const pathParts = pathBoundaries.map((p) => p.path)
    if (link?.path != null) {
      pathParts.push(link.path)
    }
    pathParts.unshift(cid)
    const path = pathParts.map((part) => encodeURIComponent(part)).join('/')
    const hash = `#/explore/${path}`
    window.location.hash = hash
  }

  const doExploreUserProvidedPath = (path: string): void => {
    const hash = path != null ? `#/explore${ensureLeadingSlash(path)}` : '#/explore'
    window.location.hash = hash
  }

  const doUploadUserProvidedCar = async (file: File, uploadImage: string): Promise<void> => {
    try {
      const rootCid = await importCar(helia, file)
      const hash = rootCid.toString() != null ? `#/explore${ensureLeadingSlash(rootCid.toString())}` : '#/explore'
      window.location.hash = hash

      const imageFileLoader = document.getElementById('car-loader-image') as HTMLImageElement
      if (imageFileLoader != null) {
        imageFileLoader.src = uploadImage
      }
    } catch (err) {
      console.error('Could not import car file', err)
    }
  }

  useEffect(() => {
    const handleHashChange = (): void => {
      const path = window.location.hash.slice('#/explore'.length)
      if (path != null) {
        void (async () => {
          await fetchExploreData(decodeURIComponent(path))
        })()
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <ExploreContext.Provider value={{ exploreState, doExploreLink, doExploreUserProvidedPath, doUploadUserProvidedCar }}>
      {children}
    </ExploreContext.Provider>
  )
}

export const useExplore = (): ExploreContextProps => {
  const context = useContext(ExploreContext)
  if (context === undefined) {
    throw new Error('useExplore must be used within an ExploreProvider')
  }
  return context
}
