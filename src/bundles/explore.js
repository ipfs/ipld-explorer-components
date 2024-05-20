import { CID } from 'multiformats/cid'
import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import { ensureLeadingSlash } from '../lib/helpers'
import { importCar } from '../lib/import-car'
import parseIpldPath from '../lib/parse-ipld-path'
import resolveIpldPath from '../lib/resolve-ipld-path'

const getCidFromCidOrFqdn = (cidOrFqdn) => {
  if (cidOrFqdn.startsWith('/ipfs/')) {
    return cidOrFqdn.slice('/ipfs/'.length)
  }
  if (cidOrFqdn.startsWith('/ipns/')) {
    // TODO: handle ipns
    throw new Error('ipns not supported yet')
  }
  if (cidOrFqdn.startsWith('/')) {
    return cidOrFqdn.slice(1)
  }
  return cidOrFqdn
}

/**
 * fix BigInt serialization until https://tc39.es/proposal-bigint/#sec-serializejsonproperty is implemented
 *
 * @see https://github.com/GoogleChromeLabs/jsbi/issues/30
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
 */
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return this.toString()
}

// Find all the nodes and path boundaries traversed along a given path
const makeBundle = () => {
  const bundle = createAsyncResourceBundle({
    name: 'explore',
    actionBaseType: 'EXPLORE',
    getPromise: async ({ store }) => {
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
        } = await resolveIpldPath(store.selectHelia(), cid, rest)

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
        return { path, error }
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

  /**
   * Fetch the explore data when the address in the url hash changes.
   * Note that this is called automatically by redux-bundler
   *
   * @see https://reduxbundler.com/api-reference/bundle#bundle.reactx
   */
  bundle.reactExploreFetch = createSelector(
    'selectHeliaReady',
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
    const path = pathParts.map((part) => encodeURIComponent(part)).join('/')
    const hash = `#/explore/${path}`
    store.doUpdateHash(hash)
  }

  // validate user submitted path and put it in url hash fragment
  bundle.doExploreUserProvidedPath = (path) => ({ store }) => {
    const hash = path ? `#/explore${ensureLeadingSlash(path)}` : '#/explore'
    store.doUpdateHash(hash)
  }

  bundle.doUploadUserProvidedCar = (file, uploadImage) => async ({ store }) => {
    try {
      const rootCid = await importCar(file, await store.selectHelia())
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
