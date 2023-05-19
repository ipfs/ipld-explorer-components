import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import resolveIpldPath from '../lib/resolve-ipld-path'
import parseIpldPath from '../lib/parse-ipld-path'
import { CID } from 'multiformats/cid'
import Cid from 'cids'
import { convert } from 'blockcodec-to-ipld-format'

const getCidFromCidOrFqdn = (cidOrFqdn) => {
    console.log(`cidOrFqdn: `, cidOrFqdn);
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
  let IpldResolver = null
  let ipldFormats = null

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
        // if (!IpldResolver) {
        //   console.log('no ipld resolver, loading')
        //   const { ipld, formats } = await getIpld()
        //   console.log(`ipld formats: `, formats);
        //   console.log(`ipld ipld: `, ipld);

        //   IpldResolver = ipld
        //   ipldFormats = formats
        // }
        // const ipld = makeIpld(IpldResolver, ipldFormats, getIpfs)
        // console.log(`ipld: `, ipld);
        // TODO: handle ipns, which would give us a fqdn in the cid position.
        console.log(`getCidFromCidOrFqdn(cidOrFqdn): `, getCidFromCidOrFqdn(cidOrFqdn));
        const cid = CID.parse(getCidFromCidOrFqdn(cidOrFqdn))
        console.log(`cid: `, cid);
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
      console.log('reactExploreFetch', ipfsReady, isLoading, isWaitingToRetry, explorePathFromHash, obj)
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

  bundle.doUploadUserProvidedCar = (file, uploadImage) => (args) => {
    const { store, getIpfs } = args
    importCar(file, getIpfs()).then(result => {
      const cid = result.root.cid
      const hash = cid.toString() ? `#/explore${ensureLeadingSlash(cid.toString())}` : '#/explore'
      store.doUpdateHash(hash)

      //  Grab the car loader image so we can change it's state
      const imageFileLoader = document.getElementById('car-loader-image')
      imageFileLoader.src = uploadImage
    })
  }
  return bundle
}

async function importCar (file, ipfs) {
  const inStream = file.stream()
  const toIterable = require('stream-to-it')
  for await (const result of ipfs.dag.import(toIterable.source(inStream))) {
    return result
  }
}

function ensureLeadingSlash (str) {
  if (str.startsWith('/')) return str
  return `/${str}`
}

function makeIpld (IpldResolver, ipldFormats, getIpfs) {
  console.group('makeIpld')
  console.log(`IpldResolver: `, IpldResolver);
  console.log(`ipldFormats: `, ipldFormats);
  console.log(`getIpfs: `, getIpfs);
  console.groupEnd()
  try {

    return new IpldResolver({
      blockService: painfullyCompatibleBlockService(getIpfs()),
      formats: ipldFormats.filter(Boolean)
    })
  } catch (e) {
    console.log(e.trace)
    console.trace(e)
  }
}

// This wrapper ensures the new block service from js-ipfs AND js-ipfs-http-client
// works with the legacy code present in ipld-explorer-components
//
// (ir)rationale: we have no bandwidth to rewrite entire IPLD Explorer
// but thanks to it using only ipfs.block.get, making it extra compatible
// is not very expensive. This buys us some time, but this technical debt needs
// to be paid eventually.
function painfullyCompatibleBlockService (ipfs) {
  const blockService = new Proxy(ipfs.blockstore, {
    get: function (obj, prop) {
      if (prop === 'get') { // augument ipfs.block.get()
        return async (cid, options) => {
          let block
          try {
            block = await ipfs.blockstore.get(cid, options)
          } catch (e) {
            // recover when two different CID libraries are used,
            // and below error is produced by the modern ipfs-code
            if (e.toString().includes('Unknown type, must be binary type')) {
              block = await ipfs.blockstore.get(CID.parse(cid.toString()), options)
            } else {
              throw e
            }
          }
          // recover from new return type in modern JS APIs
          // https://github.com/ipfs/js-ipfs/pull/3990
          if (typeof block.cid === 'undefined') {
            return { cid, data: block }
          }
          return block
        }
      }
      return obj[prop]
    }
  })
  return blockService
}

async function getIpld () {
  console.group('getIpld')

  const ipldDepsImport = await Promise.allSettled([
    import(/* webpackChunkName: "ipld" */ 'ipld'),
    import(/* webpackChunkName: "ipld" */ '@ipld/dag-cbor'),
    import(/* webpackChunkName: "ipld" */ '@ipld/dag-pb'),
    import(/* webpackChunkName: "ipld" */ 'ipld-git'),
    import(/* webpackChunkName: "ipld" */ 'ipld-raw'),
    import(/* webpackChunkName: "ipld" */ 'ipld-ethereum')
  ])
  const ipldDeps = ipldDepsImport.map((pkg) => {
    if (pkg.status === 'rejected') {
      console.error(`Failed to load ipld dependency`, pkg.reason)
      return null
    }
    return pkg.value
  }).filter(Boolean)
  console.log(`ipldDeps: `, ipldDeps);

  // CommonJs exports object is .default when imported ESM style
  const [ipld, ...formats] = ipldDeps.map(mod => mod.default ?? mod)

  // ipldEthereum is an Object, each key points to a ipld format impl
  const ipldEthereum = formats.pop()
  console.log(`ipldEthereum: `, ipldEthereum);
  formats.push(...Object.values(ipldEthereum))
  console.log(`Object.values(ipldEthereum): `, Object.values(ipldEthereum));

  // ipldJson uses the new format, use the conversion tool
  const ipldJson = await import(/* webpackChunkName: "ipld" */ '@ipld/dag-json')
  formats.push(convert(ipldJson))
  console.log(`convert(ipldJson): `, convert(ipldJson));

  console.log(`formats: `, formats);
  console.groupEnd()

  return { ipld, formats }
}

export default makeBundle
