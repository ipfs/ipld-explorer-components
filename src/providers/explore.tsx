import { CID } from 'multiformats/cid'
import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react'
import { type LinkObject } from '../components/object-info/links-table'
import { ensureLeadingSlash } from '../lib/helpers.js'
import { importCar } from '../lib/import-car.js'
import { parseIpldPath } from '../lib/parse-ipld-path.js'
import { resolveIpldPath } from '../lib/resolve-ipld-path.js'
import { useHelia } from './helia.js'
import type IpldExploreError from '../lib/errors.js'
import type { NormalizedDagNode } from '../types.js'

interface ExploreContextProps {
  exploreState: ExploreState
  explorePathPrefix: string
  isLoading: boolean
  setExplorePath(path: string | null): void
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

const processPath = (path: string | null, pathPrefix: string): string | null => {
  let newPath = path
  if (newPath != null) {
    if (newPath.includes(pathPrefix)) {
      newPath = newPath.slice(pathPrefix.length)
    }
    if (newPath.startsWith('/')) {
      newPath = newPath.slice(1)
    }
    if (newPath === '') {
      newPath = null
    } else {
      newPath = decodeURIComponent(newPath)
    }
  }
  return newPath
}

const defaultState: ExploreState = {
  path: null,
  targetNode: null,
  canonicalPath: '',
  localPath: '',
  nodes: [],
  pathBoundaries: [],
  error: null
}

export interface ExploreProviderProps {
  children?: ReactNode | ReactNode[]
  state?: Partial<ExploreState>
  explorePathPrefix?: string
}

export const ExploreProvider = ({ children, state, explorePathPrefix = '#/explore' }: ExploreProviderProps): React.ReactNode => {
  if (state == null) {
    state = {
      path: processPath(window.location.hash, explorePathPrefix)
    }
  } else {
    if (state.path === '') {
      state.path = null
    } else if (state.path != null) {
      state.path = processPath(state.path, explorePathPrefix)
    }
  }
  const [exploreState, setExploreState] = useState<ExploreState>({ ...defaultState, ...state })
  const { helia } = useHelia()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { path } = exploreState

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      if (path == null || helia == null) {
        return
      }
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

        setExploreState((curr) => ({
          ...curr,
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
    })().catch((err) => {
      console.error('Error fetching explore data', err)
      setExploreState((prevState) => ({ ...prevState, error: err }))
    }).finally(() => {
      setIsLoading(false)
    })
  }, [helia, path])

  const setExplorePath = (path: string | null): void => {
    const newPath = processPath(path, explorePathPrefix)
    if (newPath != null && !window.location.href.includes(encodeURI(newPath))) {
      throw new Error('setExplorePath should only be used to update the state, not the URL. If you are using a routing library that doesn\'t allow you to listen to hashchange events, ensure the URL is updated prior to calling setExplorePath.')
    }
    setExploreState((exploreState) => ({
      ...exploreState,
      path: newPath
    }))
  }

  const doExploreLink = (link: LinkObject): void => {
    const { nodes, pathBoundaries } = exploreState
    const cid = nodes[0].cid
    const pathParts = pathBoundaries.map((p) => p.path)

    if (link?.path != null) {
      pathParts.push(link.path)
    }
    pathParts.unshift(cid)
    const path = pathParts.map((part) => encodeURIComponent(part)).join('/')
    const hash = `${explorePathPrefix}/${path}`
    window.location.hash = hash
    setExplorePath(path)
  }

  /**
   * @deprecated - use setExplorePath instead
   */
  const doExploreUserProvidedPath = (path: string): void => {
    const hash = path != null ? `${explorePathPrefix}${ensureLeadingSlash(path)}` : explorePathPrefix
    window.location.hash = hash
  }

  const doUploadUserProvidedCar = useCallback(async (file: File, uploadImage: string): Promise<void> => {
    if (helia == null) {
      console.error('FIXME: Helia not ready yet, but user tried to upload a car file')
      return
    }
    try {
      const rootCid = await importCar(file, helia)
      const hash = rootCid.toString() != null ? `${explorePathPrefix}${ensureLeadingSlash(rootCid.toString())}` : explorePathPrefix
      window.location.hash = hash

      const imageFileLoader = document.getElementById('car-loader-image') as HTMLImageElement
      if (imageFileLoader != null) {
        imageFileLoader.src = uploadImage
      }
    } catch (err) {
      console.error('Could not import car file', err)
    }
  }, [explorePathPrefix, helia])

  return (
    <ExploreContext.Provider value={{ exploreState, explorePathPrefix, isLoading, doExploreLink, doExploreUserProvidedPath, doUploadUserProvidedCar, setExplorePath }}>
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
