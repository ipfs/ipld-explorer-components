import Cid from 'cids'
import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import resolveIpldPath from '../lib/resolve-ipld-path'
import parseIpldPath from '../lib/parse-ipld-path'

// All known IPLD formats
import ipldBitcoin from 'ipld-bitcoin'
import ipldDagCbor from 'ipld-dag-cbor'
import ipldDagPb from 'ipld-dag-pb'
import { ethAccountSnapshot, ethBlock, ethBlockList, ethStateTrie,
  ethStorageTrie, ethTxTrie, ethTx } from 'ipld-ethereum'
import ipldGit from 'ipld-git'
import ipldRaw from 'ipld-raw'
import ipldZcash from 'ipld-zcash'

// Find all the nodes and path boundaries traversed along a given path
const makeBundle = (fetchIpld) => {
  // Lazy load ipld because it is a large dependency
  let IpldResolver = null

  const bundle = createAsyncResourceBundle({
    name: 'explore',
    actionBaseType: 'EXPLORE',
    getPromise: async (args) => {
      const { store, getIpfs } = args
      let path = store.selectExplorePathFromHash()
      if (!path) return null
      const pathParts = parseIpldPath(path)
      if (!pathParts) return null
      const { cidOrFqdn, rest } = pathParts
      try {
        if (!IpldResolver) {
          IpldResolver = await fetchIpld()
        }
        const ipldGet = makeIpldResolver(IpldResolver, getIpfs)
        // TODO: handle ipns, which would give us a fqdn in the cid position.
        const cid = new Cid(cidOrFqdn)
        const {
          targetNode,
          canonicalPath,
          localPath,
          nodes,
          pathBoundaries
        } = await resolveIpldPath(ipldGet, cid.toBaseEncodedString(), rest)

        return {
          path,
          targetNode,
          canonicalPath,
          localPath,
          nodes,
          pathBoundaries
        }
      } catch (error) {
        console.log('Failed to resolve path', path, error)
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
    const hash = path ? `#/explore${ensureLeadingSlash(path)}` : `#/explore`
    store.doUpdateHash(hash)
  }

  return bundle
}

function ensureLeadingSlash (str) {
  if (str.startsWith('/')) return str
  return `/${str}`
}

function makeIpldResolver (IpldResolver, getIpfs) {
  return ipldGet.bind(null, IpldResolver, getIpfs)
}

export function ipldGet (IpldResolver, getIpfs, cid, path, options) {
  return new Promise((resolve, reject) => {
    const ipld = new IpldResolver({
      blockService: getIpfs().block,
      formats: [
        ipldBitcoin, ipldDagCbor, ipldDagPb, ethAccountSnapshot, ethBlock,
        ethBlockList, ethStateTrie, ethStorageTrie, ethTxTrie, ethTx,
        ipldGit, ipldRaw, ipldZcash
      ]
    })
    ipld.get(new Cid(cid), path, options, (err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

export default makeBundle
