import { CID } from 'multiformats/cid'
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react'
import { ensureLeadingSlash } from '../lib/helpers.js'
import { importCar } from '../lib/import-car.js'
import { parseIpldPath } from '../lib/parse-ipld-path.js'
import { resolveIpldPath } from '../lib/resolve-ipld-path.js'
import { useHelia } from './helia.js'
import type IpldExploreError from '../lib/errors.js'

interface ExploreContextProps {
  exploreState: ExploreState
  explorePathFromHash: string | null
  doExploreLink(link: any): void
  doExploreUserProvidedPath(path: string): void
  doUploadUserProvidedCar(file: File, uploadImage: string): Promise<void>
}

interface ExploreState {
  path: string | null
  rootCID: CID | null
  targetNode: any
  canonicalPath: string
  localPath: string
  nodes: any[]
  pathBoundaries: any[]
  error: IpldExploreError | null
}

export const ExploreContext = createContext<ExploreContextProps | undefined>(undefined)

const getCidFromCidOrFqdn = (cidOrFqdn: CID | string): CID => {
  // eslint-disable-next-line no-console
  console.log('cidOrFqdn', cidOrFqdn)
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
  return CID.parse(cidOrFqdn)
}

export const ExploreProvider = ({ children }: { children: ReactNode }): any => {
  const [exploreState, setExploreState] = useState<ExploreState>({
    path: null,
    rootCID: null,
    targetNode: null,
    canonicalPath: '',
    localPath: '',
    nodes: [],
    pathBoundaries: [],
    error: null
  })
  const [explorePathFromHash, setExplorePathFromHash] = useState<string | null>(null)

  const { helia } = useHelia()

  const fetchExploreData = useCallback(async (path: string): Promise<void> => {
    const pathParts = parseIpldPath(path)
    if (pathParts == null || helia == null) return

    const { cidOrFqdn, rest } = pathParts
    try {
      const cid = getCidFromCidOrFqdn(cidOrFqdn)
      // eslint-disable-next-line no-console
      console.log('cidOrFqdn', cidOrFqdn)
      // eslint-disable-next-line no-console
      console.log('getting ready to call resolveIpldPath with:', helia, cid, rest)
      const { targetNode, canonicalPath, localPath, nodes, pathBoundaries } = await resolveIpldPath(helia, cid, rest)

      setExploreState({
        path,
        rootCID: cid,
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
  }, [helia])

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

  const doUploadUserProvidedCar = useCallback(async (file: File, uploadImage: string): Promise<void> => {
    if (helia == null) {
      console.error('FIXME: Helia not ready yet, but user tried to upload a car file')
      return
    }
    try {
      const rootCid = await importCar(file, helia)
      const hash = rootCid.toString() != null ? `#/explore${ensureLeadingSlash(rootCid.toString())}` : '#/explore'
      window.location.hash = hash

      const imageFileLoader = document.getElementById('car-loader-image') as HTMLImageElement
      if (imageFileLoader != null) {
        imageFileLoader.src = uploadImage
      }
    } catch (err) {
      console.error('Could not import car file', err)
    }
  }, [helia])

  useEffect(() => {
    const handleHashChange = (): void => {
      const explorePathFromHash = window.location.hash.slice('#/explore'.length)
      setExplorePathFromHash(explorePathFromHash)

      if (explorePathFromHash != null) {
        void (async () => {
          await fetchExploreData(decodeURIComponent(explorePathFromHash))
        })()
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [helia])

  if (helia == null) {
    return null
  }

  return (
    <ExploreContext.Provider value={{ exploreState, explorePathFromHash, doExploreLink, doExploreUserProvidedPath, doUploadUserProvidedCar }}>
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
