import { CID } from 'multiformats/cid'
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react'
import { ensureLeadingSlash } from '../lib/helpers.js'
import { importCar } from '../lib/import-car.js'
import { parseIpldPath } from '../lib/parse-ipld-path.js'
import { resolveIpldPath } from '../lib/resolve-ipld-path.js'
import { useHelia } from './helia.js'
import type { RowLinkClickEventData } from '../components/object-info/LinksTable.jsx'
import type IpldExploreError from '../lib/errors.js'
import type { NormalizedDagNode } from '../types.js'

interface ExploreContextProps {
  exploreState: ExploreState
  // explorePathFromHash: string | null
  doExploreLink(link: any): void
  doExploreUserProvidedPath(path: string): void
  doUploadUserProvidedCar(file: File, uploadImage: string): Promise<void>
}

export interface ExploreState {
  path: string | null
  /**
   * The NormalizedDagNode version of the currently viewed dag node
   */
  targetNode: NormalizedDagNode | null

  /**
   * The absolute, canonical, path to the currently viewed node, including the root CID.
   */
  canonicalPath: string

  /**
   * The currently displayed path, relative to the root CID.
   */
  localPath: string
  nodes: any[]
  pathBoundaries: any[]
  error: IpldExploreError | null
  explorePathFromHash: string | null
}

export const ExploreContext = createContext<ExploreContextProps | undefined>(undefined)

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
  return CID.parse(cidOrFqdn)
}

const defaultState: ExploreState = {
  path: null,
  targetNode: null,
  canonicalPath: '',
  localPath: '',
  nodes: [],
  pathBoundaries: [],
  error: null,
  explorePathFromHash: null
}

export const ExploreProvider = ({ children, state = defaultState }: { children?: ReactNode, state?: ExploreState }): React.ReactNode => {
  const [exploreState, setExploreState] = useState<ExploreState>({ ...state, explorePathFromHash: window.location.hash.slice('#/explore'.length) })
  const { helia } = useHelia()
  const { explorePathFromHash } = exploreState

  const fetchExploreData = useCallback(async (path: string): Promise<void> => {
    // Clear the target node when a new path is requested
    setExploreState((exploreState) => ({
      ...exploreState,
      targetNode: null
    }))
    const pathParts = parseIpldPath(path)
    if (pathParts == null || helia == null) return

    const { cidOrFqdn, rest } = pathParts
    try {
      const cid = getCidFromCidOrFqdn(cidOrFqdn)
      const { targetNode, canonicalPath, localPath, nodes, pathBoundaries } = await resolveIpldPath(helia, cid, rest)

      setExploreState(({ explorePathFromHash }) => ({
        explorePathFromHash,
        path,
        targetNode,
        canonicalPath,
        localPath,
        nodes,
        pathBoundaries,
        error: null
      }))
    } catch (error: any) {
      console.warn('Failed to resolve path', path, error)
      setExploreState((prevState) => ({ ...prevState, error }))
    }
  }, [helia])

  const doExploreLink = (link: RowLinkClickEventData): void => {
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

      setExploreState((state) => ({
        ...state,
        explorePathFromHash
      }))
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  useEffect(() => {
    // if explorePathFromHash or helia change and are not null, fetch the data
    // We need to check for helia because the helia provider is async and may not be ready yet
    if (explorePathFromHash != null && helia != null) {
      void (async () => {
        await fetchExploreData(decodeURIComponent(explorePathFromHash))
      })()
    }
  }, [helia, explorePathFromHash])

  if (helia == null) {
    return null
  }

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
