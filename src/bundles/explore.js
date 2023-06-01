import { CID } from 'multiformats/cid'
import { createAsyncResourceBundle, createSelector } from 'redux-bundler'

import { ensureLeadingSlash } from '../lib/helpers'
import { importCar } from '../lib/import-car'
import parseIpldPath from '../lib/parse-ipld-path.js'
import resolveIpldPath from '../lib/resolve-ipld-path.js'

const getCidFromCidOrFqdn = (cidOrFqdn) => {
  if (cidOrFqdn.startsWith('/ipfs/')) {
    return cidOrFqdn.slice('/ipfs/'.length)
  } else if (cidOrFqdn.startsWith('/ipns/')) {
    // TODO: handle ipns
    throw new Error('ipns not supported yet')
  } else if (cidOrFqdn.startsWith('/')) {
    return cidOrFqdn.slice(1)
  }
  return cidOrFqdn
}

// Find all the nodes and path boundaries traversed along a given path
const makeBundle = () => {
  // Lazy load ipld because it is a large dependency
  const bundle = createAsyncResourceBundle({
    name: 'explore',
    actionBaseType: 'EXPLORE',
    getPromise: async (args) => {
      const { store, getIpfs } = args
      const path = store.selectExplorePathFromHash()
      if (!path) return null
      const pathParts = parseIpldPath(path)
      if (!pathParts) return null
      const { cidOrFqdn, rest } = pathParts
      try {
        // TODO: handle ipns, which would give us a fqdn in the cid position.
        const cid = CID.parse(getCidFromCidOrFqdn(cidOrFqdn))
        const {
          targetNode,
          canonicalPath,
          localPath,
          nodes,
          pathBoundaries
        } = await resolveIpldPath(await getIpfs(), cid, rest)

        return {
          path,
          targetNode,
          canonicalPath,
          localPath,
          nodes,
          pathBoundaries
        }
      } catch (error) {
        console.warn('Failed to resolve path', path, error)
        return { path, error: error.toString() }
      }
    },
    staleAfter: Infinity,
    checkIfOnline: false
  })

  bundle.selectExplorePathFromHash = createSelector(
    'selectRouteInfo',
    (routeInfo) => {
      if (!routeInfo.url.startsWith('/explore')) return
      const path = routeInfo.url.slice('/explore'.length)
      return decodeURIComponent(path)
    }
  )

  // Fetch the explore data when the address in the url hash changes.
  bundle.reactExploreFetch = createSelector(
    'selectIpfsReady',
    'selectExploreIsLoading',
    'selectExploreIsWaitingToRetry',
    'selectExplorePathFromHash',
    'selectExplore',
    (ipfsReady, isLoading, isWaitingToRetry, explorePathFromHash, obj) => {
      // Wait for ipfs or the pending request to complete
      if (!ipfsReady || isLoading || isWaitingToRetry) return false
      // Theres no url path and no data so nothing to do.
      if (!explorePathFromHash && !obj) return false
      // We already have the data for the path.
      if (obj && explorePathFromHash === obj.path) return false

      return { actionCreator: 'doFetchExplore' }
    }
  )

  // Unpack append a dag link target to the current path and update the url hash
  bundle.doExploreLink = (link) => ({ store }) => {
    const { nodes, pathBoundaries } = store.selectExplore()
    const cid = nodes[0].cid
    const pathParts = pathBoundaries.map(p => p.path)
    // add the extra path step from the link to the end
    if (link && link.path) {
      pathParts.push(link.path)
    }
    // add the root cid to the start
    pathParts.unshift(cid)
    const path = pathParts.join('/')
    const hash = `#/explore/${path}`
    store.doUpdateHash(hash)
  }

  // validate user submitted path and put it in url hash fragment
  bundle.doExploreUserProvidedPath = (path) => ({ store }) => {
    const hash = path ? `#/explore${ensureLeadingSlash(path)}` : '#/explore'
    store.doUpdateHash(hash)
  }

  bundle.doUploadUserProvidedCar = (file, uploadImage) => async (args) => {
    const { store, getIpfs } = args
    try {
      const rootCid = await importCar(file, getIpfs())
      const hash = rootCid.toString() ? `#/explore${ensureLeadingSlash(rootCid.toString())}` : '#/explore'
      store.doUpdateHash(hash)

      //  Grab the car loader image so we can change it's state
      const imageFileLoader = document.getElementById('car-loader-image')
      imageFileLoader.src = uploadImage
    } catch (err) {
      console.error('Could not import car file', err)
    }
  }
  return bundle
}

export default makeBundle
